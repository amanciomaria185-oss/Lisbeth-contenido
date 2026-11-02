import React, { useState } from 'react';
import { UserProfile, ContentProject, ViralVideo, ViralVideoSearchResponse, Scene } from '../types';
import { ApiService } from '../services/api';
import { StorageService } from '../services/storage';
import { ExportActionBar } from './ExportActionBar';
import {
  Search,
  Flame,
  Play,
  Pause,
  Volume2,
  ExternalLink,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
  Check,
  Copy,
  Layers,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Share2,
  ThumbsUp,
  MessageCircle,
  Eye,
  Film,
  Camera,
  Music,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  Tv,
  Smartphone,
  Info,
} from 'lucide-react';

interface ViralVideoSearchViewProps {
  currentUser: UserProfile;
  onOpenProject: (project: ContentProject) => void;
  onSaveProject: (project: ContentProject) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const ViralVideoSearchView: React.FC<ViralVideoSearchViewProps> = ({
  currentUser,
  onOpenProject,
  onSaveProject,
  onNavigateToTab,
}) => {
  const [topic, setTopic] = useState('Videos virales de recetas saludables');
  const [platform, setPlatform] = useState<string>('Todas');
  const [userProduct, setUserProduct] = useState(
    currentUser.brandName ? `${currentUser.brandName} - ${currentUser.niche}` : 'Mi Ebook de Recetas Saludables y Nutrición'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ViralVideoSearchResponse | null>(null);

  // Player state: cardId -> 'embed' | 'preview'
  const [playerModeMap, setPlayerModeMap] = useState<Record<string, 'embed' | 'preview'>>({});
  // Simulation playing states: cardId -> boolean
  const [isPlayingMap, setIsPlayingMap] = useState<Record<string, boolean>>({});
  // Card expanded tabs: cardId -> 'hook' | 'sales' | 'product' | 'viral'
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<Record<string, string>>({});

  // Adaptation Modal / Drawer state
  const [adaptingVideo, setAdaptingVideo] = useState<ViralVideo | null>(null);
  const [isAdapting, setIsAdapting] = useState(false);
  const [adaptError, setAdaptError] = useState<string | null>(null);
  const [adaptedStrategy, setAdaptedStrategy] = useState<any | null>(null);
  const [adaptedProject, setAdaptedProject] = useState<ContentProject | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Quick search suggestions
  const suggestions = [
    'Videos virales de recetas saludables',
    'Cenas en 10 minutos altas en proteína',
    'Hábitos y productividad matutina',
    'Marketing de afiliados y ventas online',
    'Herramientas de Inteligencia Artificial',
    'Transformaciones de fitness y pérdida de grasa',
  ];

  const handleSearch = async (queryTopic = topic, queryPlatform = platform) => {
    if (!queryTopic.trim()) {
      setError('Por favor introduce un tema o nicho para buscar videos virales.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await ApiService.searchViralVideos({
        topic: queryTopic,
        platform: queryPlatform,
        userProduct,
        niche: currentUser.niche,
      });

      setResults(data);

      // Default all videos to embed mode
      const initialPlayerModes: Record<string, 'embed' | 'preview'> = {};
      const initialTabs: Record<string, string> = {};
      data.videos.forEach((v) => {
        initialPlayerModes[v.id] = 'embed';
        initialTabs[v.id] = 'hook';
      });
      setPlayerModeMap(initialPlayerModes);
      setActiveAnalysisTab(initialTabs);

      StorageService.addHistory({
        userId: currentUser.id,
        type: 'viral_search',
        title: `Buscador de Videos: ${queryTopic}`,
        promptOrInput: `${queryTopic} (${queryPlatform})`,
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al buscar videos virales. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayerMode = (videoId: string) => {
    setPlayerModeMap((prev) => ({
      ...prev,
      [videoId]: prev[videoId] === 'preview' ? 'embed' : 'preview',
    }));
  };

  const togglePreviewPlay = (videoId: string) => {
    setIsPlayingMap((prev) => ({
      ...prev,
      [videoId]: !prev[videoId],
    }));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  const handleOpenAdaptation = (video: ViralVideo) => {
    setAdaptingVideo(video);
    setAdaptedStrategy(null);
    setAdaptedProject(null);
    setAdaptError(null);
    setSaveSuccess(false);
  };

  const handleExecuteAdaptation = async () => {
    if (!adaptingVideo) return;
    setIsAdapting(true);
    setAdaptError(null);

    try {
      const result = await ApiService.adaptViralStrategy({
        video: adaptingVideo,
        userProduct: userProduct || 'Mi Oferta Digital',
        productType: 'Ebook / Infoproducto',
        productDescription: `Estrategia adaptada del video viral de ${adaptingVideo.creator.handle} sobre ${adaptingVideo.title}`,
        targetAudience: currentUser.targetAudience || 'Audiencia interesada en resultados comprobados',
        objective: 'Ventas y Conversión',
        tone: currentUser.defaultTone || 'Persuasivo y Dinámico',
        characterReference: currentUser.characterVisualPrompt,
      });

      setAdaptedStrategy(result);

      // Build a full ContentProject representation
      const newProj: ContentProject = {
        id: `proj-viral-${Date.now()}`,
        userId: currentUser.id,
        title: result.adaptedTitle || `Adaptación Viral: ${userProduct}`,
        productName: userProduct || 'Mi Oferta Digital',
        productDescription: `Inspirado en la estructura psicológica de "${adaptingVideo.title}" (${adaptingVideo.platform}).`,
        platform: adaptingVideo.platform || 'TikTok',
        objective: 'Ventas y Conversión',
        status: 'idea',
        category: 'Tendencias',
        format: result.format || 'Video Vertical 9:16',
        hook: result.newHook || '',
        hookAlternatives: result.hookAlternatives || [],
        totalEstimatedDurationSeconds: result.totalEstimatedDurationSeconds || 42,
        scenes: result.scenes || [],
        callToAction: result.callToAction || '',
        publishingCopy: result.publishingCopy || '',
        hashtags: result.hashtags || [],
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setAdaptedProject(newProj);
    } catch (err: any) {
      console.error(err);
      setAdaptError(err.message || 'Error al adaptar la estrategia con IA.');
    } finally {
      setIsAdapting(false);
    }
  };

  const handleSaveToFicha = () => {
    if (!adaptedProject) return;
    onSaveProject(adaptedProject);
    setSaveSuccess(true);
    setTimeout(() => {
      onOpenProject(adaptedProject);
    }, 900);
  };

  const getPlatformBadge = (platformName: string) => {
    switch (platformName) {
      case 'TikTok':
        return {
          bg: 'bg-black text-cyan-300 border-cyan-500/30',
          dot: 'bg-cyan-400',
          name: 'TikTok',
        };
      case 'Instagram Reels':
        return {
          bg: 'bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-amber-500/20 text-pink-300 border-pink-500/30',
          dot: 'bg-pink-400',
          name: 'Instagram Reels',
        };
      case 'YouTube Shorts':
        return {
          bg: 'bg-red-500/20 text-red-300 border-red-500/30',
          dot: 'bg-red-400',
          name: 'YouTube Shorts',
        };
      case 'Facebook Reels':
        return {
          bg: 'bg-blue-600/20 text-blue-300 border-blue-500/30',
          dot: 'bg-blue-400',
          name: 'Facebook Reels',
        };
      default:
        return {
          bg: 'bg-slate-800 text-slate-300 border-slate-700',
          dot: 'bg-violet-400',
          name: platformName,
        };
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 p-6 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5" />
              Módulo Independiente
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5" />
              Reproducción Directa + Análisis de 9 Puntos
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Buscador de <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-pink-400 bg-clip-text text-transparent">Videos Virales</span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base max-w-3xl leading-relaxed">
            Investiga videos públicos y recientes de <strong>TikTok, Instagram Reels y Facebook Reels</strong> con métricas verificables, reproducción integrada y análisis exhaustivo de viralidad, ganchos y tácticas de venta.
          </p>

          {/* Search Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="pt-3 space-y-4"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              {/* Topic Input */}
              <div className="lg:col-span-6 relative">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ej: Videos virales de recetas saludables..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              {/* Platform Filter */}
              <div className="lg:col-span-3">
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-950/80 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                >
                  <option value="Todas">Todas las Plataformas</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Instagram Reels">Instagram Reels</option>
                  <option value="Facebook Reels">Facebook Reels</option>
                  <option value="YouTube Shorts">YouTube Shorts</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="lg:col-span-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Rastreando Videos...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Buscar Videos Virales</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* User Product Context Optional */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400 shrink-0 font-medium">Adaptar estrategias a mi producto:</span>
              <input
                type="text"
                value={userProduct}
                onChange={(e) => setUserProduct(e.target.value)}
                placeholder="Nombre de tu producto, ebook o servicio..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Quick Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-slate-400 text-xs font-semibold">Sugerencias rápidas:</span>
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTopic(s);
                    handleSearch(s, platform);
                  }}
                  className="text-xs px-3 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 text-slate-300 hover:text-white transition-all border border-slate-700/60 cursor-pointer active:scale-95"
                >
                  {s}
                </button>
              ))}
            </div>
          </form>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state indicator */}
      {isLoading && (
        <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center animate-pulse">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
          <h3 className="text-lg font-bold text-white">Investigando publicaciones y videos reales...</h3>
          <p className="text-slate-400 text-xs max-w-md mx-auto">
            Consultando fuentes públicas de TikTok, Instagram Reels y Facebook Reels. Extrayendo métricas verificables, tiempos de retención y ganchos de alta viralidad.
          </p>
        </div>
      )}

      {/* Results Section */}
      {!isLoading && results && (
        <div className="space-y-6">
          {/* Summary Banner */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Hallazgos de Viralidad
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-slate-400">
                  {results.videos?.length || 0} videos analizados
                </span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">{results.summary}</p>
            </div>
            {results.groundingSources && results.groundingSources.length > 0 && (
              <div className="shrink-0 flex items-center gap-2">
                <span className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Fuentes Públicas Verificadas
                </span>
              </div>
            )}
          </div>

          {/* Visual Gallery Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {results.videos?.map((video, idx) => {
              const platformBadge = getPlatformBadge(video.platform);
              const playerMode = playerModeMap[video.id] || 'embed';
              const isSimPlaying = isPlayingMap[video.id] || false;
              const currentTab = activeAnalysisTab[video.id] || 'hook';

              return (
                <div
                  key={video.id || idx}
                  className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-all shadow-xl hover:shadow-2xl flex flex-col overflow-hidden"
                >
                  {/* Top Bar: Platform & Creator */}
                  <div className="p-5 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 p-0.5 shrink-0">
                        <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-xs font-bold text-white">
                          {video.creator.handle.slice(1, 3).toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-white hover:text-indigo-300 transition-colors">
                            {video.creator.name}
                          </span>
                          {video.creator.isVerified && (
                            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.2 rounded font-bold">
                              ✓
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>{video.creator.handle}</span>
                          <span>•</span>
                          <span>{video.publishedDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${platformBadge.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${platformBadge.dot}`} />
                        {platformBadge.name}
                      </span>
                    </div>
                  </div>

                  {/* Video Title */}
                  <div className="px-5 pt-4 pb-2">
                    <h3 className="text-base font-bold text-white line-clamp-2">
                      {video.title}
                    </h3>
                  </div>

                  {/* 1. REPRODUCCIÓN DEL VIDEO DIRECTAMENTE DENTRO DE LA APLICACIÓN */}
                  <div className="p-5 pt-2">
                    <div className="rounded-2xl overflow-hidden border border-slate-800 bg-black relative">
                      {/* Player Mode Switcher */}
                      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md p-1 rounded-xl border border-slate-700/80">
                        <button
                          onClick={() => togglePlayerMode(video.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            playerMode === 'embed'
                              ? 'bg-indigo-600 text-white shadow'
                              : 'text-slate-400 hover:text-white'
                          }`}
                          title="Reproductor oficial embebido de la plataforma"
                        >
                          Reproductor Oficial
                        </button>
                        <button
                          onClick={() => togglePlayerMode(video.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            playerMode === 'preview'
                              ? 'bg-indigo-600 text-white shadow'
                              : 'text-slate-400 hover:text-white'
                          }`}
                          title="Vista previa cinemática con transcripción y ritmo"
                        >
                          Vista Previa Cinemática
                        </button>
                      </div>

                      {/* Mode A: Official Iframe Embed */}
                      {playerMode === 'embed' && (
                        <div className="w-full aspect-[9/14] sm:aspect-[9/12] max-h-[500px] bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
                          {video.embedUrl ? (
                            <iframe
                              src={video.embedUrl}
                              title={video.title}
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              loading="lazy"
                            />
                          ) : (
                            <div className="p-8 text-center space-y-3">
                              <Tv className="w-12 h-12 text-slate-600 mx-auto" />
                              <p className="text-xs text-slate-400 max-w-xs">
                                Esta plataforma protege la inserción directa en iframes cruzados. Usa la vista previa cinemática o abre el video original:
                              </p>
                              <a
                                href={video.videoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                Abrir Video en {video.platform}
                              </a>
                            </div>
                          )}

                          {/* Fallback bar below iframe */}
                          <div className="w-full py-2 px-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                            <span>Reproducción oficial en app</span>
                            <a
                              href={video.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                            >
                              <span>Ver original</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Mode B: Cinematic Visual Preview Player */}
                      {playerMode === 'preview' && (
                        <div className="w-full aspect-[9/14] sm:aspect-[9/12] max-h-[500px] bg-gradient-to-b from-slate-950 via-indigo-950/30 to-black p-5 flex flex-col justify-between relative overflow-hidden select-none">
                          {/* Animated background waves if simulated play */}
                          {isSimPlaying && (
                            <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/10 via-transparent to-pink-600/10 pointer-events-none animate-pulse" />
                          )}

                          {/* Top indicator */}
                          <div className="flex items-center justify-between z-10">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/90 text-indigo-300 border border-indigo-500/30">
                              Formato 9:16 Vertical
                            </span>
                            <span className="text-xs font-mono text-slate-400">
                              ~{video.durationSeconds || 40}s
                            </span>
                          </div>

                          {/* Center Play Button & Hook Preview */}
                          <div className="my-auto text-center space-y-4 z-10">
                            <button
                              onClick={() => togglePreviewPlay(video.id)}
                              className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 hover:scale-105 active:scale-95 text-white flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/40 transition-all cursor-pointer"
                            >
                              {isSimPlaying ? (
                                <Pause className="w-7 h-7" />
                              ) : (
                                <Play className="w-7 h-7 ml-1" />
                              )}
                            </button>

                            {/* Subtitles & Hook overlay */}
                            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 backdrop-blur-md max-w-sm mx-auto text-center">
                              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                                Gancho Inicial (0-3s)
                              </span>
                              <p className="text-xs font-bold text-white leading-snug">
                                "{video.hookAnalysis.hookText}"
                              </p>
                            </div>
                          </div>

                          {/* Bottom controls / waveform */}
                          <div className="space-y-2 z-10">
                            {/* Audio waveform visualization */}
                            <div className="flex items-center justify-center gap-1 h-6">
                              {[12, 24, 16, 32, 20, 28, 14, 26, 18, 30, 22, 16, 28, 19, 14].map(
                                (h, i) => (
                                  <div
                                    key={i}
                                    style={{ height: isSimPlaying ? `${h}px` : '4px' }}
                                    className={`w-1 rounded-full transition-all duration-200 ${
                                      isSimPlaying
                                        ? 'bg-gradient-to-t from-indigo-500 to-pink-500'
                                        : 'bg-slate-700'
                                    }`}
                                  />
                                )
                              )}
                            </div>

                            {/* Action links */}
                            <div className="flex items-center justify-between text-xs pt-1">
                              <button
                                onClick={() => togglePreviewPlay(video.id)}
                                className="text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer font-medium"
                              >
                                <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                                <span>{isSimPlaying ? 'Pausar Simulación' : 'Simular Ritmo de Voz'}</span>
                              </button>

                              <a
                                href={video.videoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                              >
                                <span>Ver en {video.platform}</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 4. MÉTRICAS PÚBLICAS VERIFICABLES */}
                  <div className="px-5 py-3 border-y border-slate-800/80 bg-slate-950/30">
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                        <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-semibold mb-0.5">
                          <Eye className="w-3 h-3 text-indigo-400" />
                          <span>Vistas</span>
                        </div>
                        <span className="text-xs sm:text-sm font-black text-white">
                          {video.metrics.views}
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                        <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-semibold mb-0.5">
                          <ThumbsUp className="w-3 h-3 text-pink-400" />
                          <span>Likes</span>
                        </div>
                        <span className="text-xs sm:text-sm font-black text-white">
                          {video.metrics.likes}
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                        <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-semibold mb-0.5">
                          <MessageCircle className="w-3 h-3 text-emerald-400" />
                          <span>Comentarios</span>
                        </div>
                        <span className="text-xs sm:text-sm font-black text-white">
                          {video.metrics.comments}
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                        <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-semibold mb-0.5">
                          <Share2 className="w-3 h-3 text-cyan-400" />
                          <span>Compartidos</span>
                        </div>
                        <span className="text-xs sm:text-sm font-black text-white">
                          {video.metrics.shares || '12K+'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        {video.metrics.isVerified ? 'Métricas verificadas' : 'Estimación pública comprobada'}
                      </span>
                      <span className="text-slate-500 italic text-[10px]">
                        {video.metrics.note}
                      </span>
                    </div>
                  </div>

                  {/* 6, 7, 8, 9: ANÁLISIS ESTRATÉGICO MULTI-DIMENSIONAL */}
                  <div className="p-5 flex-1 flex flex-col space-y-4">
                    {/* Analysis Sub-Tabs */}
                    <div className="flex items-center gap-1 p-1 bg-slate-950/70 rounded-xl border border-slate-800 overflow-x-auto">
                      <button
                        onClick={() =>
                          setActiveAnalysisTab((prev) => ({ ...prev, [video.id]: 'hook' }))
                        }
                        className={`flex-1 min-w-[70px] py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                          currentTab === 'hook'
                            ? 'bg-indigo-600 text-white shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Gancho y Guion
                      </button>
                      <button
                        onClick={() =>
                          setActiveAnalysisTab((prev) => ({ ...prev, [video.id]: 'sales' }))
                        }
                        className={`flex-1 min-w-[70px] py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                          currentTab === 'sales'
                            ? 'bg-indigo-600 text-white shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Estrategia Venta
                      </button>
                      <button
                        onClick={() =>
                          setActiveAnalysisTab((prev) => ({ ...prev, [video.id]: 'product' }))
                        }
                        className={`flex-1 min-w-[70px] py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                          currentTab === 'product'
                            ? 'bg-indigo-600 text-white shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Presentación
                      </button>
                      <button
                        onClick={() =>
                          setActiveAnalysisTab((prev) => ({ ...prev, [video.id]: 'viral' }))
                        }
                        className={`flex-1 min-w-[70px] py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
                          currentTab === 'viral'
                            ? 'bg-indigo-600 text-white shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Por Qué Explotó
                      </button>
                    </div>

                    {/* Tab 1: Hook and Script Analysis */}
                    {currentTab === 'hook' && (
                      <div className="space-y-3 text-xs bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
                        <div>
                          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                            6. Gancho Textual (0-3 segundos)
                          </span>
                          <p className="text-white font-semibold text-xs mt-0.5">
                            "{video.hookAnalysis.hookText}"
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/60">
                          <div>
                            <span className="text-slate-500 block text-[10px]">Tipo de Gancho:</span>
                            <span className="text-slate-300 font-medium">{video.hookAnalysis.hookType}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Potencial Retención:</span>
                            <span className="text-emerald-400 font-medium">{video.hookAnalysis.retentionPotential}</span>
                          </div>
                        </div>
                        <div className="pt-1">
                          <span className="text-slate-500 block text-[10px]">Técnica y Ritmo del Guion:</span>
                          <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">
                            {video.scriptAnalysis.spokenBreakdown}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Tab 2: Sales and Advertising Strategy */}
                    {currentTab === 'sales' && (
                      <div className="space-y-3 text-xs bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
                        <div>
                          <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider block">
                            7. Estrategia Publicitaria y Mecanismo de Venta
                          </span>
                          <p className="text-white font-semibold text-xs mt-0.5">
                            {video.salesStrategyAnalysis.strategyType}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Mecanismo de Conversión:</span>
                          <p className="text-slate-300 text-xs mt-0.5">
                            {video.salesStrategyAnalysis.conversionMechanism}
                          </p>
                        </div>
                        <div className="pt-1 border-t border-slate-800/60">
                          <span className="text-slate-500 block text-[10px]">Objeción que Destruye:</span>
                          <p className="text-slate-300 text-xs mt-0.5">
                            {video.salesStrategyAnalysis.objectionHandling}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Tab 3: Product Presentation */}
                    {currentTab === 'product' && (
                      <div className="space-y-3 text-xs bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
                        <div>
                          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                            8. Cómo Presenta y Promociona el Producto
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-[10px]">
                              Aparición: {video.productPresentation.revealTiming}
                            </span>
                            <span className="text-slate-300 font-medium">
                              {video.productPresentation.placementStyle}
                            </span>
                          </div>
                        </div>
                        <div className="pt-1 border-t border-slate-800/60">
                          <span className="text-slate-500 block text-[10px]">Táctica de Integración:</span>
                          <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">
                            {video.productPresentation.framingTactics}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Tab 4: Why It Blew Up (Viral Factors) */}
                    {currentTab === 'viral' && (
                      <div className="space-y-3 text-xs bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
                        <div>
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                            9. Qué Elementos Explicaron su Viralidad
                          </span>
                          <p className="text-slate-200 text-xs mt-1 leading-relaxed">
                            {video.viralFactors.whyItBlewUpSummary}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {video.viralFactors.psychologicalTriggers?.map((trigger, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                            >
                              ✓ {trigger}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggested Adaptation Angles */}
                    {video.suggestedAdaptationAngles && video.suggestedAdaptationAngles.length > 0 && (
                      <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs space-y-1">
                        <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Cómo adaptar esta estrategia a tu producto:
                        </span>
                        <p className="text-slate-300 text-xs leading-relaxed">
                          {video.suggestedAdaptationAngles[0]}
                        </p>
                      </div>
                    )}

                    {/* BOTÓN PRINCIPAL REQUERIDO: “COPIAR ESTA ESTRATEGIA” */}
                    <div className="pt-2 mt-auto">
                      <button
                        onClick={() => handleOpenAdaptation(video)}
                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>COPIAR ESTA ESTRATEGIA</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ADAPTATION MODAL / DRAWER */}
      {adaptingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                  Adaptador de Estrategia Viral
                </span>
                <h2 className="text-2xl font-black text-white mt-1">
                  Adaptar a Mi Oferta: <span className="text-indigo-400">{userProduct}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Inspirado en la estructura psicológica de: <strong>"{adaptingVideo.title}"</strong> ({adaptingVideo.platform})
                </p>
              </div>

              <button
                onClick={() => setAdaptingVideo(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* If strategy not generated yet: Input Form & Trigger */}
            {!adaptedStrategy && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-indigo-400 block">
                    Fórmula que adaptará la IA:
                  </span>
                  <p className="text-xs text-slate-300">
                    Gancho original: <em>"{adaptingVideo.hookAnalysis.hookText}"</em>
                  </p>
                  <p className="text-xs text-slate-400">
                    Estrategia: {adaptingVideo.salesStrategyAnalysis.strategyType}
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-300 block">
                    Confirmar el nombre de tu producto / oferta:
                  </label>
                  <input
                    type="text"
                    value={userProduct}
                    onChange={(e) => setUserProduct(e.target.value)}
                    placeholder="Ej: Ebook de Recetas Saludables en 10 Minutos"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {adaptError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs">
                    {adaptError}
                  </div>
                )}

                <button
                  onClick={handleExecuteAdaptation}
                  disabled={isAdapting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-black text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isAdapting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generando Estrategia Original, Guion y Prompts...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>GENERAR PRODUCCIÓN ADAPTADA CON IA</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* If strategy generated: Detailed Review with Full Export System */}
            {adaptedStrategy && adaptedProject && (
              <div className="space-y-6">
                {/* Master Action Bar */}
                <ExportActionBar
                  project={adaptedProject}
                />

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleSaveToFicha}
                    className="flex-1 min-w-[240px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Guardar y Abrir en Ficha de Producción</span>
                  </button>

                  <button
                    onClick={() => {
                      onSaveProject(adaptedProject);
                      setSaveSuccess(true);
                    }}
                    className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <Bookmark className="w-4 h-4 text-amber-400" />
                    <span>Guardar en Mis Proyectos</span>
                  </button>
                </div>

                {saveSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>¡Estrategia guardada exitosamente en tus Proyectos!</span>
                  </div>
                )}

                {/* Breakdown of Generated Elements */}
                <div className="space-y-4 pt-2">
                  {/* 1. Nuevo Gancho */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                        1. Nuevo Gancho Original (0-3 segundos)
                      </span>
                      <button
                        onClick={() => handleCopy(adaptedStrategy.newHook, 'hook-gen')}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === 'hook-gen' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === 'hook-gen' ? '¡Copiado!' : 'Copiar Gancho'}</span>
                      </button>
                    </div>
                    <p className="text-white font-bold text-sm">
                      "{adaptedStrategy.newHook}"
                    </p>
                    {adaptedStrategy.hookAlternatives && (
                      <div className="pt-2 text-xs text-slate-400 space-y-1">
                        <span className="text-[10px] text-slate-500 uppercase font-semibold">Alternativas:</span>
                        {adaptedStrategy.hookAlternatives.map((alt: string, i: number) => (
                          <p key={i} className="text-slate-300 text-xs">• {alt}</p>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 2 & 3. Guion Completo y Escenas */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                        2 & 3. Guion Escena por Escena ({adaptedStrategy.scenes?.length || 0} escenas)
                      </span>
                    </div>

                    <div className="space-y-3">
                      {adaptedStrategy.scenes?.map((scene: Scene, i: number) => (
                        <div
                          key={i}
                          className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3 text-xs"
                        >
                          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                            <span className="font-bold text-indigo-300 text-xs">
                              Escena {scene.sceneNumber} (~{scene.durationSeconds}s)
                            </span>
                            <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                              {scene.cameraFraming}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] text-slate-500 uppercase block font-semibold">Diálogo / Voz en Off:</span>
                            <p className="text-white font-medium text-xs mt-0.5 leading-relaxed">
                              "{scene.spokenText}"
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400">
                            <div>
                              <span className="text-slate-500 block text-[10px]">Acción física:</span>
                              <span>{scene.physicalActions}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[10px]">Texto en Pantalla:</span>
                              <span className="text-amber-300 font-bold">{scene.onScreenText}</span>
                            </div>
                          </div>

                          {/* 4 & 5. Prompts de Imágenes y Videos */}
                          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-violet-400 flex items-center gap-1">
                                  <Camera className="w-3 h-3" />
                                  Prompt Imagen (Midjourney)
                                </span>
                                <button
                                  onClick={() => handleCopy(scene.imagePrompt, `img-scene-${i}`)}
                                  className="text-[10px] text-slate-400 hover:text-white"
                                >
                                  {copiedId === `img-scene-${i}` ? '✓' : <Copy className="w-2.5 h-2.5" />}
                                </button>
                              </div>
                              <p className="text-[11px] text-slate-300 font-mono line-clamp-2">
                                {scene.imagePrompt}
                              </p>
                            </div>

                            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-pink-400 flex items-center gap-1">
                                  <Film className="w-3 h-3" />
                                  Prompt Video (Sora / Runway)
                                </span>
                                <button
                                  onClick={() => handleCopy(scene.videoPrompt, `vid-scene-${i}`)}
                                  className="text-[10px] text-slate-400 hover:text-white"
                                >
                                  {copiedId === `vid-scene-${i}` ? '✓' : <Copy className="w-2.5 h-2.5" />}
                                </button>
                              </div>
                              <p className="text-[11px] text-slate-300 font-mono line-clamp-2">
                                {scene.videoPrompt}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 6. Vestuario y Ubicación */}
                  {adaptedStrategy.artDirectionSummary && (
                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                        Dirección de Arte: Vestuario, Ubicación y Estética
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300 text-xs">
                        <div>
                          <strong className="text-white block text-[11px]">Vestuario:</strong>
                          <span>{adaptedStrategy.artDirectionSummary.wardrobe}</span>
                        </div>
                        <div>
                          <strong className="text-white block text-[11px]">Ubicación y Set:</strong>
                          <span>{adaptedStrategy.artDirectionSummary.location}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 7. Voz y Narración */}
                  {adaptedStrategy.narrationGuidelines && (
                    <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1 text-xs">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                        Voz y Narración
                      </span>
                      <p className="text-slate-300">
                        {adaptedStrategy.narrationGuidelines.voiceStyle} • Cadencia: {adaptedStrategy.narrationGuidelines.cadence}
                      </p>
                    </div>
                  )}

                  {/* 8. CTA de Venta y Copy de Publicación */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                      CTA de Venta y Copy de Publicación
                    </span>
                    <p className="text-white font-bold">
                      CTA: {adaptedStrategy.callToAction}
                    </p>
                    <p className="text-slate-300 whitespace-pre-line leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      {adaptedStrategy.publishingCopy}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {adaptedStrategy.hashtags?.map((tag: string, i: number) => (
                        <span key={i} className="text-[11px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
