import React from 'react';
import {
  LayoutDashboard,
  Server,
  CalendarClock,
  Zap,
  Droplets,
  BrainCircuit,
  Bell,
  Settings,
  CloudCog,
  Waves,
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
  activeAlertCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpen,
  onClose,
  activeAlertCount,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'datacenters', label: 'Data Centers', icon: Server },
    { id: 'scheduler', label: 'Workload Scheduler', icon: CalendarClock },
    { id: 'energy', label: 'Energy Analytics', icon: Zap },
    { id: 'water', label: 'Water Sustainability', icon: Droplets },
    { id: 'ai-insights', label: 'AI Insights', icon: BrainCircuit },
    { id: 'alerts', label: 'Alerts & Events', icon: Bell, badge: activeAlertCount },
    { id: 'architecture', label: 'AWS Cloud Architecture', icon: CloudCog },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#071827] border-r border-[#153450] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-[#153450] gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#14B8A6] to-[#21D4D8] flex items-center justify-center shadow-lg shadow-[#21D4D8]/20">
            <Waves className="w-5 h-5 text-[#071827] stroke-[2.5]" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
              AQUA<span className="text-[#21D4D8]">EON</span>
            </span>
            <p className="text-[10px] text-[#94A3B8] font-medium tracking-wide uppercase">
              Hybrid DC Optimizer
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#0B2942] text-[#21D4D8] border border-[#21D4D8]/30 shadow-sm'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#0B2942]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#21D4D8]' : 'text-[#94A3B8]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footnote / Tagline */}
        <div className="p-4 border-t border-[#153450] bg-[#0B2942]/30">
          <div className="rounded-lg bg-[#071827] p-3 border border-[#153450]">
            <p className="text-xs text-white font-semibold">AQUAEON Engine</p>
            <p className="text-[11px] text-[#21D4D8] mt-0.5">
              Smart Workloads. Less Energy. Less Water Waste.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
