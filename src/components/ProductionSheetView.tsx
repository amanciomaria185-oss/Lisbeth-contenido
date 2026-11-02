import React, { useState } from 'react';
import { ContentProject, ContentStatus, Scene } from '../types';
import { StorageService } from '../services/storage';
import { SpeechService } from '../services/speech';
import { ExportService } from '../services/exportService';
import { ExportActionBar } from './ExportActionBar';
import {
  FileText,
  Copy,
  Check,
  Share2,
  Download,
  Calendar,
  Volume2,
  VolumeX,
  Sparkles,
  Camera,
  Layers,
  ArrowLeft,
  Star,
  Trash2,
  Save,
  CheckCircle,
  Video,
  Lightbulb,
  Tag,
  ExternalLink,
  Printer,
  FileCode,
  Shirt,
  MessageSquare,
} from 'lucide-react';

interface ProductionSheetViewProps {
  project: ContentProject;
  onBack: () => void;
  onSave: (project: ContentProject) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const ProductionSheetView: React.FC<ProductionSheetViewProps> = ({
  project: initialProject,
  onBack,
  onSave,
  onDuplicate,
  onDelete,
  onToggleFavorite,
}) => {
  const [project, setProject] = useState<ContentProject>(initialProject);
  const [isEditing, setIsEditing] = useState(false);
  const [activeVoiceScene, setActiveVoiceScene] = useState<number | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [saveAlert, setSaveAlert] = useState(false);

  const handleCopy = async (text: string, key: string) => {
    const ok = await ExportService.copyToClipboard(text);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    }
  };

  const handleSpeak = (text: string, sceneNum: number) => {
    if (activeVoiceScene === sceneNum) {
      SpeechService.stop();
      setActiveVoiceScene(null);
    } else {
      SpeechService.speak(text, {
        onEnd: () => setActiveVoiceScene(null),
        onError: () => setActiveVoiceScene(null),
      });
      setActiveVoiceScene(sceneNum);
    }
  };

  const handleSave = () => {
    StorageService.saveProject(project);
    onSave(project);
    setSaveAlert(true);
    setIsEditing(false);
    setTimeout(() => setSaveAlert(false), 2000);
  };

