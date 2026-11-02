import React, { useState } from 'react';
import { UserProfile, ContentProject, Platform } from '../types';
import { ApiService, StrategyResponse } from '../services/api';
import { StorageService } from '../services/storage';
import { ExportService } from '../services/exportService';
import { ExportActionBar } from './ExportActionBar';
import {
  Sparkles,
  Layers,
  Target,
  Send,
  Loader2,
  CheckCircle,
  FileText,
  ShieldCheck,
  AlertCircle,
  Upload,
  Link as LinkIcon,
  BookOpen,
  ShoppingBag,
  ArrowRight,
  Flame,
  Volume2,
  Copy,
  ChevronRight,
  RefreshCw,
  Check,
} from 'lucide-react';

interface ContentGeneratorViewProps {
  currentUser: UserProfile;
  pastContents: ContentProject[];
  onSaveAsProject: (project: ContentProject) => void;
  onOpenProject: (project: ContentProject) => void;
}

export const ContentGeneratorView: React.FC<ContentGeneratorViewProps> = ({
  currentUser,
  pastContents,
  onSaveAsProject,
  onOpenProject,
}) => {
  // Input fields
  const [idea, setIdea] = useState('');
  const [productName, setProductName] = useState(
    currentUser.niche ? `Ebook / Solución de ${currentUser.niche}` : 'Ebook de Recetas Saludables'
  );
  const [productType, setProductType] = useState('Ebook / Infoproducto');
  const [productDescription, setProductDescription] = useState(
    'Guía digital paso a paso con recetas fáciles y antiinflamatorias que reducen la hinchazón abdominal en 7 días sin pasar hambre.'
  );
  const [salesUrl, setSalesUrl] = useState('');
  const [targetAudience, setTargetAudience] = useState(currentUser.targetAudience || '');
  const [objective, setObjective] = useState('Ventas y Conversión');
  const [platform, setPlatform] = useState<Platform>('TikTok');
  const [tone, setTone] = useState(currentUser.defaultTone || 'Persuasivo y Dinámico');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);

  // Loading & Result States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [strategyResult, setStrategyResult] = useState<StrategyResponse | null>(null);
  const [selectedAngleId, setSelectedAngleId] = useState<string>('angle-1');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Past hooks for anti-repetition summary
  const pastHooksSummary = pastContents.map((p) => ({
    title: p.title,
    hook: p.hook,
    format: p.format,
  }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName && !idea) {
      setError('Por favor indica al menos una idea o el nombre del producto.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setStrategyResult(null);
    setSavedSuccess(false);

    try {
      const result = await ApiService.generateStrategy({
        idea: idea || `Estrategia viral completa para ${productName}`,
        productName,
        productType,
        productDescription,
        salesUrl,
        targetAudience: targetAudience || currentUser.targetAudience,
        objective,
        platform,
        tone,
        pastContentsSummary: pastHooksSummary,
        characterReference: currentUser.characterVisualPrompt,
      });

      setStrategyResult(result);
      if (result.angles && result.angles.length > 0) {
        setSelectedAngleId(result.recommendedAngleId || result.angles[0].id);
      }

      // Record in history
      StorageService.addHistory({
        userId: currentUser.id,
        type: 'strategy',
        title: `Estrategia: ${productName}`,
        promptOrInput: idea || productName,
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocurrió un error al generar la estrategia con IA.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFicha = () => {
    if (!strategyResult || !strategyResult.masterScript) return;

    const ms = strategyResult.masterScript;
    const selectedAngle = strategyResult.angles.find((a) => a.id === selectedAngleId);

    const newProject: ContentProject = {
      id: 'proj_' + Math.random().toString(36).substring(2, 9),
      userId: currentUser.id,
      title: ms.title || `${productName} — ${selectedAngle?.name || 'Estrategia Viral'}`,
      productName,
      productDescription,
      platform,
      objective,
      status: 'en_produccion',
      category: 'Marketing',
      format: ms.format || 'Video 9:16 Dinámico con Texto Cinematográfico',
      hook: selectedAngle?.hookPrimary || ms.hook,
      hookAlternatives: ms.hookAlternatives || [selectedAngle?.hookAlternative || ''],
      totalEstimatedDurationSeconds: ms.totalEstimatedDurationSeconds || 45,
      scenes: ms.scenes || [],
      callToAction: ms.callToAction || currentUser.defaultCta,
      publishingCopy: ms.publishingCopy || '',
      hashtags: ms.hashtags || ['#viral', '#marketing', '#creadores'],
      productLink: salesUrl,
      scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      characterReference: currentUser.characterVisualPrompt,
    };

    StorageService.saveProject(newProject);
    onSaveAsProject(newProject);
    setSavedSuccess(true);
    setTimeout(() => {
      onOpenProject(newProject);
    }, 800);
  };

  const selectedAngle = strategyResult?.angles?.find((a) => a.id === selectedAngleId);
  const activePreviewProject: ContentProject | null = strategyResult?.masterScript
    ? {
        id: 'preview_' + selectedAngleId,
        userId: currentUser.id,
        title: strategyResult.masterScript.title || `${productName} — ${selectedAngle?.name || 'Estrategia Viral'}`,
        productName,
        productDescription,
        platform,
        objective,
        status: 'idea',
        category: 'Marketing',
        format: strategyResult.masterScript.format || 'Video 9:16 Dinámico con Texto Cinematográfico',
        hook: selectedAngle?.hookPrimary || strategyResult.masterScript.hook,
        hookAlternatives: strategyResult.masterScript.hookAlternatives || [selectedAngle?.hookAlternative || ''],
        totalEstimatedDurationSeconds: strategyResult.masterScript.totalEstimatedDurationSeconds || 45,
        scenes: strategyResult.masterScript.scenes || [],
        callToAction: strategyResult.masterScript.callToAction || currentUser.defaultCta,
        publishingCopy: strategyResult.masterScript.publishingCopy || '',
        hashtags: strategyResult.masterScript.hashtags || ['#viral', '#marketing', '#creadores'],
        productLink: salesUrl,
        scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        isFavorite: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        characterReference: currentUser.characterVisualPrompt,
      }
    : null;

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generador Estratégico Inteligente</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Crea Contenido Estratégico Multi-Ángulo
        </h1>
        <p className="text-slate-400 text-xs md:text-sm max-w-3xl leading-relaxed">
          No generamos cinco frases genéricas. VIRAL CONTENT AI analiza la psicología de tu cliente, desmantela sus objeciones principales, aplica el sistema antirrepetición y produce 4 ángulos diferenciados con guiones cinematográficos completos.
        </p>
      </div>

      {/* Input Form Card */}
      <form onSubmit={handleGenerate} className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-6">
        {/* Row 1: Idea Libre */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
            <span>1. Explica tu idea o prompt libre</span>
            <span className="text-slate-500 font-normal lowercase">¿Qué quieres lograr con este video?</span>
          </label>
          <textarea
            rows={3}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Ejemplo: Quiero promocionar mi ebook de recetas saludables. Quiero contenido para TikTok que enseñe recetas fáciles, dé consejos de alimentación, genere confianza y consiga ventas sin sonar desesperado por vender..."
            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        {/* Row 2: Product Name & Type & Sales URL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-violet-400" />
              <span>Nombre del Producto / Ebook</span>
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Ej: Ebook Recetas Antiinflamatorias"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Tipo de Oferta</span>
            </label>
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
            >
              <option>Ebook / Infoproducto Digital</option>
              <option>Curso Online / Membresía</option>
              <option>Servicio / Consultoría 1 a 1</option>
              <option>Producto de Afiliados (Hotmart / Clickbank)</option>
              <option>SaaS / Herramienta de Software</option>
              <option>Marca Personal / Construcción de Audiencia</option>
              <option>Producto Físico / E-commerce</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-sky-400" />
              <span>Enlace de Venta o Página</span>
            </label>
            <input
              type="url"
              value={salesUrl}
              onChange={(e) => setSalesUrl(e.target.value)}
              placeholder="https://tupagina.com/oferta"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        {/* Row 3: Product Description / Benefit */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            2. Descripción y Beneficio Principal (¿Qué problema resuelve?)
          </label>
          <input
            type="text"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            placeholder="Ej: Enseña a personas con hinchazón constante a preparar cenas en 10 minutos con ingredientes accesibles..."
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
          />
        </div>

        {/* Row 4: Audience & Objectives */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Público Objetivo (Avatar)</span>
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Ej: Mujeres de 28-45 años sin tiempo"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Objetivo Principal
            </label>
            <select
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
            >
              <option>Ventas y Conversión Directa</option>
              <option>Confianza, Autoridad y Credibilidad</option>
              <option>Viralidad, Alcance y Seguidores</option>
              <option>Educación y Derribo de Mitos</option>
              <option>Storytelling y Conexión Emocional</option>
              <option>Lanzamiento Especial / Oferta Flash</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Plataforma y Formato
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
            >
              <option value="TikTok">TikTok (9:16 Dinámico)</option>
              <option value="Instagram Reels">Instagram Reels (9:16 Estético)</option>
              <option value="YouTube Shorts">YouTube Shorts (9:16 Pedagógico)</option>
              <option value="Facebook Reels">Facebook Reels (9:16 Amplio)</option>
              <option value="Multiplataforma">Multiplataforma Omnicanal</option>
            </select>
          </div>
        </div>

        {/* Row 5: Reference Image / Avatar consistency */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Upload className="w-4 h-4 text-violet-400" />
              <span>Imagen de Referencia de Personaje / Producto (Opcional)</span>
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Sube una foto de tu personaje o producto para asegurar la identidad visual y rasgos faciales en los prompts de Midjourney y Sora.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {referenceImage && (
              <img
                src={referenceImage}
                alt="Referencia"
                className="w-12 h-12 rounded-xl object-cover border border-violet-500"
              />
            )}
            <label className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs font-medium text-slate-200 hover:text-white cursor-pointer transition-colors">
              <span>{referenceImage ? 'Cambiar Imagen' : 'Subir Imagen'}</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Anti-Repetition Shield Note */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              <strong>Sistema Antirrepetición Activado:</strong> Consultará tus {pastContents.length} contenidos previos para prohibir ganchos repetidos y los clichés prohibidos como "¿Sabías que...?".
            </span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0">
            Escudo OK
          </span>
        </div>

        {/* Submit Button */}
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
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold text-sm shadow-xl shadow-violet-600/30 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generando Estrategia Multi-Ángulo con IA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>GENERAR ESTRATEGIA Y GUION COMPLETO</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* RESULT SECTION */}
      {strategyResult && (
        <div className="space-y-8 animate-fade-in pt-4">
          {/* Diagnostic Card */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                  Diagnóstico Estratégico de Producto
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">
                  Análisis de Tracción y Gatillos Psicológicos
                </h2>
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-4 h-4" />
                <span>Antirrepetición Garantizada</span>
              </div>
            </div>

            {strategyResult.apiKeyNotice && (
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-300 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{strategyResult.apiKeyNotice}</span>
              </div>
            )}

            <p className="text-xs text-slate-300 italic bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              🛡️ {strategyResult.antiRepetitionNotice}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider block mb-1">
                  Propuesta Única de Valor
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {strategyResult.productDiagnostic?.coreValueProposition}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-1">
                  Dolor Profundo del Cliente
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {strategyResult.productDiagnostic?.primaryPainPoint}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  Objeción Nº 1 a Desmantelar
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {strategyResult.productDiagnostic?.mainObjectionToCrush}
                </p>
              </div>
            </div>
          </div>

          {/* 4 Multi-Angles Selector */}
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400">
                Diversificación de Enfoques
              </span>
              <h2 className="text-xl font-bold text-white">
                4 Ángulos Creativos Independientes
              </h2>
              <p className="text-xs text-slate-400">
                Selecciona el ángulo que prefieras para desplegar su guion de producción o convertirlo en ficha individual:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {strategyResult.angles?.map((angle) => {
                const isSelected = angle.id === selectedAngleId;
                const isRecommended = angle.id === strategyResult.recommendedAngleId;

                return (
                  <div
                    key={angle.id}
                    onClick={() => setSelectedAngleId(angle.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-violet-950/40 border-violet-500 shadow-xl shadow-violet-950/50 ring-1 ring-violet-500'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                          {angle.type}
                        </span>
                        {isRecommended && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            ★ Recomendado
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-white line-clamp-2">
                        {angle.name}
                      </h3>

                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs italic text-violet-200 line-clamp-3">
                        "{angle.hookPrimary}"
                      </div>

                      <p className="text-[11px] text-slate-400 leading-snug line-clamp-3">
                        {angle.brief}
                      </p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold">
                      <span className="text-[10px] text-slate-500">¿Por qué funciona?</span>
                      <span className={`text-[11px] ${isSelected ? 'text-violet-400' : 'text-slate-400'}`}>
                        {isSelected ? '✓ Seleccionado' : 'Seleccionar'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Master Script & Production Sheet Preview */}
          {strategyResult.masterScript && (
            <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-violet-500/40 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      Guion de Producción Completo
                    </span>
                    <span className="text-xs text-slate-400">
                      {strategyResult.masterScript.scenes?.length || 0} escenas • ~{strategyResult.masterScript.totalEstimatedDurationSeconds}s
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {strategyResult.masterScript.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCreateFicha}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-violet-600/30 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Guardar como Ficha de Producción</span>
                  </button>
                </div>
              </div>

              {savedSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>¡Ficha guardada exitosamente en tus Proyectos! Abriendo...</span>
                </div>
              )}

              {/* Master Export and Download Action Bar (PDF, DOCX, TXT, Copiar Producción Completa) */}
              {activePreviewProject && (
                <ExportActionBar project={activePreviewProject} variant="full" />
              )}

              {/* Hook Box */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-violet-400">
                  <span>Gancho Inicial Seleccionado (0-3s)</span>
                  <button
                    onClick={() => ExportService.copyToClipboard(strategyResult.masterScript.hook)}
                    className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer font-normal lowercase"
                  >
                    <Copy className="w-3 h-3" />
                    <span>copiar gancho</span>
                  </button>
                </div>
                <p className="text-sm font-semibold text-white italic">
                  "{strategyResult.masterScript.hook}"
                </p>
                {strategyResult.masterScript.hookAlternatives && (
                  <div className="pt-2 text-xs text-slate-400 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Alternativas A/B:</span>
                    {strategyResult.masterScript.hookAlternatives.map((h: string, idx: number) => (
                      <div key={idx} className="text-slate-300 flex items-center justify-between">
                        <span>• {h}</span>
                        <button
                          onClick={() => ExportService.copyToClipboard(h)}
                          className="text-[10px] text-slate-500 hover:text-slate-300 cursor-pointer"
                        >
                          copiar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Scenes Breakdown Preview */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Estructura Escénica y Guion
                </h4>
                <div className="space-y-3">
                  {strategyResult.masterScript.scenes?.map((scene: any) => (
                    <div
                      key={scene.sceneNumber}
                      className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">
                          Escena {scene.sceneNumber} ({scene.durationSeconds}s)
                        </span>
                        <span className="text-[11px] text-violet-400 font-medium">
                          {scene.cameraFraming} • {scene.lighting}
                        </span>
                      </div>

                      {/* Dialogue */}
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/60">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                          Texto que dice (o voz en off):
                        </span>
                        <p className="text-xs text-slate-100 font-medium leading-relaxed">
                          "{scene.spokenText}"
                        </p>
                      </div>

                      {/* Physical & Visual */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-400">
                        <div>
                          <strong className="text-slate-300">Acción y gesto:</strong> {scene.physicalActions} ({scene.expressions})
                        </div>
                        <div>
                          <strong className="text-slate-300">Texto en pantalla:</strong> {scene.onScreenText || 'Sin texto'}
                        </div>
                      </div>

                      {/* Prompts preview */}
                      <div className="pt-2 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                          <span className="font-bold text-violet-400 block mb-0.5">Prompt Imagen IA:</span>
                          <p className="text-slate-400 line-clamp-2">{scene.imagePrompt}</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                          <span className="font-bold text-indigo-400 block mb-0.5">Prompt Video IA:</span>
                          <p className="text-slate-400 line-clamp-2">{scene.videoPrompt}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to action & publishing */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                  Llamado a la Acción (CTA) y Copy de Publicación
                </span>
                <p className="text-xs font-semibold text-white">
                  CTA: {strategyResult.masterScript.callToAction}
                </p>
                <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
                  {strategyResult.masterScript.publishingCopy}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {strategyResult.masterScript.hashtags?.map((tag: string, i: number) => (
                    <span key={i} className="text-[11px] text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
