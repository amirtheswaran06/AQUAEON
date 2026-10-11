import React, { useState } from 'react';
import {
  Zap,
  TrendingDown,
  DollarSign,
  Scale,
  Clock,
  Layers,
  BarChart3,
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { MetricCard } from '../components/shared/MetricCard';
import { ChartCard } from '../components/charts/DashboardCharts';
import { calculateBaselineComparison } from '../engine/baselineScheduler';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export const EnergyAnalytics: React.FC = () => {
  const { underwaterDC, landDC, workloads, settings } = useSimulation();
  const [timeRange, setTimeRange] = useState<'hour' | 'day' | 'week' | 'all'>('day');

  const comparison = calculateBaselineComparison(workloads, underwaterDC, landDC, settings);
  const costPerKWh = settings.electricityPricePerKWh;
  const costAquaeon = comparison.totalAquaeonEnergyKWh * costPerKWh;
  const costBaseline = comparison.totalBaselineEnergyKWh * costPerKWh;
  const costSaved = Math.max(0, costBaseline - costAquaeon);

  // Group energy by workload type
  const typeMap = workloads.reduce((acc: Record<string, number>, wl) => {
    const e = wl.estimatedEnergyKWh || 0;
    acc[wl.type] = (acc[wl.type] || 0) + e;
    return acc;
  }, {} as Record<string, number>);

  const energyByTypeData = Object.entries(typeMap).map(([name, energy]) => ({
    name: name.replace(' Processing', '').replace(' Computing', ''),
    energy: Number((energy as number).toFixed(3)),
  }));

  // Baseline vs Aquaeon comparison chart data
  const comparisonChartData = [
    {
      metric: 'Energy Consumed (kWh)',
      Baseline: Number(comparison.totalBaselineEnergyKWh.toFixed(2)),
      AQUAEON: Number(comparison.totalAquaeonEnergyKWh.toFixed(2)),
    },
    {
      metric: 'Operational Cost ($)',
      Baseline: Number(costBaseline.toFixed(2)),
      AQUAEON: Number(costAquaeon.toFixed(2)),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white m-0">
            Energy Analytics & Efficiency Engine
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Comparative energy modeling evaluating P_server = P_idle + (P_max - P_idle) × U_CPU against naive baseline distribution.
          </p>
        </div>

        {/* Time-Range Filters */}
        <div className="flex items-center bg-[#0B2942] rounded-lg p-1 border border-[#153450] text-xs">
          {(['hour', 'day', 'week', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                timeRange === range
                  ? 'bg-[#21D4D8] text-[#071827] shadow'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              {range === 'hour'
                ? 'Last 1h'
                : range === 'day'
                ? 'Last 24h'
                : range === 'week'
                ? 'Last 7d'
                : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="AQUAEON Total Energy"
          value={comparison.totalAquaeonEnergyKWh.toFixed(2)}
          unit="kWh"
          icon={Zap}
          trendText={`Current PUE: Underwater ${settings.underwaterPue} | Land ${settings.landPue}`}
          tooltip="Total facility energy consumed calculated from real active workloads."
          highlightColor="cyan"
        />

        <MetricCard
          title="Baseline Scenario Energy"
          value={comparison.totalBaselineEnergyKWh.toFixed(2)}
          unit="kWh"
          icon={Scale}
          trendText="Naive fixed-location scheduler"
          trendPositive={false}
          tooltip="Energy that would have been consumed if workloads ran without intelligent thermal distribution."
          highlightColor="amber"
        />

        <MetricCard
          title="Conserved Energy"
          value={comparison.energySavedKWh.toFixed(2)}
          unit="kWh"
          icon={TrendingDown}
          trendText={`${comparison.energySavingsPercent.toFixed(1)}% Reduction`}
          trendPositive={true}
          tooltip="Direct energy savings produced by dynamic scheduling and seawater thermal dissipation."
          highlightColor="teal"
        />

        <MetricCard
          title="Electricity Cost Savings"
          value={`$${costSaved.toFixed(2)}`}
          unit="USD"
          icon={DollarSign}
          trendText={`@ $${costPerKWh.toFixed(2)}/kWh tariff`}
          trendPositive={true}
          tooltip="Financial savings calculated against configured electricity tariff."
          highlightColor="emerald"
        />
      </div>

      {/* Core Comparative Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Scheduler Benchmark: Baseline vs AQUAEON"
          subtitle="Side-by-side verification of energy and operational expenditure"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={comparisonChartData} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#153450" />
              <XAxis dataKey="metric" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#071827', borderColor: '#153450', borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="Baseline" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="AQUAEON" fill="#21D4D8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Energy Consumption by Workload Type"
          subtitle="Distribution of power requirements across compute categories"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={energyByTypeData} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#153450" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} interval={0} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#071827', borderColor: '#153450', borderRadius: '8px', fontSize: '12px' }}
              />
              <Bar dataKey="energy" name="Energy (kWh)" fill="#14B8A6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Mathematical Principles Card */}
      <div className="bg-[#0B2942]/70 border border-[#153450] rounded-xl p-6 shadow-md text-xs">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#21D4D8]" />
          Mathematical Formulation & Energy Audit Equations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-300">
          <div className="p-3 rounded-lg bg-[#071827] border border-[#153450]">
            <p className="font-semibold text-[#21D4D8] mb-1">1. Server Power Draw</p>
            <code className="text-white bg-black/40 px-1 py-0.5 rounded text-[11px] block mb-2">
              P_server = P_idle + (P_max - P_idle) × U_CPU
            </code>
            <p className="text-[11px] text-slate-400">
              Where P_idle = {settings.idleServerPowerWatts}W, P_max = {settings.maxServerPowerWatts}W, and U_CPU is instantaneous processor load.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#071827] border border-[#153450]">
            <p className="font-semibold text-amber-400 mb-1">2. Facility Power with PUE</p>
            <code className="text-white bg-black/40 px-1 py-0.5 rounded text-[11px] block mb-2">
              P_facility = P_server × PUE
            </code>
            <p className="text-[11px] text-slate-400">
              Underwater node PUE = {settings.underwaterPue} (seawater sink). Land node PUE = {settings.landPue} (chillers).
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#071827] border border-[#153450]">
            <p className="font-semibold text-emerald-400 mb-1">3. Integrated Workload Energy</p>
            <code className="text-white bg-black/40 px-1 py-0.5 rounded text-[11px] block mb-2">
              E_kWh = (P_facility / 1000) × (t / 60)
            </code>
            <p className="text-[11px] text-slate-400">
              Integrated over scheduled execution duration t in minutes to compute precise energy footprint.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
