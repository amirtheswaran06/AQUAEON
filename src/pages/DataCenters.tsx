import React from 'react';
import {
  Waves,
  Building2,
  Cpu,
  Thermometer,
  Zap,
  Activity,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export const DataCenters: React.FC = () => {
  const { underwaterDC, landDC, settings } = useSimulation();

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white m-0">
          Simulated Data Center Facilities
        </h1>
        <p className="text-sm text-[#94A3B8] mt-1">
          Detailed real-time telemetry, thermal characteristics, and rack capacity comparison between Underwater and Land-Based nodes.
        </p>
      </div>

      {/* Two Main DC Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* UNDERWATER DC */}
        <div className="bg-[#0B2942]/80 border border-[#21D4D8]/30 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#21D4D8]/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#153450]">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#21D4D8]/10 border border-[#21D4D8]/30 text-[#21D4D8]">
                  <Waves className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight m-0">
                    Subsea Pod (Underwater)
                  </h2>
                  <span className="text-xs text-[#21D4D8] font-medium tracking-wide">
                    Depth: ~35m Seabed • Seawater Convection Cooling
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Healthy</span>
              </div>
            </div>

            {/* Visual Pod Graphic & Rack Indicator */}
            <div className="my-5 p-4 rounded-xl bg-[#071827]/80 border border-[#153450] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#0B2942] border border-[#21D4D8]/40 flex items-center justify-center">
                  <Layers className="w-6 h-6 text-[#21D4D8]" />
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8]">Hermetically Sealed Pod</p>
                  <p className="text-sm font-semibold text-white">Pressure Hull & Nitrogen Purge</p>
                </div>
              </div>

              {/* Racks visual */}
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5, 6].map((rack) => {
                  const isBusy = rack <= Math.ceil((underwaterDC.cpuUtilization / 100) * 6);
                  return (
                    <div
                      key={rack}
                      className={`w-3.5 h-10 rounded-sm border transition-all ${
                        isBusy
                          ? 'bg-[#21D4D8] border-[#21D4D8] shadow-sm shadow-[#21D4D8]/50'
                          : 'bg-[#153450]/40 border-[#153450]'
                      }`}
                      title={`Rack Unit ${rack}: ${isBusy ? 'Active' : 'Standby'}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Gauges & Telemetry */}
            <div className="grid grid-cols-2 gap-4">
              {/* CPU Gauge */}
              <div className="p-4 rounded-xl bg-[#071827]/60 border border-[#153450]">
                <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-[#21D4D8]" /> CPU Utilization
                  </span>
                  <span className="font-semibold text-white">{underwaterDC.cpuUtilization}%</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-[#153450] h-2.5 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#14B8A6] to-[#21D4D8] transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, underwaterDC.cpuUtilization)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-[#94A3B8] mt-1.5">
                  <span>Available: {(100 - underwaterDC.cpuUtilization).toFixed(1)}%</span>
                  <span>Safety Limit: {settings.underwaterSafeCpuLimit}%</span>
                </div>
              </div>

              {/* Temperature Gauge */}
              <div className="p-4 rounded-xl bg-[#071827]/60 border border-[#153450]">
                <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                  <span className="flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-[#21D4D8]" /> Pod Temperature
                  </span>
                  <span className="font-semibold text-white">{underwaterDC.temperature}°C</span>
                </div>
                <div className="w-full bg-[#153450] h-2.5 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className="h-full bg-[#21D4D8] transition-all duration-500 rounded-full"
                    style={{
                      width: `${Math.min(100, (underwaterDC.temperature / settings.underwaterTempWarningLimit) * 100)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-[#94A3B8] mt-1.5">
                  <span>Thermal: Stable</span>
                  <span>Threshold: {settings.underwaterTempWarningLimit}°C</span>
                </div>
              </div>
            </div>

            {/* Key Specs Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
              <div className="p-3 bg-[#071827]/60 rounded-lg border border-[#153450]">
                <span className="text-[#94A3B8]">PUE Ratio</span>
                <p className="text-base font-bold text-[#21D4D8] mt-0.5">{underwaterDC.pue.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-[#071827]/60 rounded-lg border border-[#153450]">
                <span className="text-[#94A3B8]">Facility Power</span>
                <p className="text-base font-bold text-white mt-0.5">{underwaterDC.currentPowerWatts.toFixed(0)} W</p>
              </div>
              <div className="p-3 bg-[#071827]/60 rounded-lg border border-[#153450]">
                <span className="text-[#94A3B8]">Water Factor</span>
                <p className="text-base font-bold text-teal-400 mt-0.5">{settings.underwaterWaterFactor} L/kWh</p>
              </div>
              <div className="p-3 bg-[#071827]/60 rounded-lg border border-[#153450]">
                <span className="text-[#94A3B8]">Active Jobs</span>
                <p className="text-base font-bold text-white mt-0.5">{underwaterDC.workloadCount}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#153450] text-[11px] text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#21D4D8]" />
            Natural ocean convective heat sink eliminates standard evaporative cooling tower water losses.
          </div>
        </div>

        {/* LAND-BASED DC */}
        <div className="bg-[#0B2942]/80 border border-slate-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#153450]">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight m-0">
                    Continental Facility (Land-Based)
                  </h2>
                  <span className="text-xs text-amber-400/90 font-medium tracking-wide">
                    Surface Facility • Mechanical Chillers & Cooling Towers
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Operational</span>
              </div>
            </div>

            {/* Visual Building Graphic & Rack Indicator */}
            <div className="my-5 p-4 rounded-xl bg-[#071827]/80 border border-[#153450] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#0B2942] border border-amber-500/40 flex items-center justify-center">
                  <Layers className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-[#94A3B8]">Server Hall Floor 2</p>
                  <p className="text-sm font-semibold text-white">Chilled Water Air Handlers (CRAH)</p>
                </div>
              </div>

              {/* Racks visual */}
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5, 6].map((rack) => {
                  const isBusy = rack <= Math.ceil((landDC.cpuUtilization / 100) * 6);
                  return (
                    <div
                      key={rack}
                      className={`w-3.5 h-10 rounded-sm border transition-all ${
                        isBusy
                          ? 'bg-amber-400 border-amber-400 shadow-sm shadow-amber-400/40'
                          : 'bg-[#153450]/40 border-[#153450]'
                      }`}
                      title={`Rack Unit ${rack}: ${isBusy ? 'Active' : 'Standby'}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Gauges & Telemetry */}
            <div className="grid grid-cols-2 gap-4">
              {/* CPU Gauge */}
              <div className="p-4 rounded-xl bg-[#071827]/60 border border-[#153450]">
                <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-amber-400" /> CPU Utilization
                  </span>
                  <span className="font-semibold text-white">{landDC.cpuUtilization}%</span>
                </div>
                <div className="w-full bg-[#153450] h-2.5 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, landDC.cpuUtilization)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-[#94A3B8] mt-1.5">
                  <span>Available: {(100 - landDC.cpuUtilization).toFixed(1)}%</span>
                  <span>Safety Limit: {settings.landSafeCpuLimit}%</span>
                </div>
              </div>

              {/* Temperature Gauge */}
              <div className="p-4 rounded-xl bg-[#071827]/60 border border-[#153450]">
                <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                  <span className="flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-amber-400" /> Hall Temperature
                  </span>
                  <span className="font-semibold text-white">{landDC.temperature}°C</span>
                </div>
                <div className="w-full bg-[#153450] h-2.5 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-500 rounded-full"
                    style={{
                      width: `${Math.min(100, (landDC.temperature / settings.landTempWarningLimit) * 100)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-[#94A3B8] mt-1.5">
                  <span>Thermal: Warning Zone</span>
                  <span>Threshold: {settings.landTempWarningLimit}°C</span>
                </div>
              </div>
            </div>

            {/* Key Specs Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
              <div className="p-3 bg-[#071827]/60 rounded-lg border border-[#153450]">
                <span className="text-[#94A3B8]">PUE Ratio</span>
                <p className="text-base font-bold text-amber-400 mt-0.5">{landDC.pue.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-[#071827]/60 rounded-lg border border-[#153450]">
                <span className="text-[#94A3B8]">Facility Power</span>
                <p className="text-base font-bold text-white mt-0.5">{landDC.currentPowerWatts.toFixed(0)} W</p>
              </div>
              <div className="p-3 bg-[#071827]/60 rounded-lg border border-[#153450]">
                <span className="text-[#94A3B8]">Water Factor</span>
                <p className="text-base font-bold text-red-400 mt-0.5">{settings.landWaterFactor} L/kWh</p>
              </div>
              <div className="p-3 bg-[#071827]/60 rounded-lg border border-[#153450]">
                <span className="text-[#94A3B8]">Active Jobs</span>
                <p className="text-base font-bold text-white mt-0.5">{landDC.workloadCount}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-[#153450] text-[11px] text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            Evaporative chillers require persistent water intake, increasing consumption as ambient heat rises.
          </div>
        </div>
      </div>

      {/* Comparison Analysis Table */}
      <div className="bg-[#0B2942]/70 border border-[#153450] rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-white mb-2">
          Architecture Efficiency Comparison
        </h3>
        <p className="text-xs text-[#94A3B8] mb-5">
          Calculated differences under current workload telemetry.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#153450] text-[#94A3B8] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Evaluation Dimension</th>
                <th className="py-3 px-4 text-[#21D4D8]">Underwater Subsea Pod</th>
                <th className="py-3 px-4 text-amber-400">Land-Based Facility</th>
                <th className="py-3 px-4 text-emerald-400">Optimization Gain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#153450]/60 text-slate-300">
              <tr>
                <td className="py-3 px-4 font-medium text-white">Power Usage Effectiveness (PUE)</td>
                <td className="py-3 px-4">{underwaterDC.pue.toFixed(2)}</td>
                <td className="py-3 px-4">{landDC.pue.toFixed(2)}</td>
                <td className="py-3 px-4 font-semibold text-emerald-400">
                  +{(((landDC.pue - underwaterDC.pue) / landDC.pue) * 100).toFixed(1)}% power efficiency
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Cooling Water Consumption Factor</td>
                <td className="py-3 px-4">{settings.underwaterWaterFactor} L / kWh</td>
                <td className="py-3 px-4">{settings.landWaterFactor} L / kWh</td>
                <td className="py-3 px-4 font-semibold text-emerald-400">
                  +{(((settings.landWaterFactor - settings.underwaterWaterFactor) / settings.landWaterFactor) * 100).toFixed(1)}% water reduction
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Operating Temperature</td>
                <td className="py-3 px-4">{underwaterDC.temperature}°C</td>
                <td className="py-3 px-4">{landDC.temperature}°C</td>
                <td className="py-3 px-4 text-slate-300">
                  {(landDC.temperature - underwaterDC.temperature).toFixed(1)}°C cooler baseline
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Current Facility Power Draw</td>
                <td className="py-3 px-4">{underwaterDC.currentPowerWatts.toFixed(0)} W</td>
                <td className="py-3 px-4">{landDC.currentPowerWatts.toFixed(0)} W</td>
                <td className="py-3 px-4 text-emerald-400">
                  {Math.abs(landDC.currentPowerWatts - underwaterDC.currentPowerWatts).toFixed(0)} W lower demand
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Safe CPU Headroom Limit</td>
                <td className="py-3 px-4">{settings.underwaterSafeCpuLimit}%</td>
                <td className="py-3 px-4">{settings.landSafeCpuLimit}%</td>
                <td className="py-3 px-4 text-slate-300">+5% extended safe capacity headroom</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