  const handleExportMarkdown = () => {
    const md = StorageService.exportProjectMarkdown(project);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ficha_${project.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(project, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ficha_${project.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getFullScriptText = () => {
    return project.scenes.map((s) => `[Escena ${s.sceneNumber} - ${s.durationSeconds}s]\n${s.spokenText}`).join('\n\n');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-20">
      {/* Top Nav Back Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Panel</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onToggleFavorite(project.id)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              project.isFavorite
                ? 'bg-amber-400/10 border-amber-500/40 text-amber-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Favorito"
          >
            <Star className={`w-4 h-4 ${project.isFavorite ? 'fill-amber-400' : ''}`} />
          </button>

          <button
            onClick={() => ExportService.downloadPdf(project)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-violet-500 text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Descargar o Imprimir en PDF"
          >
            <Printer className="w-3.5 h-3.5 text-violet-400" />
            <span>PDF</span>
          </button>

          <button
            onClick={() => ExportService.downloadDocx(project)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500 text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Descargar en formato Word (.doc/.docx)"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>DOCX</span>
          </button>

          <button
            onClick={() => ExportService.downloadTxt(project)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Descargar en formato TXT"
          >
            <FileCode className="w-3.5 h-3.5 text-slate-400" />
            <span>TXT</span>
          </button>

          <button
            onClick={handleExportMarkdown}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Descargar Markdown para Notion u Obsidian"
          >
            <Download className="w-3.5 h-3.5 text-violet-400" />
            <span>.MD</span>
          </button>

          <button
            onClick={() => onDuplicate(project.id)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Duplicar
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl bg-violet-600/20 text-violet-300 border border-violet-500/30 hover:bg-violet-600 hover:text-white text-xs font-semibold transition-all cursor-pointer"
          >
            {isEditing ? 'Cancelar Edición' : 'Editar Ficha'}
          </button>

          {isEditing && (
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar</span>
            </button>
          )}
        </div>
      </div>

      {/* Prominent Master Export Action Bar */}
      <ExportActionBar project={project} variant="full" />

      {saveAlert && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>Ficha de producción guardada correctamente.</span>
        </div>
      )}

      {/* Main Production Card Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                {project.platform}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
                {project.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300">
                ~{project.totalEstimatedDurationSeconds} segundos
              </span>
            </div>

            {isEditing ? (
              <input
                type="text"
                value={project.title}
                onChange={(e) => setProject({ ...project, title: e.target.value })}
                className="w-full text-xl md:text-2xl font-extrabold bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
              />
            ) : (
              <h1 className="text-xl md:text-2xl font-extrabold text-white">
                {project.title}
              </h1>
            )}

            <p className="text-xs text-slate-400">
              Producto asociado: <strong className="text-slate-200">{project.productName}</strong>
            </p>
          </div>

          {/* Status selector */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shrink-0 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Estado de Producción
            </span>
            <select
              value={project.status}
              onChange={(e) => {
                const updated = { ...project, status: e.target.value as ContentStatus };
                setProject(updated);
                StorageService.saveProject(updated);
                onSave(updated);
              }}
              className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-violet-500"
            >
              <option value="idea">💡 Idea</option>
              <option value="pendiente">⏳ Pendiente</option>
              <option value="en_produccion">🎬 En Producción</option>
              <option value="listo">✅ Listo para Publicar</option>
              <option value="publicado">🚀 Publicado</option>
            </select>
            {project.scheduledDate && (
              <span className="text-[11px] text-slate-500 block pt-1">
                Fecha: {project.scheduledDate}
              </span>
            )}
          </div>
        </div>

        {/* Section 1: Hook and Alternatives */}
        <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Gancho Inicial Magnético (0 a 3 Segundos)</span>
            </span>
            <button
              onClick={() => handleCopy(project.hook, 'hook_main')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              {copiedKey === 'hook_main' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'hook_main' ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>

          {isEditing ? (
            <textarea
              rows={2}
              value={project.hook}
              onChange={(e) => setProject({ ...project, hook: e.target.value })}
              className="w-full text-sm font-semibold bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
            />
          ) : (
            <p className="text-sm font-semibold text-white italic leading-relaxed">
              "{project.hook}"
            </p>
          )}

          {project.hookAlternatives && project.hookAlternatives.length > 0 && (
            <div className="pt-2 border-t border-slate-800/80 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">
                Alternativas A/B para Pruebas:
              </span>
              {project.hookAlternatives.map((alt, i) => (
                <div key={i} className="text-xs text-slate-300 flex items-center justify-between gap-2">
                  <span>• {alt}</span>
                  <button
                    onClick={() => handleCopy(alt, `alt_${i}`)}
                    className="text-[10px] text-slate-500 hover:text-white"
                  >
                    {copiedKey === `alt_${i}` ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Scene Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Video className="w-4 h-4 text-violet-400" />
              <span>Desglose Técnico Escena por Escena ({project.scenes?.length || 0})</span>
            </h3>
            <span className="text-xs text-slate-400">
              Incluye dirección de voz, vestuario, iluminación y prompts de IA
            </span>
          </div>

          <div className="space-y-4">
            {project.scenes?.map((scene) => (
              <div
                key={scene.sceneNumber}
                className="p-5 rounded-3xl bg-slate-950/70 border border-slate-800/90 space-y-4 shadow-md"
              >
                {/* Scene Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-300 font-bold text-xs flex items-center justify-center">
                      {scene.sceneNumber}
                    </span>
                    <span className="text-xs font-bold text-white">
                      Escena {scene.sceneNumber}
                    </span>
                    <span className="text-xs text-slate-400">({scene.durationSeconds}s)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(scene.spokenText, `dlg_${scene.sceneNumber}`)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                      title="Copiar solo el diálogo de esta escena"
                    >
                      {copiedKey === `dlg_${scene.sceneNumber}` ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar Diálogo</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleSpeak(scene.spokenText, scene.sceneNumber)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        activeVoiceScene === scene.sceneNumber
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-slate-900 border border-slate-800 text-violet-300 hover:bg-slate-800'
                      }`}
                      title="Escuchar locución generada con Web Speech API"
                    >
                      {activeVoiceScene === scene.sceneNumber ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>Pausar Voz</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Escuchar Narración</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Spoken Text Box */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span>Texto exacto que dice la persona (o voz en off):</span>
                    <button
                      onClick={() => handleCopy(scene.spokenText, `spoken_${scene.sceneNumber}`)}
                      className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer lowercase font-normal"
                    >
                      {copiedKey === `spoken_${scene.sceneNumber}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === `spoken_${scene.sceneNumber}` ? 'copiado' : 'copiar'}</span>
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-white leading-relaxed">
                    "{scene.spokenText}"
                  </p>
                </div>

                {/* Physical & Technical Specs */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400">
                    <span>Dirección de Arte y Locación</span>
                    <button
                      onClick={() =>
                        handleCopy(
                          `Escena ${scene.sceneNumber}:\nVestuario: ${scene.wardrobe}\nLocación: ${scene.location}\nIluminación: ${scene.lighting}\nCámara: ${scene.cameraFraming}\nMúsica/SFX: ${scene.musicAndAudio}`,
                          `art_scene_${scene.sceneNumber}`
                        )
                      }
                      className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer lowercase font-normal"
                    >
                      {copiedKey === `art_scene_${scene.sceneNumber}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === `art_scene_${scene.sceneNumber}` ? 'copiado' : 'copiar arte y vestuario'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                      <strong className="text-violet-300 block mb-1">Acción y Movimiento:</strong>
                      <p className="text-slate-300">{scene.physicalActions}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                      <strong className="text-indigo-300 block mb-1">Cámara y Encuadre:</strong>
                      <p className="text-slate-300">{scene.cameraFraming}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                      <strong className="text-amber-300 block mb-1">Iluminación y Locación:</strong>
                      <p className="text-slate-300">
                        {scene.lighting} • {scene.location}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                      <strong className="text-pink-300 block mb-1">Música y SFX:</strong>
                      <p className="text-slate-300">{scene.musicAndAudio}</p>
                    </div>
                  </div>
                </div>

                {/* On screen text & Transitions */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                  <div>
                    <strong className="text-slate-300">Texto en pantalla:</strong>{' '}
                    <span className="text-white font-medium">{scene.onScreenText || 'Ninguno'}</span>
                  </div>
                  <div>
                    <strong className="text-slate-300">Transición:</strong>{' '}
                    <span className="text-slate-300">{scene.transitions}</span>
                  </div>
                  <div>
                    <strong className="text-slate-300">Vestuario:</strong>{' '}
                    <span className="text-slate-300">{scene.wardrobe}</span>
                  </div>
                </div>

                {/* AI PROMPTS: Image & Video */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {/* Image Prompt */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-violet-400">
                      <span>PROMPT DE IMAGEN (Midjourney / FLUX)</span>
                      <button
                        onClick={() => handleCopy(scene.imagePrompt, `img_${scene.sceneNumber}`)}
                        className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
                      >
                        {copiedKey === `img_${scene.sceneNumber}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar Prompt Imagen</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-300 font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 line-clamp-4">
                      {scene.imagePrompt}
                    </p>
                  </div>

                  {/* Video Prompt */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-indigo-400">
                      <span>PROMPT DE VIDEO (Sora / Runway Gen-3 / Kling)</span>
                      <button
                        onClick={() => handleCopy(scene.videoPrompt, `vid_${scene.sceneNumber}`)}
                        className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
                      >
                        {copiedKey === `vid_${scene.sceneNumber}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar Prompt Video</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-300 font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 line-clamp-4">
                      {scene.videoPrompt}
                    </p>
                  </div>
                </div>

                {/* Voice Direction */}
                {scene.narration && (
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-4">
                      <span>
                        <strong className="text-slate-300">Voz:</strong> {scene.narration.voiceType}
                      </span>
                      <span>
                        <strong className="text-slate-300">Emoción:</strong> {scene.narration.emotion}
                      </span>
                      <span>
                        <strong className="text-slate-300">Pausas:</strong> {scene.narration.pauses}
                      </span>
                      {scene.narration.emphasis && (
                        <span>
                          <strong className="text-slate-300">Énfasis:</strong> {scene.narration.emphasis.join(', ')}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        handleCopy(
                          `Voz: ${scene.narration.voiceType}\nEmoción: ${scene.narration.emotion}\nPausas: ${scene.narration.pauses}\nÉnfasis: ${scene.narration.emphasis?.join(', ')}`,
                          `voice_dir_${scene.sceneNumber}`
                        )
                      }
                      className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      {copiedKey === `voice_dir_${scene.sceneNumber}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === `voice_dir_${scene.sceneNumber}` ? 'Copiado' : 'Copiar Dirección Voz'}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Publishing details */}
        <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
              Datos de Publicación y Copywriting
            </span>
            <button
              onClick={() =>
                handleCopy(
                  `${project.publishingCopy}\n\nCTA: ${project.callToAction}\n\n${project.hashtags?.join(' ')}`,
                  'copy_all_pub'
                )
              }
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 cursor-pointer bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20"
            >
              {copiedKey === 'copy_all_pub' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'copy_all_pub' ? '¡Todo Copiado!' : 'Copiar Todo el Bloque de Publicación'}</span>
            </button>
          </div>

          {/* CTA Box */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
              <span>Llamado a la Acción (CTA):</span>
              <button
                onClick={() => handleCopy(project.callToAction, 'cta_btn')}
                className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'cta_btn' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'cta_btn' ? 'Copiado' : 'Copiar CTA'}</span>
              </button>
            </div>
            <p className="text-xs font-bold text-white">{project.callToAction}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>Descripción Lista para Publicar (Caption):</span>
              <button
                onClick={() => handleCopy(project.publishingCopy, 'copy_pub')}
                className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'copy_pub' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'copy_pub' ? 'Copiado' : 'Copiar Copy'}</span>
              </button>
            </div>
            {isEditing ? (
              <textarea
                rows={4}
                value={project.publishingCopy}
                onChange={(e) => setProject({ ...project, publishingCopy: e.target.value })}
                className="w-full text-xs bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
              />
            ) : (
              <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                {project.publishingCopy}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 font-semibold mr-1">Hashtags:</span>
              {project.hashtags?.map((tag, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-300 font-mono text-[11px]">
                  {tag}
                </span>
              ))}
              <button
                onClick={() => handleCopy(project.hashtags?.join(' ') || '', 'hashtags_btn')}
                className="ml-2 px-2 py-0.5 rounded bg-slate-900 text-[10px] text-slate-400 hover:text-white border border-slate-800 cursor-pointer flex items-center gap-1"
              >
                {copiedKey === 'hashtags_btn' ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                <span>{copiedKey === 'hashtags_btn' ? 'Copiados' : 'Copiar Hashtags'}</span>
              </button>
            </div>

            {project.productLink && (
              <a
                href={project.productLink}
                target="_blank"
                rel="noreferrer"
                className="text-violet-400 hover:underline flex items-center gap-1"
              >
                <span>Enlace de Venta</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Sticky-friendly Master Action Bar */}
      <ExportActionBar project={project} variant="compact" />
    </div>
  );
};
