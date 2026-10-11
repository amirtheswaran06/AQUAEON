import React from 'react';
import {
  BrainCircuit,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Cpu,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export const AIInsights: React.FC = () => {
  const { underwaterDC, landDC, settings, workloads } = useSimulation();

  // Dynamic Rule-based Insights Synthesis
  const isUnderwaterPreferred =
    underwaterDC.cpuUtilization < settings.underwaterSafeCpuLimit &&
    underwaterDC.temperature < settings.underwaterTempWarningLimit;

  const underwaterHeadroom = (settings.underwaterSafeCpuLimit - underwaterDC.cpuUtilization).toFixed(1);
  const landHeadroom = (settings.landSafeCpuLimit - landDC.cpuUtilization).toFixed(1);

  const bestPlacement = isUnderwaterPreferred
    ? 'Underwater Subsea Pod'
    : 'Land-Based Facility (Thermal Protection Mode)';

  const leastEfficient = 'Land-Based Facility (PUE: 1.35 vs Subsea: 1.07)';

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-white m-0">
            AI Optimization Insights
          </h1>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#21D4D8]/20 text-[#21D4D8] border border-[#21D4D8]/30 font-semibold uppercase">
            Rule-Based Expert Engine
          </span>
        </div>
        <p className="text-sm text-[#94A3B8] mt-1">
          Automated heuristic recommendations synthesized from live multi-datacenter thermal telemetry and historical execution trends.
        </p>
      </div>

      {/* Top Recommendations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Best Current Placement */}
        <div className="p-5 rounded-xl bg-[#0B2942]/70 border border-[#21D4D8]/30 shadow-md">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#21D4D8] uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Optimal Placement Target</span>
          </div>
          <p className="text-lg font-bold text-white mb-1">{bestPlacement}</p>
          <p className="text-xs text-slate-300">
            {isUnderwaterPreferred
              ? `Subsea pod has ${underwaterHeadroom}% safe CPU headroom with superior 1.07 PUE.`
              : 'Subsea node nearing safe limits. Routing new workloads to land node to preserve thermal stability.'}
          </p>
        </div>

        {/* Least Efficient Target */}
        <div className="p-5 rounded-xl bg-[#0B2942]/70 border border-amber-500/30 shadow-md">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span>High Footprint Environment</span>
          </div>
          <p className="text-lg font-bold text-white mb-1">{leastEfficient}</p>
          <p className="text-xs text-slate-300">
            Higher chilling overhead requires 1.20 L/kWh water consumption and 26% higher auxiliary electrical draw.
          </p>
        </div>

        {/* Capacity Recommendation */}
        <div className="p-5 rounded-xl bg-[#0B2942]/70 border border-emerald-500/30 shadow-md">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
            <Cpu className="w-4 h-4" />
            <span>Capacity Recommendation</span>
          </div>
          <p className="text-lg font-bold text-white mb-1">
            {Number(underwaterHeadroom) > 30 ? 'High Headroom Available' : 'Balanced Load State'}
          </p>
          <p className="text-xs text-slate-300">
            Recommend queuing compute-heavy batch analytics into underwater node during cooler tidal cycles.
          </p>
        </div>
      </div>

      {/* Structured Insights Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Energy Optimization */}
        <div className="p-5 rounded-xl bg-[#0B2942]/70 border border-[#153450] space-y-3">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            Energy Optimization Directives
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-[#21D4D8] font-bold">•</span>
              <span>
                <strong>PUE Discrepancy Exploitation:</strong> Offloading high CPU AI inference jobs underwater cuts cooling load by 20.7% per FLOP.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#21D4D8] font-bold">•</span>
              <span>
                <strong>Idle Server Minimization:</strong> Consolidating low-utilization tasks to underwater nodes enables continental chillers to cycle into economy mode.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#21D4D8] font-bold">•</span>
              <span>
                <strong>Peak Shaving:</strong> Scheduled batch processing during periods of low renewable grid emission intensity maximizes carbon reduction.
              </span>
            </li>
          </ul>
        </div>

        {/* Thermal Overload Risk Detection */}
        <div className="p-5 rounded-xl bg-[#0B2942]/70 border border-[#153450] space-y-3">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            Thermal Overload & Failure Protection
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">•</span>
              <span>
                <strong>Subsea Threshold Enforcement:</strong> Automatic rejection triggers if underwater node exceeds {settings.underwaterSafeCpuLimit}% CPU or {settings.underwaterTempWarningLimit}°C.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">•</span>
              <span>
                <strong>Chiller Spike Safeguard:</strong> Land facility temperature is currently {landDC.temperature}°C (warning threshold: {settings.landTempWarningLimit}°C).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">•</span>
              <span>
                <strong>Dynamic De-escalation:</strong> Upon detecting high thermal stress, jobs are automatically rescheduled or queued.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Model Attribution Footer */}
      <div className="p-4 rounded-xl bg-[#071827] border border-[#153450] text-xs text-slate-400 flex items-center justify-between">
        <span>
          <strong>Insight Method:</strong> Rule-based heuristic simulation engine (No paid external LLM / API key required).
        </span>
        <span className="text-[#21D4D8] font-medium">Evaluation Cycle: Continuous</span>
      </div>
    </div>
  );
};
