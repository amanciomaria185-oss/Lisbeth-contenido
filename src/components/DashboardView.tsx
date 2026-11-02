import React, { useState } from 'react';
import { ContentProject, UserProfile, ContentStatus } from '../types';
import { ExportService } from '../services/exportService';
import {
  Sparkles,
  Flame,
  Search,
  FileVideo,
  Calendar,
  Star,
  Copy,
  Check,
  MoreVertical,
  Clock,
  Eye,
  Trash2,
  Share2,
  FolderPlus,
  ArrowRight,
  TrendingUp,
  Layers,
  ShieldCheck,
  Video,
  Printer,
  FileText,
  FileCode,
  Film,
} from 'lucide-react';

interface DashboardViewProps {
  currentUser: UserProfile;
  projects: ContentProject[];
  onOpenProject: (project: ContentProject) => void;
  onNewContent: () => void;
  onNavigate: (tab: string) => void;
  onDuplicateProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  initialFilter?: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  projects,
  onOpenProject,
  onNewContent,
  onNavigate,
  onDuplicateProject,
  onDeleteProject,
  onToggleFavorite,
  initialFilter = 'all',
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    // Search
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.hook.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'filter-favorites') return p.isFavorite;
    if (selectedFilter === 'filter-pending')
      return p.status === 'idea' || p.status === 'pendiente' || p.status === 'en_produccion';
    if (selectedFilter === 'filter-ready')
      return p.status === 'listo' || p.status === 'publicado';

    if (selectedFilter !== 'all') {
      return p.status === selectedFilter;
    }
    return true;
  });

  const handleCopyHook = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getStatusBadge = (status: ContentStatus) => {
    switch (status) {
      case 'idea':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">Idea</span>;
      case 'pendiente':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-300 border border-sky-500/20">Pendiente</span>;
      case 'en_produccion':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">En Producción</span>;
      case 'listo':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">Listo para Publicar</span>;
      case 'publicado':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-300 border border-slate-500/20">Publicado</span>;
    }
  };

  // Metrics
  const total = projects.length;
  const inProduction = projects.filter((p) => p.status === 'en_produccion' || p.status === 'pendiente').length;
  const ready = projects.filter((p) => p.status === 'listo' || p.status === 'publicado').length;
  const favorites = projects.filter((p) => p.isFavorite).length;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Welcome & Brand Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-950/70 via-slate-900 to-indigo-950/70 border border-slate-800/80 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Suite Estratégica de Producción y Marketing</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Bienvenido, {currentUser.fullName}
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Plataforma activa para <strong className="text-violet-300">{currentUser.brandName}</strong> en el nicho de{' '}
              <span className="text-slate-100 font-medium">{currentUser.niche}</span>. Investiga tendencias reales, genera guiones escena por escena y organiza tu producción sin repetir ganchos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('viral_search')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs tracking-wide shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Film className="w-4 h-4" />
              <span>Buscador de Videos Virales</span>
            </button>
            <button
              onClick={onNewContent}
              className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs tracking-wide border border-slate-700 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>Crear Contenido</span>
            </button>
            <button
              onClick={() => onNavigate('trends')}
              className="px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 text-slate-200 hover:text-white font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Tendencias</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/60">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium">Total Contenidos</span>
              <Layers className="w-4 h-4 text-violet-400" />
            </div>
            <div className="text-2xl font-bold text-white">{total}</div>
            <span className="text-[11px] text-slate-500">Fichas de producción</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium">En Producción</span>
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-300">{inProduction}</div>
            <span className="text-[11px] text-slate-500">Guiones en proceso</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium">Listos / Publicados</span>
              <Check className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-300">{ready}</div>
            <span className="text-[11px] text-slate-500">Listos para monetizar</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-medium">Favoritos</span>
              <Star className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-300">{favorites}</div>
            <span className="text-[11px] text-slate-500">Plantillas maestras</span>
          </div>
        </div>
      </div>

      {/* Quick Launchpad Buttons */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span>Acciones Rápidas del Motor Viral</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          <div
            onClick={() => onNavigate('viral_search')}
            className="p-4 rounded-2xl bg-gradient-to-b from-indigo-950/50 to-slate-900 border border-indigo-500/40 hover:border-indigo-400 hover:bg-slate-900 cursor-pointer transition-all group shadow-lg"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Film className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5 mb-1">
              <h3 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                Buscador de Videos
              </h3>
              <span className="text-[9px] bg-indigo-500/20 text-indigo-300 font-extrabold px-1.5 py-0.2 rounded">
                Galería
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Videos reales de TikTok, Reels y FB con reproductor y adaptación directa.
            </p>
          </div>

          <div
            onClick={onNewContent}
            className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-violet-500/50 hover:bg-slate-900 cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-white mb-1 group-hover:text-violet-300 transition-colors">
              Estrategia Multi-Ángulo
            </h3>
            <p className="text-[11px] text-slate-400 leading-snug">
              Ingresa una idea o producto y genera 4 ángulos y guion completo.
            </p>
          </div>

          <div
            onClick={() => onNavigate('trends')}
            className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-orange-500/50 hover:bg-slate-900 cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-white mb-1 group-hover:text-orange-300 transition-colors">
              Investigar Tendencias
            </h3>
            <p className="text-[11px] text-slate-400 leading-snug">
              Búsqueda web con fuentes reales en TikTok, Reels y YouTube Shorts.
            </p>
          </div>

          <div
            onClick={() => onNavigate('analyzer')}
            className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-900 cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-600/20 text-sky-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-white mb-1 group-hover:text-sky-300 transition-colors">
              Analizar Referencia
            </h3>
            <p className="text-[11px] text-slate-400 leading-snug">
              Desglosa un video ajeno por ritmo y adáptalo éticamente a tu marca.
            </p>
          </div>

          <div
            onClick={() => onNavigate('scriptwriter')}
            className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-pink-500/50 hover:bg-slate-900 cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FileVideo className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-white mb-1 group-hover:text-pink-300 transition-colors">
              Generar Guion Escénico
            </h3>
            <p className="text-[11px] text-slate-400 leading-snug">
              Guion cinematográfico escena por escena con prompts visuales y voz.
            </p>
          </div>

          <div
            onClick={() => onNavigate('calendar')}
            className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 cursor-pointer transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
              Calendario 7-90 Días
            </h3>
            <p className="text-[11px] text-slate-400 leading-snug">
              Estructura una grilla de contenidos con variedad de categorías.
            </p>
          </div>
        </div>
      </div>

      {/* Projects Section with Filters & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-violet-400" />
              <span>Mis Proyectos y Fichas de Producción</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
                {filteredProjects.length}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Cada contenido incluye desglose de escenas, prompts de Midjourney/Sora, narración y copia de publicación.
            </p>
          </div>

          {/* Search bar */}
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Buscar por título, gancho o producto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-b border-slate-800/80 pb-3">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'idea', label: 'Ideas' },
            { id: 'en_produccion', label: 'En Producción' },
            { id: 'listo', label: 'Listos' },
            { id: 'publicado', label: 'Publicados' },
            { id: 'filter-favorites', label: '⭐ Favoritos' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === tab.id
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-slate-900/30 border border-slate-800/80 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-600/10 text-violet-400 flex items-center justify-center mx-auto">
              <FolderPlus className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">No hay contenidos en esta vista</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Crea tu primera estrategia inteligente o investiga tendencias para comenzar a poblar tus fichas de producción.
            </p>
            <button
              onClick={onNewContent}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 transition-all inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Crear Contenido
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 transition-all flex flex-col justify-between shadow-lg hover:shadow-xl"
              >
                <div className="space-y-3">
                  {/* Top Bar: Platform, Status, Favorite */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-violet-300 border border-slate-700 flex items-center gap-1">
                        <Video className="w-3 h-3 text-violet-400" />
                        {project.platform}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800/70 text-slate-400">
                        {project.category}
                      </span>
                      {getStatusBadge(project.status)}
                    </div>
                    <button
                      onClick={() => onToggleFavorite(project.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        project.isFavorite
                          ? 'text-amber-400 bg-amber-400/10'
                          : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                      }`}
                      title={project.isFavorite ? 'Quitar de favoritos' : 'Marcar favorito'}
                    >
                      <Star className={`w-4 h-4 ${project.isFavorite ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>

                  {/* Title & Product */}
                  <div>
                    <h3
                      onClick={() => onOpenProject(project)}
                      className="text-sm font-bold text-white group-hover:text-violet-300 cursor-pointer transition-colors line-clamp-2"
                    >
                      {project.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      Producto: <span className="text-slate-300">{project.productName}</span>
                    </p>
                  </div>

                  {/* Hook Quote Box */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 relative">
                    <div className="flex items-center justify-between text-[10px] font-bold text-violet-400 mb-1">
                      <span>GANCHO (0-3s)</span>
                      <button
                        onClick={() => handleCopyHook(project.hook, project.id)}
                        className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                        title="Copiar Gancho"
                      >
                        {copiedId === project.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-[10px] text-emerald-400">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 italic line-clamp-2">
                      "{project.hook}"
                    </p>
                  </div>

                  {/* Metrics preview */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>
                      {project.scenes?.length || 0} escenas • ~{project.totalEstimatedDurationSeconds || 45}s
                    </span>
                    {project.scheduledDate && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <Calendar className="w-3 h-3 text-indigo-400" />
                        {project.scheduledDate}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-4 mt-3 border-t border-slate-800/70 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={async () => {
                        const ok = await ExportService.copyToClipboard(ExportService.generateFullProductionText(project));
                        if (ok) {
                          setCopiedId(`prod_${project.id}`);
                          setTimeout(() => setCopiedId(null), 1800);
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-violet-600/15 hover:bg-violet-600/30 text-violet-300 text-[11px] font-bold border border-violet-500/30 flex items-center gap-1 transition-all cursor-pointer"
                      title="Copiar toda la producción organizada"
                    >
                      {copiedId === `prod_${project.id}` ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-300">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-violet-400" />
                          <span>Copiar Producción</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => ExportService.downloadPdf(project)}
                      className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Descargar en PDF"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => ExportService.downloadDocx(project)}
                      className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Descargar en Word (.docx)"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => ExportService.downloadTxt(project)}
                      className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Descargar en TXT"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onDuplicateProject(project.id)}
                      className="px-2 py-1 rounded-lg text-[11px] font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Duplicar contenido"
                    >
                      Duplicar
                    </button>
                    <button
                      onClick={() => onDeleteProject(project.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Eliminar contenido"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenProject(project)}
                      className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md shadow-violet-600/30 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ficha</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
