import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Flame,
  Search,
  FileVideo,
  FileText,
  Calendar,
  FolderKanban,
  ShieldCheck,
  Settings,
  Star,
  Clock,
  CheckCircle,
  HelpCircle,
  Film,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  projectsCount: number;
  favoritesCount: number;
  pendingCount: number;
  readyCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  projectsCount,
  favoritesCount,
  pendingCount,
  readyCount,
}) => {
  const mainItems = [
    {
      id: 'dashboard',
      label: 'Panel Principal',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'viral_search',
      label: 'Buscador de Videos',
      icon: Film,
      highlight: true,
      badge: 'Galería',
    },
    {
      id: 'generator',
      label: 'Generador Inteligente',
      icon: Sparkles,
      highlight: false,
      badge: 'Multi-Ángulo',
    },
    {
      id: 'trends',
      label: 'Investigador Viral',
      icon: Flame,
      badge: 'Grounding Real',
    },
    {
      id: 'analyzer',
      label: 'Analizador de Video',
      icon: Search,
      badge: null,
    },
    {
      id: 'scriptwriter',
      label: 'Creador de Guiones',
      icon: FileVideo,
      badge: null,
    },
    {
      id: 'calendar',
      label: 'Calendario Estratégico',
      icon: Calendar,
      badge: '7 a 90 Días',
    },
    {
      id: 'projects',
      label: 'Fichas de Producción',
      icon: FolderKanban,
      badge: String(projectsCount),
    },
  ];

  const filterItems = [
    {
      id: 'filter-favorites',
      label: 'Favoritos',
      icon: Star,
      count: favoritesCount,
      color: 'text-amber-400',
    },
    {
      id: 'filter-pending',
      label: 'Pendientes / Producción',
      icon: Clock,
      count: pendingCount,
      color: 'text-sky-400',
    },
    {
      id: 'filter-ready',
      label: 'Listos / Publicados',
      icon: CheckCircle,
      count: readyCount,
      color: 'text-emerald-400',
    },
  ];

  const systemItems = [
    {
      id: 'antirepetition',
      label: 'Motor Antirrepetición',
      icon: ShieldCheck,
      badge: 'Escudo Activo',
    },
    {
      id: 'settings',
      label: 'Perfil y Marca',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-slate-950/60 border-r border-slate-800/80 p-4 flex flex-col justify-between hidden md:flex h-[calc(100vh-61px)] sticky top-[61px] overflow-y-auto">
      <div className="space-y-6">
        {/* Main Section */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Producción y Creación
          </div>
          <nav className="space-y-1">
            {mainItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40 shadow-sm shadow-violet-900/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/70 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? 'text-violet-400'
                          : item.highlight
                          ? 'text-fuchsia-400'
                          : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-violet-500/30 text-violet-200'
                          : 'bg-slate-800/80 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Saved Filters */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Filtros de Contenido
          </div>
          <div className="space-y-1">
            {filterItems.map((f) => {
              const Icon = f.icon;
              const isActive = activeTab === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => onSelectTab(f.id)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-3.5 h-3.5 ${f.color}`} />
                    <span>{f.label}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-semibold">{f.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Intelligence System */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Inteligencia y Marca
          </div>
          <div className="space-y-1">
            {systemItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/70 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-emerald-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pro Help Footer */}
      <div className="p-3 bg-gradient-to-b from-slate-900 to-indigo-950/40 border border-slate-800 rounded-xl text-xs text-slate-400">
        <div className="flex items-center gap-2 font-semibold text-white mb-1">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span>Fórmulas Virales</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-400">
          Nunca copies literalmente. El algoritmo premia la estructura psicológica con identidad única.
        </p>
      </div>
    </aside>
  );
};
