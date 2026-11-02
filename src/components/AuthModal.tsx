import React, { useState } from 'react';
import { UserProfile } from '../types';
import { StorageService } from '../services/storage';
import { X, Sparkles, Check, User, Mail, Lock, Building, Target, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUserChange: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
}) => {
  const [tab, setTab] = useState<'profile' | 'switch' | 'register' | 'recover'>('profile');
  const [formData, setFormData] = useState({
    fullName: currentUser.fullName,
    brandName: currentUser.brandName,
    email: currentUser.email,
    password: '',
    niche: currentUser.niche,
    targetAudience: currentUser.targetAudience,
    defaultTone: currentUser.defaultTone,
    defaultCta: currentUser.defaultCta,
    characterVisualPrompt: currentUser.characterVisualPrompt || '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const users = StorageService.getUsers();

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...currentUser,
      fullName: formData.fullName,
      brandName: formData.brandName,
      niche: formData.niche,
      targetAudience: formData.targetAudience,
      defaultTone: formData.defaultTone,
      defaultCta: formData.defaultCta,
      characterVisualPrompt: formData.characterVisualPrompt,
    };
    StorageService.saveUser(updated);
    onUserChange(updated);
    setSuccessMessage('Perfil y datos de marca guardados con éxito.');
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 1200);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.fullName) {
      setErrorMessage('Por favor completa el nombre y correo electrónico.');
      return;
    }
    const newUser: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email: formData.email,
      fullName: formData.fullName,
      brandName: formData.brandName || formData.fullName,
      niche: formData.niche || 'Creador de Contenido',
      targetAudience: formData.targetAudience || 'Audiencia digital',
      defaultTone: formData.defaultTone || 'Persuasivo y Dinámico',
      defaultCta: formData.defaultCta || 'Sígueme para más contenido',
      characterVisualPrompt: formData.characterVisualPrompt,
      createdAt: new Date().toISOString(),
    };
    StorageService.saveUser(newUser);
    onUserChange(newUser);
    setSuccessMessage('Cuenta creada e iniciada exitosamente.');
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 1200);
  };

  const handleSwitchUser = (userId: string) => {
    const switched = StorageService.switchUser(userId);
    if (switched) {
      onUserChange(switched);
      setSuccessMessage(`Sesión cambiada a ${switched.fullName}`);
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 900);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                VIRAL CONTENT AI <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-medium">Cuenta y Perfil</span>
              </h3>
              <p className="text-xs text-slate-400">Gestiona tus proyectos privados, perfil de marca y credenciales</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 pt-2">
          <button
            onClick={() => setTab('profile')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              tab === 'profile'
                ? 'border-violet-500 text-violet-400 bg-violet-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" /> Perfil de Marca
          </button>
          <button
            onClick={() => setTab('switch')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              tab === 'switch'
                ? 'border-violet-500 text-violet-400 bg-violet-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building className="w-4 h-4" /> Cuentas ({users.length})
          </button>
          <button
            onClick={() => setTab('register')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              tab === 'register'
                ? 'border-violet-500 text-violet-400 bg-violet-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Nueva Cuenta
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {successMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs">
              {errorMessage}
            </div>
          )}

          {tab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-violet-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Nombre de Marca o Negocio</label>
                  <input
                    type="text"
                    value={formData.brandName}
                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nicho / Industria Principal</label>
                <input
                  type="text"
                  value={formData.niche}
                  onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                  placeholder="Ej: Recetas saludables, Inversiones, Fitness, Crecimiento personal"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Público Objetivo (Avatar del Cliente)</label>
                <textarea
                  rows={2}
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  placeholder="Quiénes son, qué les duele, qué desean lograr..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Tono de Voz Predeterminado</label>
                  <input
                    type="text"
                    value={formData.defaultTone}
                    onChange={(e) => setFormData({ ...formData, defaultTone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Llamado a la Acción (CTA) Habitual</label>
                  <input
                    type="text"
                    value={formData.defaultCta}
                    onChange={(e) => setFormData({ ...formData, defaultCta: e.target.value })}
                    placeholder="Ej: Toca el enlace en mi perfil para..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Descripción Visual del Creador / Avatar (Para Prompts de IA de Video e Imagen)
                </label>
                <textarea
                  rows={2}
                  value={formData.characterVisualPrompt}
                  onChange={(e) => setFormData({ ...formData, characterVisualPrompt: e.target.value })}
                  placeholder="Ej: Mujer de 32 años, cabello castaño recogido, ropa beige elegante, cocina moderna de fondo..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-violet-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Esta descripción se insertará automáticamente en los prompts de Midjourney, FLUX y Sora para mantener la coherencia de rostro y vestuario.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Guardar Perfil
                </button>
              </div>
            </form>
          )}

          {tab === 'switch' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Selecciona la cuenta activa para alternar entre diferentes marcas, proyectos o nichos de clientes:
              </p>
              <div className="space-y-2">
                {users.map((u) => {
                  const isCurrent = u.id === currentUser.id;
                  const projectCount = StorageService.getProjects(u.id).length;
                  return (
                    <div
                      key={u.id}
                      onClick={() => handleSwitchUser(u.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isCurrent
                          ? 'bg-violet-600/15 border-violet-500/50 shadow-md shadow-violet-900/20'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center font-bold text-white text-sm">
                          {u.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-white">{u.fullName}</h4>
                            {isCurrent && (
                              <span className="text-[10px] px-2 py-0.2 rounded-full bg-violet-500/30 text-violet-300 font-medium">
                                Activa
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400">
                            {u.brandName} • {u.niche}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">{projectCount} proyectos</span>
                        <span className="text-[11px] text-violet-400 hover:underline">Cambiar sesión →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nombre Completo del Creador / Marca</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ej: Carlos Méndez"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="carlos@marca.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-violet-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Contraseña</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Nicho o Tipo de Negocio</label>
                <input
                  type="text"
                  value={formData.niche}
                  onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                  placeholder="Ej: Finanzas Personales, Belleza y Skincare, Software B2B"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setTab('profile')}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Crear Cuenta y Comenzar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
