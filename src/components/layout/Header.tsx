import React from 'react';
import { Play, Pause, RotateCcw, Activity, Bell, Menu } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

interface HeaderProps {
  onMenuToggle: () => void;
  onNavigateAlerts: () => void;
  activeAlertCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuToggle,
  onNavigateAlerts,
  activeAlertCount,
}) => {
  const { isRunning, startSimulation, pauseSimulation, resetSimulation } = useSimulation();

  return (
    <header className="h-16 bg-[#071827] border-b border-[#153450] px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#0B2942]"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Notice Badge */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#0B2942] border border-[#153450]">
          <span className="w-2 h-2 rounded-full bg-[#21D4D8] animate-ping" />
          <span className="text-xs font-semibold text-[#21D4D8] tracking-wider uppercase">
            SIMULATED ENVIRONMENT
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Simulation Controls */}
        <div className="flex items-center bg-[#0B2942] rounded-lg p-1 border border-[#153450] gap-1">
          {isRunning ? (
            <button
              onClick={pauseSimulation}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-400 hover:bg-[#153450] rounded-md transition-colors"
              title="Pause telemetry updates"
            >
              <Pause className="w-3.5 h-3.5 fill-amber-400" />
              <span className="hidden sm:inline">Pause</span>
            </button>
          ) : (
            <button
              onClick={startSimulation}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#21D4D8] hover:bg-[#153450] rounded-md transition-colors"
              title="Start or resume telemetry updates"
            >
              <Play className="w-3.5 h-3.5 fill-[#21D4D8]" />
              <span className="hidden sm:inline">Start</span>
            </button>
          )}

          <div className="w-[1px] h-4 bg-[#153450]" />

          <button
            onClick={resetSimulation}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#94A3B8] hover:text-white hover:bg-[#153450] rounded-md transition-colors"
            title="Reset simulation parameters and metrics"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#0B2942]/60 rounded-lg border border-[#153450] text-xs">
          <Activity className={`w-3.5 h-3.5 ${isRunning ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
          <span className="text-slate-300">
            Engine: <strong className={isRunning ? 'text-emerald-400' : 'text-amber-400'}>{isRunning ? 'Active' : 'Paused'}</strong>
          </span>
        </div>

        {/* Notification Bell */}
        <button
          onClick={onNavigateAlerts}
          className="relative p-2 rounded-lg bg-[#0B2942] border border-[#153450] text-[#94A3B8] hover:text-white hover:border-[#21D4D8]/50 transition-colors"
          aria-label="View notifications and alerts"
        >
          <Bell className="w-4 h-4" />
          {activeAlertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {activeAlertCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
