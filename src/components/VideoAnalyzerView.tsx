import React, { useState, useEffect } from 'react';
import { UserProfile, ContentProject } from '../types';
import { ApiService, AnalyzeLinkResponse } from '../services/api';
import { StorageService } from '../services/storage';
import {
  Search,
  Sparkles,
  Link as LinkIcon,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileVideo,
  ArrowRight,
  Share2,
  Copy,
  Layers,
  Check,
} from 'lucide-react';

interface VideoAnalyzerViewProps {
  currentUser: UserProfile;
  initialUrl?: string;
  onOpenProject: (project: ContentProject) => void;
  onSaveProject: (project: ContentProject) => void;
}

export const VideoAnalyzerView: React.FC<VideoAnalyzerViewProps> = ({
  currentUser,
  initialUrl = '',
  onOpenProject,
  onSaveProject,
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [videoDescription, setVideoDescription] = useState('');
  const [targetProduct, setTargetProduct] = useState(
    currentUser.brandName ? `${currentUser.brandName} (${currentUser.niche})` : 'Mi Producto Digital'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeLinkResponse | null>(null);

  useEffect(() => {
    if (initialUrl) {
      setUrl(initialUrl);
    }
  }, [initialUrl]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() && !videoDescription.trim()) {
      setError('Por favor introduce un enlace o una descripción del video a desglosar.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const data = await ApiService.analyzeLink({
        url,
        videoDescription,
        targetProduct,
      });
      setAnalysisResult(data);

      StorageService.addHistory({
        userId: currentUser.id,
        type: 'link_analysis',
        title: `Desglose de video: ${url ? url.slice(0, 35) + '...' : 'Descripción'}`,
        promptOrInput: url || videoDescription,
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al analizar el video de referencia.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvertToFicha = () => {
    if (!analysisResult) return;

    const ad = analysisResult.adaptationStrategy;
    const newProject: ContentProject = {
      id: 'proj_' + Math.random().toString(36).substring(2, 9),
      userId: currentUser.id,
      title: ad.adaptedConceptTitle || 'Concepto Adaptado de Referencia Viral',
      productName: currentUser.brandName || 'Producto Digital',
      productDescription: currentUser.niche,
      platform: 'TikTok',
      objective: 'Conversión por Retención y Gancho',
      status: 'en_produccion',
      category: 'Marketing',
      format: analysisResult.originalAnalysis?.detectedFormat || 'Talking Head + B-Roll Dinámico',
      hook: ad.newHookOptionA || 'Gancho magnético adaptado',
      hookAlternatives: ad.newHookOptionB ? [ad.newHookOptionB] : [],
      totalEstimatedDurationSeconds: 45,
      scenes: [
        {
          sceneNumber: 1,
          durationSeconds: 4,
          spokenText: ad.newHookOptionA || 'Gancho inicial',
          physicalActions: 'Contacto visual directo con micro-gesto de revelación.',
          expressions: 'Expresión seria y convincente.',
          location: 'Entorno limpio y profesional.',
          wardrobe: 'Ropa casual moderna acorde a la marca.',
          lighting: 'Luz principal suave a 45 grados.',
          cameraFraming: 'Primer plano medio a la altura de los ojos.',
          musicAndAudio: 'Efecto de subgrave sutil.',
          transitions: 'Zoom in dinámico.',
          onScreenText: '🚨 ATENCIÓN',
          imagePrompt: 'Photorealistic vertical 9:16 shot of creator looking directly into camera with intense focus, studio lighting, shallow depth of field.',
          videoPrompt: 'Creator speaks passionately with direct eye contact, slight zoom in, high quality cinematic framing.',
          narration: {
            voiceType: 'Voz con autoridad',
            emotion: 'Determinada',
            speed: 'Media',
            pauses: '[Pausa 0.5s]',
            emphasis: ['clave', 'importante'],
          },
        },
      ],
      callToAction: currentUser.defaultCta || 'Comenta para recibir el enlace directo',
      publishingCopy: `¿Sabías cómo cambia el resultado cuando aplicas la estrategia correcta? 👇 Enlace completo en mi perfil.`,
      hashtags: ['#marketingdigital', '#viral', '#creaciondecontenido'],
      scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: `Desglose de referencia original: ${url || 'Video aportado'}. Insight central: ${ad.coreInsight}`,
    };

    StorageService.saveProject(newProject);
    onSaveProject(newProject);
    onOpenProject(newProject);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-16">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
          <Search className="w-3.5 h-3.5" />
          <span>Analizador Quirúrgico de Videos de Referencia</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Ingeniería Inversa de Videos Exitosos
        </h1>
        <p className="text-slate-400 text-xs md:text-sm max-w-2xl leading-relaxed">
          Pega el enlace de un TikTok, Reel o Short de cualquier competidor o creador, o describe lo que ocurre en el video. La IA diseccionará el gancho, el ritmo narrativo, los cortes y te entregará una adaptación 100% original.
        </p>
      </div>

      <form onSubmit={handleAnalyze} className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-sky-400" />
            <span>Enlace del Video de Referencia (TikTok, Instagram Reels, YouTube Shorts)</span>
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.tiktok.com/@creador/video/... o https://www.instagram.com/reel/..."
            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Descripción o transcripción de lo que pasa en el video (Obligatorio si el enlace es privado o restringido):
          </label>
          <textarea
            rows={3}
            value={videoDescription}
            onChange={(e) => setVideoDescription(e.target.value)}
            placeholder="Describe qué dice el creador en los primeros 3 segundos, qué muestra, cómo corta a B-Roll, cómo introduce su producto y qué pide al final..."
            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Tu producto o negocio al que adaptar la mecánica:
          </label>
          <input
            type="text"
            value={targetProduct}
            onChange={(e) => setTargetProduct(e.target.value)}
            placeholder="Ej: Ebook de Recetas Antiinflamatorias para mujeres ocupadas"
            className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
          />
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-sky-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Desarmando Ritmo y Estructura Psicológica...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>DESGLOSAR VIDEO Y ADAPTAR</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* ANALYSIS RESULT */}
      {analysisResult && (
        <div className="space-y-6 animate-fade-in">
          {/* Original Breakdown */}
          <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400">
                  Desglose Anatómico del Video Original
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  Mecánica de Retención y Puntos de Tensión
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/30">
                Formato: {analysisResult.originalAnalysis?.detectedFormat || 'Vertical Dinámico'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-violet-400 block">
                  1. Gancho Inicial (0-3s)
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {analysisResult.originalAnalysis?.hookBreakdown}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-indigo-400 block">
                  2. Ritmo Narrativo y Duración de Fases
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {analysisResult.originalAnalysis?.narrativeRhythm}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-emerald-400 block">
                  3. Introducción del Producto / Oferta
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {analysisResult.originalAnalysis?.productPlacementTactics}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-amber-400 block">
                  4. Efectos Visuales, Textos y CTA
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {analysisResult.originalAnalysis?.visualAudioMechanics} • {analysisResult.originalAnalysis?.ctaAnalysis}
                </p>
              </div>
            </div>
          </div>

          {/* Adapted Original Proposal Card */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-violet-950/60 via-slate-900 to-indigo-950/60 border border-violet-500/40 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400">
                  Propuesta Adaptada 100% Original
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {analysisResult.adaptationStrategy?.adaptedConceptTitle}
                </h3>
              </div>

              <button
                onClick={handleConvertToFicha}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-violet-600/30 flex items-center gap-2 transition-all active:scale-95"
              >
                <FileVideo className="w-4 h-4" />
                <span>Crear Ficha de Producción con este Concepto</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                Opciones de Gancho Nuevo sin Clichés:
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-semibold italic">
                  Opción A: "{analysisResult.adaptationStrategy?.newHookOptionA}"
                </div>
                {analysisResult.adaptationStrategy?.newHookOptionB && (
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-semibold italic">
                    Opción B: "{analysisResult.adaptationStrategy?.newHookOptionB}"
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
                <strong className="text-violet-300 block mb-1">Mecánica Adaptada:</strong>
                {analysisResult.adaptationStrategy?.sceneBreakdownSummary}
              </div>
              <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800">
                <strong className="text-emerald-300 block mb-1">Diferenciación y Originalidad:</strong>
                {analysisResult.adaptationStrategy?.differentiators}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
