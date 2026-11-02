import React, { useState } from 'react';
import { ContentProject } from '../types';
import { ExportService } from '../services/exportService';
import {
  Copy,
  Check,
  Download,
  FileText,
  FileCode,
  FileSpreadsheet,
  Printer,
  Sparkles,
  Camera,
  Video,
  Shirt,
  MessageSquare,
  Tag,
  Share2,
} from 'lucide-react';

interface ExportActionBarProps {
  project: ContentProject;
  variant?: 'compact' | 'full';
  className?: string;
}

export const ExportActionBar: React.FC<ExportActionBarProps> = ({
  project,
  variant = 'full',
  className = '',
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleCopyAction = async (key: string, textGenerator: () => string, label: string) => {
    const text = textGenerator();
    const success = await ExportService.copyToClipboard(text);
    if (success) {
      setCopiedKey(key);
      setFeedbackMessage(`¡${label} copiado al portapapeles!`);
      setTimeout(() => {
        setCopiedKey(null);
        setFeedbackMessage(null);
      }, 2200);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Toast Feedback Confirmation */}
      {feedbackMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-950/95 border border-emerald-500/40 text-emerald-200 text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Main Bar: COPIAR PRODUCCIÓN COMPLETA & Downloads */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-violet-500/30 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Primary Master Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={() =>
              handleCopyAction(
                'full_production',
                () => ExportService.generateFullProductionText(project),
                'Dossier de Producción Completa'
              )
            }
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-xl shadow-violet-600/30 transition-all flex items-center justify-center gap-2.5 active:scale-95 group cursor-pointer"
          >
            {copiedKey === 'full_production' ? (
              <>
                <Check className="w-5 h-5 text-emerald-300" />
                <span className="text-emerald-200">¡PRODUCCIÓN COPIADA!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-violet-200 group-hover:rotate-12 transition-transform" />
                <span>COPIAR PRODUCCIÓN COMPLETA</span>
              </>
            )}
          </button>

          <span className="text-[11px] text-slate-400 hidden sm:inline-block max-w-xs leading-tight">
            Copia todo: ganchos, desglose técnico de escenas, prompts, voz, vestuario y copy.
          </span>
        </div>

        {/* Right: Download Formats */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">
            Descargar:
          </span>

          <button
            onClick={() => ExportService.downloadPdf(project)}
            className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 hover:border-violet-500 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Generar PDF imprimible y guardable"
          >
            <Printer className="w-3.5 h-3.5 text-violet-400" />
            <span>PDF</span>
          </button>

          <button
            onClick={() => ExportService.downloadDocx(project)}
            className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 hover:border-indigo-500 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Descargar documento Word editable (.doc/.docx)"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>DOCX</span>
          </button>

          <button
            onClick={() => ExportService.downloadTxt(project)}
            className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 hover:border-slate-500 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Descargar en texto plano (.txt)"
          >
            <FileCode className="w-3.5 h-3.5 text-slate-400" />
            <span>TXT</span>
          </button>
        </div>
      </div>

      {/* Secondary Bar: Granular Quick Copying */}
      {variant === 'full' && (
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
            <Copy className="w-3 h-3 text-violet-400" />
            <span>Copiar Secciones Específicas:</span>
          </span>

          <button
            onClick={() =>
              handleCopyAction('script_only', () => ExportService.generateScriptText(project), 'Guion')
            }
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              copiedKey === 'script_only'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {copiedKey === 'script_only' ? <Check className="w-3 h-3 text-emerald-400" /> : <FileText className="w-3 h-3 text-violet-400" />}
            <span>Guion Completo</span>
          </button>

          <button
            onClick={() =>
              handleCopyAction('dialogues_only', () => ExportService.generateDialoguesText(project), 'Diálogos y Locución')
            }
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              copiedKey === 'dialogues_only'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {copiedKey === 'dialogues_only' ? <Check className="w-3 h-3 text-emerald-400" /> : <MessageSquare className="w-3 h-3 text-sky-400" />}
            <span>Diálogos y Narración</span>
          </button>

          <button
            onClick={() =>
              handleCopyAction('img_prompts', () => ExportService.generateImagePromptsText(project), 'Prompts de Imágenes')
            }
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              copiedKey === 'img_prompts'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {copiedKey === 'img_prompts' ? <Check className="w-3 h-3 text-emerald-400" /> : <Camera className="w-3 h-3 text-purple-400" />}
            <span>Prompts de Imágenes</span>
          </button>

          <button
            onClick={() =>
              handleCopyAction('vid_prompts', () => ExportService.generateVideoPromptsText(project), 'Prompts de Video')
            }
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              copiedKey === 'vid_prompts'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {copiedKey === 'vid_prompts' ? <Check className="w-3 h-3 text-emerald-400" /> : <Video className="w-3 h-3 text-pink-400" />}
            <span>Prompts de Video</span>
          </button>

          <button
            onClick={() =>
              handleCopyAction('art_direction', () => ExportService.generateArtDirectionText(project), 'Dirección de Arte y Vestuario')
            }
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              copiedKey === 'art_direction'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {copiedKey === 'art_direction' ? <Check className="w-3 h-3 text-emerald-400" /> : <Shirt className="w-3 h-3 text-amber-400" />}
            <span>Vestuario y Locación</span>
          </button>

          <button
            onClick={() =>
              handleCopyAction('publishing_copy', () => ExportService.generatePublishingText(project), 'Copy de Publicación y Hashtags')
            }
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              copiedKey === 'publishing_copy'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {copiedKey === 'publishing_copy' ? <Check className="w-3 h-3 text-emerald-400" /> : <Tag className="w-3 h-3 text-emerald-400" />}
            <span>Copy, CTA y Hashtags</span>
          </button>
        </div>
      )}
    </div>
  );
};
