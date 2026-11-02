import React, { useState } from 'react';
import { UserProfile, ContentProject } from '../types';
import { StorageService } from '../services/storage';
import {
  Settings,
  Save,
  CheckCircle,
  Download,
  Upload,
  User,
  Shield,
  Sparkles,
  RefreshCw,
  Trash2,
} from 'lucide-react';

interface ProfileSettingsViewProps {
  currentUser: UserProfile;
  projects: ContentProject[];
  onUserUpdate: (user: UserProfile) => void;
  onRefreshProjects: () => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  currentUser,
  projects,
  onUserUpdate,
  onRefreshProjects,
}) => {
  const [formData, setFormData] = useState({
    fullName: currentUser.fullName,
    brandName: currentUser.brandName,
    email: currentUser.email,
    niche: currentUser.niche,
    targetAudience: currentUser.targetAudience,
    defaultTone: currentUser.defaultTone,
    defaultCta: currentUser.defaultCta,
    characterVisualPrompt: currentUser.characterVisualPrompt || '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...currentUser,
      ...formData,
    };
    StorageService.saveUser(updated);
    onUserUpdate(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExportBackup = () => {
    const backup = {
      user: currentUser,
      projects: projects,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_viral_content_ai_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.user) {
          StorageService.saveUser(parsed.user);
          onUserUpdate(parsed.user);
        }
        if (Array.isArray(parsed.projects)) {
          parsed.projects.forEach((p: ContentProject) => StorageService.saveProject(p));
          onRefreshProjects();
        }
        alert('Copia de seguridad restaurada exitosamente.');
      } catch (err) {
        alert('Error al leer el archivo de copia de seguridad.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-16">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold">
          <Settings className="w-3.5 h-3.5" />
          <span>Configuración de Marca y Cuenta</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Perfil de Creador y Datos Maestros
        </h1>
        <p className="text-slate-400 text-xs md:text-sm max-w-2xl leading-relaxed">
          Los datos que configures aquí alimentarán automáticamente todos los prompts generados por el motor para que el tono, el CTA y la descripción del personaje se mantengan consistentes.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>Datos guardados correctamente.</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Nombre Completo
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Nombre de Marca o Canal
            </label>
            <input
              type="text"
              value={formData.brandName}
              onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Correo Electrónico de Cuenta
          </label>
          <input
            type="email"
            value={formData.email}
            disabled
            className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Nicho / Industria Principal
          </label>
          <input
            type="text"
            value={formData.niche}
            onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
            placeholder="Ej: Nutrición y Recetas Saludables, Inversiones, Productividad"
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
            Público Objetivo Habitual (Dolores y Deseos del Cliente)
          </label>
          <textarea
            rows={2}
            value={formData.targetAudience}
            onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Tono de Voz
            </label>
            <input
              type="text"
              value={formData.defaultTone}
              onChange={(e) => setFormData({ ...formData, defaultTone: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Llamado a la Acción Predeterminado
            </label>
            <input
              type="text"
              value={formData.defaultCta}
              onChange={(e) => setFormData({ ...formData, defaultCta: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        {/* Character Visual Consistency Prompt */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-violet-400">
            Prompt de Consistencia Visual del Creador / Avatar (Midjourney & Sora)
          </label>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Escribe cómo debe verse la persona en todas las escenas para mantener el mismo rostro, peinado, ropa y entorno en las imágenes y videos generados con IA.
          </p>
          <textarea
            rows={3}
            value={formData.characterVisualPrompt}
            onChange={(e) => setFormData({ ...formData, characterVisualPrompt: e.target.value })}
            placeholder="Ej: Mujer de 32 años con cabello castaño claro recogido, sudadera beige minimalista, cocina moderna de madera y mármol blanco..."
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-600/30 flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Configuración</span>
          </button>
        </div>
      </form>

      {/* Backup and Data Portability */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
          <Download className="w-4 h-4 text-violet-400" />
          <span>Respaldo y Portabilidad de Proyectos</span>
        </h3>
        <p className="text-xs text-slate-400">
          Descarga todos tus guiones, ganchos y fichas de producción en un archivo JSON seguro o restaura un respaldo en cualquier navegador:
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportBackup}
            className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 hover:border-slate-600 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-violet-400" />
            <span>Descargar Copia de Seguridad JSON ({projects.length} contenidos)</span>
          </button>

          <label className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 hover:border-slate-600 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            <span>Restaurar Copia de Seguridad</span>
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
};
