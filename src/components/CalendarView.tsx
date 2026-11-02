import React, { useState } from 'react';
import { UserProfile, ContentProject, ContentCategory, ContentStatus } from '../types';
import { ApiService } from '../services/api';
import { StorageService } from '../services/storage';
import {
  Calendar as CalendarIcon,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
  Plus,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  FileText,
  Video,
} from 'lucide-react';

interface CalendarViewProps {
  currentUser: UserProfile;
  projects: ContentProject[];
  onOpenProject: (project: ContentProject) => void;
  onSaveProject: (project: ContentProject) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  currentUser,
  projects,
  onOpenProject,
  onSaveProject,
}) => {
  const [daysCount, setDaysCount] = useState<number>(15);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planSummary, setPlanSummary] = useState<string | null>(null);

  // Active view: 'list' or 'grid'
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories: ContentCategory[] = [
    'Educación',
    'Entretenimiento',
    'Marketing',
    'Inspiración',
    'Consejos',
    'Tutoriales',
    'Promoción',
    'Ventas',
    'Marca personal',
    'Tendencias',
    'Historias y experiencias',
  ];

  const handleGenerateCalendar = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ApiService.generateCalendar({
        daysCount,
        niche: currentUser.niche,
        productName: currentUser.brandName || 'Producto digital',
        productDescription: currentUser.niche,
        targetAudience: currentUser.targetAudience,
        platform: 'TikTok',
        categories,
      });

      setPlanSummary(data.distributionSummary || `Plan de ${daysCount} días balanceado estratégicamente.`);

      // Create projects for each day in calendar
      if (data.calendar && Array.isArray(data.calendar)) {
        data.calendar.forEach((dayItem: any, index: number) => {
          const dateObj = new Date(Date.now() + index * 86400000);
          const dateStr = dateObj.toISOString().split('T')[0];

          const newProj: ContentProject = {
            id: 'cal_' + Math.random().toString(36).substring(2, 9),
            userId: currentUser.id,
            title: dayItem.title || `Día ${index + 1}: ${dayItem.category}`,
            productName: currentUser.brandName || 'Producto Digital',
            productDescription: currentUser.niche,
            platform: (dayItem.platform as any) || 'TikTok',
            objective: dayItem.objective || 'Atracción',
            status: 'idea',
            category: dayItem.category || 'Educación',
            format: dayItem.format || 'Talking Head 9:16',
            hook: dayItem.hook || 'Gancho de impacto',
            hookAlternatives: [],
            totalEstimatedDurationSeconds: 40,
            scenes: [
              {
                sceneNumber: 1,
                durationSeconds: 4,
                spokenText: dayItem.hook || 'Gancho',
                physicalActions: 'Mirada frontal directa.',
                expressions: 'Expresión intrigante.',
                location: 'Estudio o entorno de trabajo.',
                wardrobe: 'Casual elegante.',
                lighting: 'Luz principal suave.',
                cameraFraming: 'Primer plano a la altura de los ojos.',
                musicAndAudio: 'Golpe de tensión suave.',
                transitions: 'Zoom in sutil.',
                onScreenText: dayItem.title,
                imagePrompt: `9:16 vertical shot of creator in modern studio, soft warm lighting, 85mm lens.`,
                videoPrompt: `Creator speaks with direct eye contact, cinematic slow push-in.`,
                narration: {
                  voiceType: 'Voz natural y profesional',
                  emotion: 'Interesante',
                  speed: 'Normal',
                  pauses: '[Pausa]',
                  emphasis: ['importante'],
                },
              },
            ],
            callToAction: currentUser.defaultCta,
            publishingCopy: `${dayItem.briefOutline || dayItem.title} 👇 Comenta o toca el enlace en bio.`,
            hashtags: ['#viral', '#creaciondecontenido', '#estrategia'],
            scheduledDate: dateStr,
            isFavorite: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          StorageService.saveProject(newProj);
          onSaveProject(newProj);
        });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al generar el calendario estratégico.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (projectId: string, newStatus: ContentStatus) => {
    const proj = projects.find((p) => p.id === projectId);
    if (proj) {
      const updated = { ...proj, status: newStatus };
      StorageService.saveProject(updated);
      onSaveProject(updated);
    }
  };

  const handleMoveDay = (projectId: string, deltaDays: number) => {
    const proj = projects.find((p) => p.id === projectId);
    if (proj && proj.scheduledDate) {
      const currentDate = new Date(proj.scheduledDate);
      currentDate.setDate(currentDate.getDate() + deltaDays);
      const newDateStr = currentDate.toISOString().split('T')[0];
      const updated = { ...proj, scheduledDate: newDateStr };
      StorageService.saveProject(updated);
      onSaveProject(updated);
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (selectedCategoryFilter === 'all') return true;
    return p.category === selectedCategoryFilter;
  });

  // Sort by scheduledDate
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (!a.scheduledDate) return 1;
    if (!b.scheduledDate) return -1;
    return a.scheduledDate.localeCompare(b.scheduledDate);
  });

  const getCategoryColor = (cat: ContentCategory) => {
    switch (cat) {
      case 'Educación':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
      case 'Entretenimiento':
        return 'text-pink-400 bg-pink-500/10 border-pink-500/20';
      case 'Marketing':
        return 'text-violet-400 bg-violet-500/10 border-violet-500/20';
      case 'Ventas':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Inspiración':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Tendencias':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      default:
        return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Planificador de 7 a 90 Días de Contenido</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Calendario Editorial Inteligente
          </h1>
          <p className="text-slate-400 text-xs md:text-sm max-w-2xl leading-relaxed">
            Genera un plan con variedad garantizada de categorías (Educación, Entretenimiento, Marketing, Tutoriales, Ventas). Mueve contenidos de fecha y mantén control de qué está en producción y qué listo para publicar.
          </p>
        </div>

        {/* Calendar Generator CTA Bar */}
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3">
          <select
            value={daysCount}
            onChange={(e) => setDaysCount(Number(e.target.value))}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
          >
            <option value={7}>7 Días (1 Semana)</option>
            <option value={15}>15 Días (Quincena)</option>
            <option value={30}>30 Días (1 Mes Completo)</option>
            <option value={60}>60 Días (2 Meses)</option>
            <option value={90}>90 Días (Trimestre Maestro)</option>
          </select>

          <button
            onClick={handleGenerateCalendar}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generando {daysCount} Días...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Planificar {daysCount} Días con IA</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {planSummary && (
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{planSummary}</span>
        </div>
      )}

      {/* Filter by Category & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs">
          <button
            onClick={() => setSelectedCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
              selectedCategoryFilter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Todas ({projects.length})
          </button>
          {categories.map((cat) => {
            const count = projects.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center gap-1 ${
                  selectedCategoryFilter === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <span>{cat}</span>
                {count > 0 && <span className="text-[10px] opacity-75">({count})</span>}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-end">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
              viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Cuadrícula
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
              viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Lista Cronológica
          </button>
        </div>
      </div>

      {/* CALENDAR VIEW CONTENT */}
      {sortedProjects.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
          <CalendarIcon className="w-12 h-12 text-indigo-400/50 mx-auto" />
          <h3 className="text-sm font-bold text-white">No hay contenidos en el calendario</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Haz clic en "Planificar con IA" arriba para estructurar 7, 15, 30, 60 o 90 días con fichas técnicas completas.
          </p>
          <button
            onClick={handleGenerateCalendar}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all"
          >
            Generar 15 Días Ahora
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedProjects.map((p) => {
            const catBadge = getCategoryColor(p.category);
            return (
              <div
                key={p.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 flex flex-col justify-between space-y-4 transition-all shadow-md"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-indigo-400 flex items-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>{p.scheduledDate || 'Sin programar'}</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${catBadge}`}>
                      {p.category}
                    </span>
                  </div>

                  <h3
                    onClick={() => onOpenProject(p)}
                    className="text-sm font-bold text-white hover:text-indigo-300 cursor-pointer transition-colors line-clamp-2"
                  >
                    {p.title}
                  </h3>

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs italic text-slate-300 line-clamp-2">
                    "{p.hook}"
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-800/80">
                  {/* Status & Move controls */}
                  <div className="flex items-center justify-between text-xs">
                    <select
                      value={p.status}
                      onChange={(e) => handleStatusChange(p.id, e.target.value as ContentStatus)}
                      className="px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-semibold text-slate-200"
                    >
                      <option value="idea">💡 Idea</option>
                      <option value="pendiente">⏳ Pendiente</option>
                      <option value="en_produccion">🎬 En Producción</option>
                      <option value="listo">✅ Listo</option>
                      <option value="publicado">🚀 Publicado</option>
                    </select>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveDay(p.id, -1)}
                        className="p-1 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                        title="Mover un día antes"
                      >
                        <ChevronLeft className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleMoveDay(p.id, 1)}
                        className="p-1 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                        title="Mover un día después"
                      >
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenProject(p)}
                    className="w-full py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold border border-indigo-500/30 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Abrir Ficha de Producción</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedProjects.map((p) => {
            const catBadge = getCategoryColor(p.category);
            return (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-24 shrink-0 text-xs font-bold text-indigo-400 flex items-center gap-1 pt-1">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>{p.scheduledDate || 'Sin fecha'}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${catBadge}`}>
                        {p.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">{p.platform}</span>
                    </div>
                    <h4
                      onClick={() => onOpenProject(p)}
                      className="text-sm font-bold text-white hover:text-indigo-300 cursor-pointer"
                    >
                      {p.title}
                    </h4>
                    <p className="text-xs text-slate-400 italic">"{p.hook}"</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <select
                    value={p.status}
                    onChange={(e) => handleStatusChange(p.id, e.target.value as ContentStatus)}
                    className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold text-slate-200"
                  >
                    <option value="idea">💡 Idea</option>
                    <option value="pendiente">⏳ Pendiente</option>
                    <option value="en_produccion">🎬 En Producción</option>
                    <option value="listo">✅ Listo</option>
                    <option value="publicado">🚀 Publicado</option>
                  </select>

                  <button
                    onClick={() => onOpenProject(p)}
                    className="px-4 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-semibold border border-indigo-500/30 transition-all"
                  >
                    Abrir Ficha
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
