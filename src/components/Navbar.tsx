import React from 'react';
import { UserProfile } from '../types';
import { Flame, ShieldCheck, Sparkles, User, Plus, Search, Calendar, Film } from 'lucide-react';

interface NavbarProps {
  currentUser: UserProfile;
  onOpenAuth: () => void;
  onNewContent: () => void;
  onNavigate: (tab: string) => void;
  activeTab: string;
  indexedHooksCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuth,
  onNewContent,
  onNavigate,
  indexedHooksCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 flex items-center justify-between transition-all">
      {/* Brand & Logo */}
      <div className="flex items-center gap-4">
        <div
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-fuchsia-500 p-0.5 shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Flame className="w-5 h-5 text-violet-400 group-hover:text-fuchsia-400 transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5 font-['Plus_Jakarta_Sans']">
                VIRAL CONTENT <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/30">
                PRO ENGINE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {currentUser.brandName || 'Plataforma Inteligente de Creación y Marketing'}
            </p>
          </div>
        </div>
      </div>

      {/* Center: Anti-Repetition Shield & Quick Navigation */}
      <div className="hidden md:flex items-center gap-3">
        <div
          onClick={() => onNavigate('antirepetition')}
          className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2 cursor-pointer hover:bg-emerald-500/20 transition-colors"
          title="El motor analiza tu base de datos de contenidos previos para evitar ganchos o estructuras repetidas."
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-medium">Antirrepetición Activo</span>
          <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded-full font-bold">
            {indexedHooksCount} ganchos indexados
          </span>
        </div>

        <button
          onClick={() => onNavigate('viral_search')}
          className="px-3 py-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:text-white hover:bg-indigo-500/25 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Film className="w-3.5 h-3.5 text-indigo-400" />
          <span>Buscador de Videos</span>
        </button>

        <button
          onClick={() => onNavigate('trends')}
          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-violet-400" />
          <span>Tendencias Reales</span>
        </button>

        <button
          onClick={() => onNavigate('calendar')}
          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs flex items-center gap-2 transition-colors"
        >
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          <span>Calendario</span>
        </button>
      </div>

      {/* Right: Actions & User Account */}
      <div className="flex items-center gap-3">
        <button
          onClick={onNewContent}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/25 transition-all flex items-center gap-2 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nuevo Contenido</span>
        </button>

        <div
          onClick={onOpenAuth}
          className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
        >
          <div className="text-right hidden sm:block">
            <span className="text-xs font-medium text-slate-200 block truncate max-w-[120px]">
              {currentUser.fullName}
            </span>
            <span className="text-[10px] text-violet-400 block truncate max-w-[120px]">
              {currentUser.niche || 'Creador Pro'}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
            {currentUser.fullName.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};
