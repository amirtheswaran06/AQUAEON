import React from 'react';
import { LucideIcon, HelpCircle } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  trendText?: string;
  trendPositive?: boolean;
  baselineComparison?: string;
  tooltip: string;
  highlightColor?: 'cyan' | 'teal' | 'amber' | 'emerald';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  trendText,
  trendPositive = true,
  baselineComparison,
  tooltip,
  highlightColor = 'cyan',
}) => {
  const colorMap = {
    cyan: 'text-[#21D4D8] border-[#21D4D8]/30 bg-[#21D4D8]/10',
    teal: 'text-[#14B8A6] border-[#14B8A6]/30 bg-[#14B8A6]/10',
    amber: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
    emerald: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  };

  return (
    <div className="group relative bg-[#0B2942]/70 hover:bg-[#0B2942] border border-[#153450] hover:border-[#21D4D8]/40 rounded-xl p-5 transition-all shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
          <span>{title}</span>
          <div className="relative group/tooltip cursor-help inline-flex items-center">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500 hover:text-[#21D4D8]" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block w-48 p-2 bg-[#071827] text-slate-300 text-xs rounded-md border border-[#153450] shadow-xl z-50 pointer-events-none">
              {tooltip}
            </div>
          </div>
        </div>

        <div className={`p-2.5 rounded-lg border ${colorMap[highlightColor]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
        {unit && <span className="text-sm font-medium text-[#94A3B8]">{unit}</span>}
      </div>

      {(trendText || baselineComparison) && (
        <div className="mt-3 pt-3 border-t border-[#153450]/80 flex flex-col gap-1 text-xs">
          {baselineComparison && (
            <div className="text-slate-400 font-medium">
              Baseline: <span className="text-slate-200">{baselineComparison}</span>
            </div>
          )}
          {trendText && (
            <div className={`font-semibold ${trendPositive ? 'text-emerald-400' : 'text-amber-400'}`}>
              {trendText}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
