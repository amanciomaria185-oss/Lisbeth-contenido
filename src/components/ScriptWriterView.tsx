import React, { useState } from 'react';
import { UserProfile, ContentProject, Platform } from '../types';
import { ApiService } from '../services/api';
import { StorageService } from '../services/storage';
import { ExportService } from '../services/exportService';
import { ExportActionBar } from './ExportActionBar';
import {
  FileVideo,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
  Video,
  Camera,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface ScriptWriterViewProps {
  currentUser: UserProfile;
  pastContents: ContentProject[];
  onOpenProject: (project: ContentProject) => void;
  onSaveProject: (project: ContentProject) => void;
}

export const ScriptWriterView: React.FC<ScriptWriterViewProps> = ({
  currentUser,
  pastContents,
  onOpenProject,
  onSaveProject,
}) => {
  const [title, setTitle] = useState('');
  const [productName, setProductName] = useState(currentUser.brandName || 'Ebook Digital');
  const [productDescription, setProductDescription] = useState(currentUser.niche || '');
  const [targetAudience, setTargetAudience] = useState(currentUser.targetAudience || '');
  const [objective, setObjective] = useState('Conversión y Confianza');
  const [platform, setPlatform] = useState<Platform>('TikTok');
  const [tone, setTone] = useState(currentUser.defaultTone || 'Persuasivo y Dinámico');
  const [format, setFormat] = useState('Talking Head Dinámico + B-Roll y Subtítulos Cinematográficos');
  const [customAngle, setCustomAngle] = useState('');
  const [scenesCount, setScenesCount] = useState(4);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedScript, setGeneratedScript] = useState<any>(null);

  const pastHooks = pastContents.map((p) => p.hook);

  const handleGenerateScript = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title && !customAngle) {
      setError('Por favor indica un título o el ángulo específico para el guion.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedScript(null);

    try {
      const data = await ApiService.generateScript({
        title: title || `Guion Cinematográfico para ${productName}`,
        productName,
        productDescription,
        targetAudience,
        objective,
        platform,
        tone,
        format,
        customAngle,
        characterReference: currentUser.characterVisualPrompt,
        scenesCount,
        pastContentsSummary: pastHooks,
      });

      setGeneratedScript(data);

      StorageService.addHistory({
        userId: currentUser.id,
        type: 'script',
        title: `Guion: ${data.title || title}`,
        promptOrInput: `${title} (${platform})`,
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al generar el guion cinematográfico.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToFicha = () => {
    if (!generatedScript) return;

    const newProject: ContentProject = {
      id: 'proj_' + Math.random().toString(36).substring(2, 9),
      userId: currentUser.id,
      title: generatedScript.title || title || 'Guion Escénico',
      productName,
      productDescription,
      platform,
      objective,
      status: 'en_produccion',
      category: 'Tutoriales',
      format: generatedScript.format || format,
      hook: generatedScript.hook || 'Gancho de impacto',
      hookAlternatives: generatedScript.hookAlternatives || [],
      totalEstimatedDurationSeconds: generatedScript.totalEstimatedDurationSeconds || 45,
      scenes: generatedScript.scenes || [],
      callToAction: generatedScript.callToAction || currentUser.defaultCta,
      publishingCopy: generatedScript.publishingCopy || '',
      hashtags: generatedScript.hashtags || ['#viral', '#contenido'],
      scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      characterReference: currentUser.characterVisualPrompt,
    };

    StorageService.saveProject(newProject);
    onSaveProject(newProject);
    onOpenProject(newProject);
  };

  const scriptPreviewProject: ContentProject | null = generatedScript
    ? {
        id: 'script_preview_' + Date.now(),
        userId: currentUser.id,
        title: generatedScript.title || title || 'Guion Escénico',
        productName,
        productDescription,
        platform,
        objective,
        status: 'en_produccion',
        category: 'Tutoriales',
        format: generatedScript.format || format,
        hook: generatedScript.hook || 'Gancho de impacto',
        hookAlternatives: generatedScript.hookAlternatives || [],
        totalEstimatedDurationSeconds: generatedScript.totalEstimatedDurationSeconds || 45,
        scenes: generatedScript.scenes || [],
        callToAction: generatedScript.callToAction || currentUser.defaultCta,
        publishingCopy: generatedScript.publishingCopy || '',
        hashtags: generatedScript.hashtags || ['#viral', '#contenido'],
        scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        characterReference: currentUser.characterVisualPrompt,
      }
    : null;

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-16">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold">
          <FileVideo className="w-3.5 h-3.5" />
          <span>Generador Completo de Guiones Cinematográficos</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Crea Guiones Escena por Escena Listos para Grabación
        </h1>
        <p className="text-slate-400 text-xs md:text-sm max-w-2xl leading-relaxed">
          Diseñado para que cualquier creador, actor o voz en off sepa exactamente qué decir, cómo moverse, qué iluminación colocar y qué prompt copiar en Midjourney y Sora por cada segundo del video.
        </p>
      </div>

      <form onSubmit={handleGenerateScript} className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Título o Tema Central del Video
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Por qué la avena del supermercado no es tan saludable como crees"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Producto o Ebook que Promociona
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Ej: Ebook Recetas Antiinflamatorias"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Ángulo o Situación Dramática Específica
          </label>
          <input
            type="text"
            value={customAngle}
            onChange={(e) => setCustomAngle(e.target.value)}
            placeholder="Ej: Desmitificación de un error cotidiano comparando dos desayunos frente a frente..."
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Plataforma
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
            >
              <option value="TikTok">TikTok (9:16)</option>
              <option value="Instagram Reels">Instagram Reels (9:16)</option>
              <option value="YouTube Shorts">YouTube Shorts (9:16)</option>
              <option value="Facebook Reels">Facebook Reels (9:16)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Cantidad de Escenas
            </label>
            <select
              value={scenesCount}
              onChange={(e) => setScenesCount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
            >
              <option value={3}>3 Escenas (Video Corto ~25s)</option>
              <option value={4}>4 Escenas (Estándar ~40s)</option>
              <option value={5}>5 Escenas (Narrativo ~60s)</option>
              <option value={6}>6 Escenas (Profundo ~75s)</option>
              <option value={8}>8 Escenas (Masterclass ~90s)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Tono de Interpretación
            </label>
            <input
              type="text"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
            />
          </div>
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
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs shadow-xl shadow-pink-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Escribiendo Guion Escénico con Dirección Técnica...</span>
              </>
            ) : (
              <>
                <FileVideo className="w-4 h-4" />
                <span>GENERAR GUION ESCÉNICO COMPLETO</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* RESULT */}
      {generatedScript && (
        <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-pink-500/30 shadow-2xl space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-pink-400">
                Guion Cinematográfico Listo
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                {generatedScript.title}
              </h2>
            </div>
            <button
              onClick={handleSaveToFicha}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 text-white font-bold text-xs shadow-xl shadow-pink-600/30 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Guardar en Fichas de Producción</span>
            </button>
          </div>

          {/* Master Export and Download Action Bar */}
          {scriptPreviewProject && (
            <ExportActionBar project={scriptPreviewProject} variant="full" />
          )}

          {/* Hook box */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase text-pink-400">
              <span>Gancho Inicial (0-3s):</span>
              <button
                onClick={() => ExportService.copyToClipboard(generatedScript.hook)}
                className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer font-normal lowercase"
              >
                <Copy className="w-3 h-3" />
                <span>copiar gancho</span>
              </button>
            </div>
            <p className="text-sm font-semibold text-white italic">
              "{generatedScript.hook}"
            </p>
          </div>

          {/* Scenes */}
          <div className="space-y-4">
            {generatedScript.scenes?.map((scene: any) => (
              <div
                key={scene.sceneNumber}
                className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">
                    Escena {scene.sceneNumber} ({scene.durationSeconds}s)
                  </span>
                  <span className="text-pink-400 font-medium">
                    {scene.cameraFraming} • {scene.lighting}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 font-medium leading-relaxed space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold uppercase">
                    <span>Diálogo:</span>
                    <button
                      onClick={() => ExportService.copyToClipboard(scene.spokenText)}
                      className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer font-normal lowercase"
                    >
                      <Copy className="w-3 h-3" />
                      <span>copiar diálogo</span>
                    </button>
                  </div>
                  <p>"{scene.spokenText}"</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-400">
                  <div>
                    <strong className="text-slate-300">Acción:</strong> {scene.physicalActions}
                  </div>
                  <div>
                    <strong className="text-slate-300">Música / SFX:</strong> {scene.musicAndAudio}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-violet-400">Prompt Imagen IA:</span>
                      <button
                        onClick={() => ExportService.copyToClipboard(scene.imagePrompt)}
                        className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copiar</span>
                      </button>
                    </div>
                    <p className="text-slate-400 font-mono text-[10px] line-clamp-3">{scene.imagePrompt}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-pink-400">Prompt Video IA:</span>
                      <button
                        onClick={() => ExportService.copyToClipboard(scene.videoPrompt)}
                        className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copiar</span>
                      </button>
                    </div>
                    <p className="text-slate-400 font-mono text-[10px] line-clamp-3">{scene.videoPrompt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
