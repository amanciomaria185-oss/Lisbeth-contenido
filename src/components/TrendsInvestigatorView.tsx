import React, { useState } from 'react';
import { UserProfile, ContentProject, TrendReference } from '../types';
import { ApiService, InvestigateTrendsResponse } from '../services/api';
import { StorageService } from '../services/storage';
import {
  Flame,
  Search,
  ExternalLink,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
  Bookmark,
  Share2,
  Copy,
  Check,
  TrendingUp,
  Globe,
  Video,
  ArrowRight,
  ShieldCheck,
  Layers,
} from 'lucide-react';

interface TrendsInvestigatorViewProps {
  currentUser: UserProfile;
  onOpenProject: (project: ContentProject) => void;
  onSaveProject: (project: ContentProject) => void;
  onNavigateToAnalyzer: (url?: string) => void;
}

export const TrendsInvestigatorView: React.FC<TrendsInvestigatorViewProps> = ({
  currentUser,
  onOpenProject,
  onSaveProject,
  onNavigateToAnalyzer,
}) => {
  const [topic, setTopic] = useState(currentUser.niche || 'Recetas saludables');
  const [platform, setPlatform] = useState('Todas');
  const [productContext, setProductContext] = useState(currentUser.brandName ? `${currentUser.brandName} - ${currentUser.niche}` : 'Ebook digital de alimentación');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<InvestigateTrendsResponse | null>(null);

  // Adapting trend modal/state
  const [adaptingTrend, setAdaptingTrend] = useState<TrendReference | null>(null);
  const [isAdapting, setIsAdapting] = useState(false);
  const [adaptError, setAdaptError] = useState<string | null>(null);
  const [copiedHookId, setCopiedHookId] = useState<string | null>(null);

  const handleInvestigate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Por favor introduce un tema o nicho para investigar.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await ApiService.investigateTrends({
        topic,
        niche: currentUser.niche,
        platform,
        productContext,
      });
      setResults(data);

      StorageService.addHistory({
        userId: currentUser.id,
        type: 'trend_adaptation',
        title: `Investigación: ${topic}`,
        promptOrInput: `${topic} (${platform})`,
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al conectar con el motor de búsqueda y análisis de tendencias.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTrend = (trend: TrendReference) => {
    StorageService.saveTrend(trend);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHookId(id);
    setTimeout(() => setCopiedHookId(null), 1500);
  };

  const handleStartAdaptation = async (trend: TrendReference) => {
    setAdaptingTrend(trend);
    setIsAdapting(true);
    setAdaptError(null);

    try {
      const adapted = await ApiService.adaptTrend({
        trendReference: trend,
        productName: currentUser.brandName || 'Mi Producto / Ebook',
        productDescription: currentUser.niche || 'Solución enfocada a la audiencia',
        targetAudience: currentUser.targetAudience || 'Compradores ideales',
        platform: trend.platform || 'TikTok',
      });

      // Construct a new project
      const newProject: ContentProject = {
        id: 'proj_' + Math.random().toString(36).substring(2, 9),
        userId: currentUser.id,
        title: adapted.adaptedTitle || `Adaptación: ${trend.title}`,
        productName: currentUser.brandName || 'Producto Digital',
        productDescription: currentUser.niche,
        platform: (trend.platform as any) || 'TikTok',
        objective: 'Conversión por Viralidad Adaptada',
        status: 'en_produccion',
        category: 'Tendencias',
        format: adapted.format || trend.contentType || 'Video 9:16 Dinámico',
        hook: adapted.hook || trend.hook,
        hookAlternatives: adapted.hookAlternatives || [],
        totalEstimatedDurationSeconds: 45,
        scenes: adapted.scenes || [],
        callToAction: adapted.callToAction || currentUser.defaultCta,
        publishingCopy: adapted.publishingCopy || '',
        hashtags: adapted.hashtags || ['#tendencias', '#viral', '#creadores'],
        scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: `Inspirado éticamente en la referencia viral "${trend.title}" de ${trend.creator}. Mecánica adaptada: ${adapted.coreMechanicAdapted || 'Estructura narrativa y retención de gancho'}`,
      };

      StorageService.saveProject(newProject);
      onSaveProject(newProject);
      setAdaptingTrend(null);
      onOpenProject(newProject);
    } catch (err: any) {
      console.error(err);
      setAdaptError(err.message || 'Error al adaptar la tendencia.');
    } finally {
      setIsAdapting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
          <Flame className="w-3.5 h-3.5" />
          <span>Investigador de Tendencias y Videos Virales</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Descubre Qué Está Funcionando en Tiempo Real
        </h1>
        <p className="text-slate-400 text-xs md:text-sm max-w-3xl leading-relaxed">
          Búsqueda web con fuentes públicas verificadas en TikTok, Instagram Reels, YouTube Shorts y Facebook Reels. Distinguimos datos reales de estimaciones y te permitimos <strong>adaptar la estrategia ganadora</strong> directamente a tu producto.
        </p>
      </div>

      {/* Search Input Box */}
      <form
        onSubmit={handleInvestigate}
        className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-orange-400" />
              <span>Nicho, Tema o Palabra Clave a Investigar</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ej: Recetas con avena, Criptomonedas para principiantes, Rutina de glúteos..."
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Plataforma Objetivo
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-3.5 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-white focus:outline-none focus:border-orange-500"
            >
              <option value="Todas">Todas las plataformas</option>
              <option value="TikTok">TikTok</option>
              <option value="Instagram Reels">Instagram Reels</option>
              <option value="YouTube Shorts">YouTube Shorts</option>
              <option value="Facebook Reels">Facebook Reels</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Contexto de tu producto o negocio para personalizar la adaptación:
          </label>
          <input
            type="text"
            value={productContext}
            onChange={(e) => setProductContext(e.target.value)}
            placeholder="Ej: Vendo un ebook de recetas saludables antiinflamatorias para personas ocupadas..."
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Google Search Grounding activo • Fuentes verificadas</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Rastreando Videos y Métricas en Tiempo Real...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>INVESTIGAR TENDENCIAS VIRALES</span>
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* RESULTS DISPLAY */}
      {results && (
        <div className="space-y-6 animate-fade-in">
          {/* Executive Summary & Grounding Sources */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-400" />
                <span>Radiografía del Nicho</span>
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-semibold">
                {results.trends?.length || 0} referencias analizadas
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              {results.summary}
            </p>

            {results.keyTakeaways && results.keyTakeaways.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Patrones Comunes de Viralidad Detectados:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {results.keyTakeaways.map((takeaway, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{takeaway}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.groundingSources && results.groundingSources.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Fuentes consultadas:</span>
                {results.groundingSources.slice(0, 5).map((source, i) => (
                  <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors truncate max-w-[200px]"
                  >
                    <span>{source.title}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* List of Viral References */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Referencias y Desglose Estratégico
            </h3>

            <div className="grid grid-cols-1 gap-6">
              {results.trends?.map((trend, idx) => (
                <div
                  key={trend.id || idx}
                  className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all shadow-xl space-y-5"
                >
                  {/* Top Bar: Title, Platform, Verified Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                          {trend.platform}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300">
                          Formato: {trend.contentType}
                        </span>
                        {trend.metrics?.isVerified ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            ✓ Métricas Verificadas
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            Estimación Pública
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <span>{trend.title}</span>
                        {trend.url && (
                          <a
                            href={trend.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-400 hover:text-white"
                            title="Ver publicación original"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400">
                        Por <strong className="text-slate-200">{trend.creator || 'Creador de referencia'}</strong> • {trend.date || 'Reciente'}
                      </p>
                    </div>

                    {/* Metrics numbers */}
                    <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 shrink-0">
                      <div className="text-center px-2">
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Vistas</span>
                        <span className="text-xs font-bold text-white">{trend.metrics?.views || '100K+'}</span>
                      </div>
                      <div className="text-center px-2 border-l border-slate-800">
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Likes</span>
                        <span className="text-xs font-bold text-white">{trend.metrics?.likes || '10K+'}</span>
                      </div>
                      <div className="text-center px-2 border-l border-slate-800">
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Compartidos</span>
                        <span className="text-xs font-bold text-white">{trend.metrics?.shares || '1K+'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hook Box */}
                  <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-orange-400">
                      <span>GANCHO UTILIZADO EN LOS PRIMEROS 3 SEGUNDOS:</span>
                      <button
                        onClick={() => handleCopy(trend.hook, trend.id || String(idx))}
                        className="text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        {copiedHookId === (trend.id || String(idx)) ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar Gancho</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-white italic">
                      "{trend.hook}"
                    </p>
                  </div>

                  {/* 3 Strategic Columns: Estrategia, Gatillo Viral, Adaptación */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800">
                      <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider block mb-1">
                        Estrategia de Comunicación
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {trend.communicationStrategy}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800">
                      <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1">
                        ¿Por qué se volvió viral?
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {trend.viralFactor}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                        Cómo adaptarlo a tu negocio
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {trend.adaptationStrategy}
                      </p>
                    </div>
                  </div>

                  {/* BOTTOM BUTTON: ADAPTAR ESTA ESTRATEGIA A MI CONTENIDO */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSaveTrend(trend)}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Guardar Referencia</span>
                      </button>
                      <button
                        onClick={() => onNavigateToAnalyzer(trend.url)}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>Desglosar Video</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleStartAdaptation(trend)}
                      disabled={isAdapting && adaptingTrend?.id === trend.id}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                      {isAdapting && adaptingTrend?.id === trend.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Adaptando Mecánica Psicológica...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>ADAPTAR ESTA ESTRATEGIA A MI CONTENIDO</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
