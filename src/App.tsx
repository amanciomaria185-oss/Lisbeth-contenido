import React, { useState, useEffect } from 'react';
import { UserProfile, ContentProject } from './types';
import { StorageService } from './services/storage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AuthModal } from './components/AuthModal';
import { DashboardView } from './components/DashboardView';
import { ContentGeneratorView } from './components/ContentGeneratorView';
import { TrendsInvestigatorView } from './components/TrendsInvestigatorView';
import { VideoAnalyzerView } from './components/VideoAnalyzerView';
import { ScriptWriterView } from './components/ScriptWriterView';
import { ProductionSheetView } from './components/ProductionSheetView';
import { CalendarView } from './components/CalendarView';
import { AntiRepetitionView } from './components/AntiRepetitionView';
import { ProfileSettingsView } from './components/ProfileSettingsView';
import { ViralVideoSearchView } from './components/ViralVideoSearchView';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => StorageService.getCurrentUser());
  const [projects, setProjects] = useState<ContentProject[]>(() => StorageService.getProjects(currentUser.id));
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedProject, setSelectedProject] = useState<ContentProject | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [initialAnalyzerUrl, setInitialAnalyzerUrl] = useState<string>('');

  // Reload projects whenever current user changes
  useEffect(() => {
    const userProjects = StorageService.getProjects(currentUser.id);
    setProjects(userProjects);
  }, [currentUser]);

  const refreshProjects = () => {
    setProjects(StorageService.getProjects(currentUser.id));
  };

  const handleOpenProject = (project: ContentProject) => {
    setSelectedProject(project);
    setActiveTab('production_sheet');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewContent = () => {
    setSelectedProject(null);
    setActiveTab('generator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveProject = (project: ContentProject) => {
    StorageService.saveProject(project);
    refreshProjects();
    setSelectedProject(project);
  };

  const handleDuplicateProject = (id: string) => {
    const duplicated = StorageService.duplicateProject(id);
    if (duplicated) {
      refreshProjects();
      setSelectedProject(duplicated);
      setActiveTab('production_sheet');
    }
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar esta ficha de producción?')) {
      StorageService.deleteProject(id);
      refreshProjects();
      if (selectedProject?.id === id) {
        setSelectedProject(null);
        setActiveTab('dashboard');
      }
    }
  };

  const handleToggleFavorite = (id: string) => {
    StorageService.toggleFavorite(id);
    refreshProjects();
    if (selectedProject?.id === id) {
      const updated = StorageService.getProjectById(id);
      if (updated) setSelectedProject(updated);
    }
  };

  const handleNavigateToAnalyzer = (url?: string) => {
    if (url) setInitialAnalyzerUrl(url);
    setActiveTab('analyzer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Metrics for badges
  const favoritesCount = projects.filter((p) => p.isFavorite).length;
  const pendingCount = projects.filter((p) => p.status === 'idea' || p.status === 'pendiente' || p.status === 'en_produccion').length;
  const readyCount = projects.filter((p) => p.status === 'listo' || p.status === 'publicado').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-violet-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onNewContent={handleNewContent}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeTab={activeTab}
        indexedHooksCount={projects.length}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'projects') {
              setActiveTab('dashboard');
            } else {
              setActiveTab(tab);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          projectsCount={projects.length}
          favoritesCount={favoritesCount}
          pendingCount={pendingCount}
          readyCount={readyCount}
        />

        {/* Content View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              currentUser={currentUser}
              projects={projects}
              onOpenProject={handleOpenProject}
              onNewContent={handleNewContent}
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onDuplicateProject={handleDuplicateProject}
              onDeleteProject={handleDeleteProject}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {activeTab === 'viral_search' && (
            <ViralVideoSearchView
              currentUser={currentUser}
              onOpenProject={handleOpenProject}
              onSaveProject={handleSaveProject}
              onNavigateToTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeTab === 'generator' && (
            <ContentGeneratorView
              currentUser={currentUser}
              pastContents={projects}
              onSaveAsProject={handleSaveProject}
              onOpenProject={handleOpenProject}
            />
          )}

          {activeTab === 'trends' && (
            <TrendsInvestigatorView
              currentUser={currentUser}
              onOpenProject={handleOpenProject}
              onSaveProject={handleSaveProject}
              onNavigateToAnalyzer={handleNavigateToAnalyzer}
            />
          )}

          {activeTab === 'analyzer' && (
            <VideoAnalyzerView
              currentUser={currentUser}
              initialUrl={initialAnalyzerUrl}
              onOpenProject={handleOpenProject}
              onSaveProject={handleSaveProject}
            />
          )}

          {activeTab === 'scriptwriter' && (
            <ScriptWriterView
              currentUser={currentUser}
              pastContents={projects}
              onOpenProject={handleOpenProject}
              onSaveProject={handleSaveProject}
            />
          )}

          {activeTab === 'production_sheet' && selectedProject && (
            <ProductionSheetView
              project={selectedProject}
              onBack={() => setActiveTab('dashboard')}
              onSave={handleSaveProject}
              onDuplicate={handleDuplicateProject}
              onDelete={handleDeleteProject}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              currentUser={currentUser}
              projects={projects}
              onOpenProject={handleOpenProject}
              onSaveProject={handleSaveProject}
            />
          )}

          {activeTab === 'antirepetition' && (
            <AntiRepetitionView
              currentUser={currentUser}
              projects={projects}
              onOpenProject={handleOpenProject}
              onNewContent={handleNewContent}
            />
          )}

          {activeTab === 'settings' && (
            <ProfileSettingsView
              currentUser={currentUser}
              projects={projects}
              onUserUpdate={(u) => {
                setCurrentUser(u);
                refreshProjects();
              }}
              onRefreshProjects={refreshProjects}
            />
          )}

          {/* Filter view aliases */}
          {(activeTab === 'filter-favorites' || activeTab === 'filter-pending' || activeTab === 'filter-ready') && (
            <DashboardView
              currentUser={currentUser}
              projects={projects}
              initialFilter={activeTab}
              onOpenProject={handleOpenProject}
              onNewContent={handleNewContent}
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onDuplicateProject={handleDuplicateProject}
              onDeleteProject={handleDeleteProject}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        </main>
      </div>

      {/* Auth & Brand Profile Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onUserChange={(user) => {
          setCurrentUser(user);
          refreshProjects();
        }}
      />
    </div>
  );
}
