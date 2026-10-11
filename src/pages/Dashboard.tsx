import React from 'react';
import {
  Zap,
  Droplets,
  Server,
  Activity,
  CheckCircle,
  TrendingDown,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { MetricCard } from '../components/shared/MetricCard';
import {
  EnergyTrendChart,
  WaterTrendChart,
  WorkloadDistributionChart,
  CpuComparisonChart,
  WorkloadStatusChart,
  ChartCard,
} from '../components/charts/DashboardCharts';
import { calculateBaselineComparison } from '../engine/baselineScheduler';

export const Dashboard: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { underwaterDC, landDC, workloads, alerts, trendHistory, settings } = useSimulation();

  const comparison = calculateBaselineComparison(workloads, underwaterDC, landDC, settings);

  const totalEnergy = comparison.totalAquaeonEnergyKWh;
  const energySaved = comparison.energySavedKWh;
  const waterSaved = comparison.waterSavedLiters;
  const avgCpu = (underwaterDC.cpuUtilization + landDC.cpuUtilization) / 2;
  const underwaterCount = workloads.filter(w => w.assignedLocation === 'Underwater').length;
  const landCount = workloads.filter(w => w.assignedLocation === 'Land-Based').length;

  return (
    <div className="space-y-6">
      {/* Page Title & Quick Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white m-0">
            Overview Dashboard
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Real-time hybrid underwater & land data center telemetry and intelligent AI scheduling analytics.
          </p>
        </div>

        <button
          onClick={() => onNavigate('scheduler')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#14B8A6] to-[#21D4D8] hover:opacity-95 text-[#071827] font-semibold text-sm rounded-lg shadow-lg shadow-[#21D4D8]/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <span>Schedule Workload</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          title="Workloads Processed"
          value={workloads.length.toString()}
          unit="tasks"
          icon={CheckCircle}
          trendText={`${workloads.filter(w => w.status === 'Running').length} currently active`}
          tooltip="Total workload jobs scheduled in-memory across both simulated data center sites."
          highlightColor="cyan"
        />

        <MetricCard
          title="Facility Energy"
          value={totalEnergy.toFixed(2)}
          unit="kWh"
          icon={Zap}
          baselineComparison={`${comparison.totalBaselineEnergyKWh.toFixed(2)} kWh`}
          trendText={`PUE ${((settings.underwaterPue + settings.landPue) / 2).toFixed(2)} avg`}
          trendPositive={true}
          tooltip="Calculated server plus cooling facility power over elapsed workload durations."
          highlightColor="amber"
        />

        <MetricCard
          title="Energy Saved"
          value={energySaved.toFixed(2)}
          unit="kWh"
          icon={TrendingDown}
          trendText={`${comparison.energySavingsPercent.toFixed(1)}% vs baseline`}
          trendPositive={true}
          tooltip="Energy conservation gained by routing high-density compute to the 1.07 PUE underwater pod."
          highlightColor="teal"
        />

        <MetricCard
          title="Water Saved"
          value={waterSaved.toFixed(1)}
          unit="Liters"
          icon={Droplets}
          trendText={`${comparison.waterSavingsPercent.toFixed(1)}% avoided`}
          trendPositive={true}
          tooltip="Cooling tower evaporative water saved compared to standard land-based data center baseline."
          highlightColor="cyan"
        />

        <MetricCard
          title="Avg CPU Utilization"
          value={`${avgCpu.toFixed(1)}%`}
          icon={Activity}
          trendText={`Subsea: ${underwaterDC.cpuUtilization}% | Land: ${landDC.cpuUtilization}%`}
          trendPositive={avgCpu < 80}
          tooltip="Mean CPU processor utilization computed between subsea pod and land server facility."
          highlightColor="emerald"
        />

        <MetricCard
          title="Active Centers"
          value="2"
          unit="nodes"
          icon={Server}
          trendText="100% telemetry online"
          trendPositive={true}
          tooltip="Both simulated environments (Subsea Seawater Node & Continental Chiller Node) active."
          highlightColor="teal"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Facility Energy Consumption Over Time"
          subtitle="Hourly trend comparing Subsea pod vs Continental facility power consumption"
        >
          <EnergyTrendChart data={trendHistory} />
        </ChartCard>

        <ChartCard
          title="Water Cooling Intensity Over Time"
          subtitle="Evaporative water footprint avoided by natural seawater conduction"
        >
          <WaterTrendChart data={trendHistory} />
        </ChartCard>

        <ChartCard
          title="Workload Location Distribution"
          subtitle="Proportion of jobs assigned to Subsea vs Land based on AI optimization"
        >
          <WorkloadDistributionChart
            underwaterCount={underwaterCount}
            landCount={landCount}
          />
        </ChartCard>

        <ChartCard
          title="Real-Time CPU Load Comparison"
          subtitle="Dynamic capacity balancing between both physical nodes"
        >
          <CpuComparisonChart
            underwaterCpu={underwaterDC.cpuUtilization}
            landCpu={landDC.cpuUtilization}
          />
        </ChartCard>
      </div>

      {/* Workload Status & Live Event Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ChartCard
            title="Workload Execution Status"
            subtitle="Job state distribution in state queue"
          >
            <WorkloadStatusChart workloads={workloads} />
          </ChartCard>
        </div>

        <div className="lg:col-span-2 bg-[#0B2942]/70 border border-[#153450] rounded-xl p-5 shadow-md flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight">
                Live Activity & Telemetry Feed
              </h3>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Real-time scheduling events, environmental changes, and optimization actions.
              </p>
            </div>
            <button
              onClick={() => onNavigate('alerts')}
              className="text-xs text-[#21D4D8] hover:underline flex items-center gap-1 font-medium"
            >
              <span>View All Alerts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[260px] pr-1">
            {alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-[#071827]/60 border border-[#153450] text-xs hover:border-[#21D4D8]/30 transition-colors"
              >
                <div className="mt-0.5">
                  {alert.severity === 'critical' ? (
                    <span className="w-2 h-2 rounded-full bg-red-400 block ring-4 ring-red-400/20" />
                  ) : alert.severity === 'warning' ? (
                    <span className="w-2 h-2 rounded-full bg-amber-400 block ring-4 ring-amber-400/20" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5 text-[#21D4D8]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-200 truncate">
                      {alert.title}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" />
                      {alert.timestamp}
                    </span>
                  </div>
                  <p className="text-slate-300 mt-0.5 line-clamp-2">{alert.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
