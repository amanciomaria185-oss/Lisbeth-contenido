import React, { useState } from 'react';
import { ContentProject, UserProfile } from '../types';
import {
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Copy,
  Check,
  Search,
  Layers,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface AntiRepetitionViewProps {
  currentUser: UserProfile;
  projects: ContentProject[];
  onOpenProject: (project: ContentProject) => void;
  onNewContent: () => void;
}

export const AntiRepetitionView: React.FC<AntiRepetitionViewProps> = ({
  currentUser,
  projects,
  onOpenProject,
  onNewContent,
}) => {
  const [testInput, setTestInput] = useState('');
  const [simResult, setSimResult] = useState<{ isSafe: boolean; feedback: string } | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const bannedClichés = [
    '¿Sabías que...?',
    'Te apuesto a que no sabías esto',
    'Quédate hasta el final del video',
    'El último secreto te volará la cabeza',
    'Hoy te voy a enseñar 3 trucos...',
    'Nadie te está contando esto...',
    'Si quieres ganar dinero rápido...',
  ];

  const handleTestHook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim()) return;

    const lower = testInput.toLowerCase();

    // Check clichés
    const hasCliché = bannedClichés.some((b) =>
      lower.includes(b.toLowerCase().replace('...', '').trim())
    );

    // Check similarity with past hooks
    const similarProject = projects.find((p) => {
      const pastHook = p.hook.toLowerCase();
      // Simple word overlap check
      const testWords = lower.split(/\s+/).filter((w) => w.length > 3);
      const matchCount = testWords.filter((w) => pastHook.includes(w)).length;
      return matchCount >= 3;
    });

    if (hasCliché) {
      setSimResult({
        isSafe: false,
        feedback:
          '⚠️ Detectado un cliché genérico penalizado por el algoritmo ("¿Sabías que..." o similar). Los ganchos modernos deben iniciar directamente con polarización o revelación específica.',
      });
    } else if (similarProject) {
      setSimResult({
        isSafe: false,
        feedback: `⚠️ Posible repetición detectada con tu contenido previo: "${similarProject.title}". Se recomienda cambiar el ángulo hacia un caso de estudio o desmitificación.`,
      });
    } else {
      setSimResult({
        isSafe: true,
        feedback:
          '✅ Gancho fresco y aprobado por el motor antirrepetición. No compite con contenidos previos ni utiliza fórmulas gastadas.',
      });
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  // Calculate diversity score
  const uniqueCategories = new Set(projects.map((p) => p.category)).size;
  const diversityPercent = Math.min(Math.round((uniqueCategories / 7) * 100), 100) || 85;

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-16">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Sistema Inteligente Antirrepetición y Variedad Real</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Protección Contra la Fatiga de Audiencia
        </h1>
        <p className="text-slate-400 text-xs md:text-sm max-w-2xl leading-relaxed">
          Los algoritmos y los espectadores se cansan de ver al mismo creador repitiendo la misma estructura o ganchos idénticos. VIRAL CONTENT AI audita cada generación contra tu historial para forzar variedad de ángulos, formatos y emociones.
        </p>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Ganchos Previos Indexados</span>
          <div className="text-3xl font-extrabold text-white">{projects.length}</div>
          <span className="text-[11px] text-emerald-400 font-semibold">
            ✓ Guardados en memoria activa
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Índice de Diversidad</span>
          <div className="text-3xl font-extrabold text-emerald-300">{diversityPercent}%</div>
          <span className="text-[11px] text-slate-400">
            {uniqueCategories} categorías distintas utilizadas
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Clichés Prohibidos</span>
          <div className="text-3xl font-extrabold text-rose-400">{bannedClichés.length}</div>
          <span className="text-[11px] text-rose-300">
            Bloqueados en todas las solicitudes
          </span>
        </div>
      </div>

      {/* Hook Auditor Simulator */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
          <Search className="w-4 h-4 text-emerald-400" />
          <span>Simulador de Detección de Repetición y Clichés</span>
        </h2>
        <p className="text-xs text-slate-400">
          Escribe cualquier gancho o frase inicial que tengas en mente para comprobar si el motor lo aprueba o detecta similitud con tus videos anteriores:
        </p>

        <form onSubmit={handleTestHook} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="Ej: ¿Sabías que el 80% de las dietas fracasan antes del día 15?..."
              className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all shrink-0"
            >
              Auditar Gancho
            </button>
          </div>
        </form>

        {simResult && (
          <div
            className={`p-4 rounded-2xl border text-xs leading-relaxed ${
              simResult.isSafe
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
            }`}
          >
            {simResult.feedback}
          </div>
        )}
      </div>

      {/* List of Banned Clichés */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4" />
          <span>Lista Negra de Frases Banneadas Automáticamente</span>
        </h3>
        <p className="text-xs text-slate-400">
          La inteligencia artificial tiene instrucción explícita de NO usar ninguna de estas fórmulas gastadas:
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {bannedClichés.map((cliche, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs font-mono"
            >
              ✗ {cliche}
            </span>
          ))}
        </div>
      </div>

      {/* History of Indexed Hooks */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          Biblioteca de Ganchos Indexados en Tu Cuenta ({projects.length})
        </h3>

        <div className="space-y-3">
          {projects.map((project, idx) => (
            <div
              key={project.id}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded">
                    {project.category}
                  </span>
                  <span className="text-xs font-bold text-white">{project.title}</span>
                </div>
                <p className="text-xs text-slate-300 italic">"{project.hook}"</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopy(project.hook, idx)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white flex items-center gap-1"
                >
                  {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIndex === idx ? 'Copiado' : 'Copiar'}</span>
                </button>

                <button
                  onClick={() => onOpenProject(project)}
                  className="px-3 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white text-xs font-semibold border border-violet-500/30 transition-all"
                >
                  Ver Ficha
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
