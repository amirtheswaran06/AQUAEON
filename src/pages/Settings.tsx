import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Save,
  RotateCcw,
  Download,
  CheckCircle,
  HelpCircle,
  Sliders,
  DollarSign,
  Droplets,
  Zap,
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { SimulationSettings } from '../types';
import { exportSustainabilitySummaryCsv, exportWorkloadsToCsv } from '../utils/exportCsv';
import { calculateBaselineComparison } from '../engine/baselineScheduler';

export const Settings: React.FC = () => {
  const {
    settings,
    updateSettings,
    restoreDefaultSettings,
    workloads,
    underwaterDC,
    landDC,
  } = useSimulation();

  const [formState, setFormState] = useState<SimulationSettings>(settings);
  const [saveNotification, setSaveNotification] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formState);
    setSaveNotification(true);
    setTimeout(() => setSaveNotification(false), 2500);
  };

  const handleRestore = () => {
    restoreDefaultSettings();
    setFormState(settings);
    setSaveNotification(true);
    setTimeout(() => setSaveNotification(false), 2500);
  };

  const handleExportWorkloads = () => {
    exportWorkloadsToCsv(workloads);
  };

  const handleExportSustainability = () => {
    const comparison = calculateBaselineComparison(workloads, underwaterDC, landDC, settings);
    const avgCpu = (underwaterDC.cpuUtilization + landDC.cpuUtilization) / 2;
    const underwaterCount = workloads.filter((w) => w.assignedLocation === 'Underwater').length;
    const landCount = workloads.filter((w) => w.assignedLocation === 'Land-Based').length;

    exportSustainabilitySummaryCsv({
      totalWorkloads: workloads.length,
      totalEnergyKWh: comparison.totalAquaeonEnergyKWh,
      totalEnergySavedKWh: comparison.energySavedKWh,
      totalWaterSavedLiters: comparison.waterSavedLiters,
      avgCpuUtilization: avgCpu,
      underwaterCount,
      landCount,
      electricityCostSavedUSD: comparison.energySavedKWh * settings.electricityPricePerKWh,
    });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white m-0">
            Platform Settings & Thermodynamic Parameters
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Configure PUE coefficients, server wattage, safety limits, water factors, and export simulation reports.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportWorkloads}
            className="px-3.5 py-2 rounded-lg bg-[#0B2942] hover:bg-[#153450] text-slate-200 border border-[#153450] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#21D4D8]" />
            <span>Export Workload CSV</span>
          </button>
          <button
            onClick={handleExportSustainability}
            className="px-3.5 py-2 rounded-lg bg-[#0B2942] hover:bg-[#153450] text-slate-200 border border-[#153450] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Sustainability Summary</span>
          </button>
        </div>
      </div>

      {saveNotification && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>Platform settings updated successfully. Applied to all future simulation cycles.</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. Facility PUE & Power Characteristics */}
          <div className="p-5 bg-[#0B2942]/70 border border-[#153450] rounded-xl space-y-4">
            <div className="flex items-center gap-2 text-white font-semibold text-sm pb-2 border-b border-[#153450]">
              <Zap className="w-4 h-4 text-[#21D4D8]" />
              <span>Facility Power Usage Effectiveness (PUE)</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Underwater Pod PUE
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1.0"
                  max="2.0"
                  value={formState.underwaterPue}
                  onChange={(e) =>
                    setFormState({ ...formState, underwaterPue: parseFloat(e.target.value) })
                  }
                  className="w-full bg-[#071827] border border-[#153450] rounded-lg px-3 py-2 text-white focus:border-[#21D4D8] outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Default: 1.07</span>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Land-Based Facility PUE
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1.0"
                  max="3.0"
                  value={formState.landPue}
                  onChange={(e) =>
                    setFormState({ ...formState, landPue: parseFloat(e.target.value) })
                  }
                  className="w-full bg-[#071827] border border-[#153450] rounded-lg px-3 py-2 text-white focus:border-[#21D4D8] outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Default: 1.35</span>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Idle Server Power (Watts)
                </label>
                <input
                  type="number"
                  min="10"
                  max="500"
                  value={formState.idleServerPowerWatts}
                  onChange={(e) =>
                    setFormState({ ...formState, idleServerPowerWatts: parseInt(e.target.value) })
                  }
                  className="w-full bg-[#071827] border border-[#153450] rounded-lg px-3 py-2 text-white focus:border-[#21D4D8] outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Max Server Power (Watts)
                </label>
                <input
                  type="number"
                  min="100"
                  max="2000"
                  value={formState.maxServerPowerWatts}
                  onChange={(e) =>
                    setFormState({ ...formState, maxServerPowerWatts: parseInt(e.target.value) })
                  }
                  className="w-full bg-[#071827] border border-[#153450] rounded-lg px-3 py-2 text-white focus:border-[#21D4D8] outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Safety Headroom & Thermal Limits */}
          <div className="p-5 bg-[#0B2942]/70 border border-[#153450] rounded-xl space-y-4">
            <div className="flex items-center gap-2 text-white font-semibold text-sm pb-2 border-b border-[#153450]">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Safety Thresholds & Throttling Limits</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Underwater Safe CPU Cap (%)
                </label>
                <input
                  type="number"
                  min="50"
                  max="99"
                  value={formState.underwaterSafeCpuLimit}
                  onChange={(e) =>
                    setFormState({ ...formState, underwaterSafeCpuLimit: parseInt(e.target.value) })
                  }
                  className="w-full bg-[#071827] border border-[#153450] rounded-lg px-3 py-2 text-white focus:border-[#21D4D8] outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Land Safe CPU Cap (%)
                </label>
                <input
                  type="number"
                  min="50"
                  max="99"
                  value={formState.landSafeCpuLimit}
                  onChange={(e) =>
                    setFormState({ ...formState, landSafeCpuLimit: parseInt(e.target.value) })
                  }
                  className="w-full bg-[#071827] border border-[#153450] rounded-lg px-3 py-2 text-white focus:border-[#21D4D8] outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Underwater Temp Alert (°C)
                </label>
                <input
                  type="number"
                  min="25"
                  max="60"
                  value={formState.underwaterTempWarningLimit}
                  onChange={(e) =>
                    setFormState({ ...formState, underwaterTempWarningLimit: parseInt(e.target.value) })
                  }
                  className="w-full bg-[#071827] border border-[#153450] rounded-lg px-3 py-2 text-white focus:border-[#21D4D8] outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Land Temp Alert (°C)
                </label>
                <input
                  type="number"
                  min="25"
                  max="60"
                  value={formState.landTempWarningLimit}
                  onChange={(e) =>
                    setFormState({ ...formState, landTempWarningLimit: parseInt(e.target.value) })
                  }
                  className="w-full bg-[#071827] border border-[#153450] rounded-lg px-3 py-2 text-white focus:border-[#21D4D8] outline-none"
                />
              </div>
            </div>
          </div>

          {/* 3. Water Factors & Economics */}
          <div className="p-5 bg-[#0B2942]/70 border border-[#153450] rounded-xl space-y-4">
            <div className="flex items-center gap-2 text-white font-semibold text-sm pb-2 border-b border-[#153450]">
              <Droplets className="w-4 h-4 text-teal-400" />
              <span>Water Cooling Factors (Liters per kWh)</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Underwater Water Factor
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.0"
                  max="1.0"
                  value={formState.underwaterWaterFactor}
                  onChange={(e) =>
                    setFormState({ ...formState, underwaterWaterFactor: parseFloat(e.target.value) })
                  }
                  className="w-full bg-[#071827] border border-[#153450] rounded-lg px-3 py-2 text-white focus:border-[#21D4D8] outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Default: 0.05 L/kWh</span>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Land-Based Water Factor
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="5.0"
                  value={formState.landWaterFactor}
                  onChange={(e) =>
                    setFormState({ ...formState, landWaterFactor: parseFloat(e.target.value) })
                  }
                  className="w-full bg-[#071827] border border-[#153450] rounded-lg px-3 py-2 text-white focus:border-[#21D4D8] outline-none"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Default: 1.20 L/kWh</span>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Electricity Price ($ / kWh)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="1.0"
                  value={formState.electricityPricePerKWh}
                  onChange={(e) =>
                    setFormState({ ...formState, electricityPricePerKWh: parseFloat(e.target.value) })
                  }
                  className="w-full bg-[#071827] border border-[#153450] rounded-lg px-3 py-2 text-white focus:border-[#21D4D8] outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Simulation Speed Multiplier
                </label>
                <select
                  value={formState.simulationSpeedMultiplier}
                  onChange={(e) =>
                    setFormState({ ...formState, simulationSpeedMultiplier: parseInt(e.target.value) })
                  }
                  className="w-full bg-[#071827] border border-[#153450] rounded-lg px-3 py-2 text-white focus:border-[#21D4D8] outline-none"
                >
                  <option value={1}>1x (Standard)</option>
                  <option value={2}>2x (Accelerated)</option>
                  <option value={5}>5x (Fast Telemetry)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4. Scheduling Objective */}
          <div className="p-5 bg-[#0B2942]/70 border border-[#153450] rounded-xl space-y-4">
            <div className="flex items-center gap-2 text-white font-semibold text-sm pb-2 border-b border-[#153450]">
              <SettingsIcon className="w-4 h-4 text-emerald-400" />
              <span>AI Optimizer Objective</span>
            </div>

            <div className="text-xs space-y-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Automatic Optimization Criterion
                </label>
                <select
                  value={formState.autoSchedulingPreference}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      autoSchedulingPreference: e.target.value as any,
                    })
                  }
                  className="w-full bg-[#071827] border border-[#153450] rounded-lg px-3 py-2 text-white focus:border-[#21D4D8] outline-none"
                >
                  <option value="Balanced">Balanced (Optimal PUE, Water & Load Balancing)</option>
                  <option value="MaxEnergySavings">Prioritize Maximum Energy Savings (PUE First)</option>
                  <option value="MaxWaterSavings">Prioritize Maximum Water Conservation</option>
                </select>
              </div>

              <div className="p-3 bg-[#071827] rounded-lg border border-[#153450] text-slate-400">
                Settings are held in React state for this browser session. Refreshing returns to initial simulated values.
              </div>
            </div>
          </div>
        </div>

        {/* Buttons Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#153450]">
          <button
            type="button"
            onClick={handleRestore}
            className="px-4 py-2.5 rounded-lg bg-[#071827] hover:bg-[#153450] text-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restore Defaults</span>
          </button>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#14B8A6] to-[#21D4D8] text-[#071827] text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#21D4D8]/20 hover:opacity-90 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
