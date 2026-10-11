import React from 'react';
import {
  Droplets,
  ShieldCheck,
  TrendingDown,
  Info,
  Waves,
  Building2,
  HelpCircle,
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { MetricCard } from '../components/shared/MetricCard';
import { ChartCard, WaterTrendChart } from '../components/charts/DashboardCharts';
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

export const WaterSustainability: React.FC = () => {
  const { underwaterDC, landDC, workloads, trendHistory, settings } = useSimulation();

  const comparison = calculateBaselineComparison(workloads, underwaterDC, landDC, settings);
  const totalWaterSaved = comparison.waterSavedLiters;
  const waterSavedPercent = comparison.waterSavingsPercent;

  // Water footprint comparison data
  const comparisonData = [
    {
      category: 'Simulated Water Footprint (Liters)',
      Baseline: Number(comparison.totalBaselineWaterLiters.toFixed(2)),
      AQUAEON: Number(comparison.totalAquaeonWaterLiters.toFixed(2)),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white m-0">
          Water Sustainability & Conservation Engine
        </h1>
        <p className="text-sm text-[#94A3B8] mt-1">
          Quantifying avoided evaporative cooling tower freshwater loss by offloading compute to ocean-convective pods.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Water Conserved"
          value={totalWaterSaved.toFixed(1)}
          unit="Liters"
          icon={Droplets}
          trendText={`${waterSavedPercent.toFixed(1)}% Avoided`}
          trendPositive={true}
          tooltip="Freshwater evaporative dissipation avoided compared to land-based cooling towers."
          highlightColor="cyan"
        />

        <MetricCard
          title="Simulated Water Consumed"
          value={comparison.totalAquaeonWaterLiters.toFixed(1)}
          unit="Liters"
          icon={Waves}
          trendText={`Model estimate`}
          tooltip="Estimated cooling water consumption across hybrid operations."
          highlightColor="teal"
        />

        <MetricCard
          title="Baseline Water Requirement"
          value={comparison.totalBaselineWaterLiters.toFixed(1)}
          unit="Liters"
          icon={Building2}
          trendText="Standard land-only operation"
          trendPositive={false}
          tooltip="Projected water requirement if all workloads had run on conventional cooling towers."
          highlightColor="amber"
        />

        <MetricCard
          title="Subsea Water Intensity"
          value={settings.underwaterWaterFactor.toString()}
          unit="L / kWh"
          icon={ShieldCheck}
          trendText="95.8% lower than Land"
          trendPositive={true}
          tooltip="Configured model factor representing minimal closed-loop auxiliary requirement."
          highlightColor="emerald"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Water Consumption Comparison: Baseline vs Optimized"
          subtitle="Model audit demonstrating avoided freshwater consumption"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={comparisonData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#153450" />
              <XAxis dataKey="category" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#071827', borderColor: '#153450', borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="Baseline" fill="#EF4444" name="Baseline (L)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="AQUAEON" fill="#21D4D8" name="AQUAEON (L)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Water Consumption Over Time"
          subtitle="Real-time water demand curve across simulation steps"
        >
          <WaterTrendChart data={trendHistory} />
        </ChartCard>
      </div>

      {/* Educational & Scientific Disclaimer Panel */}
      <div className="bg-[#0B2942]/70 border border-[#153450] rounded-xl p-6 shadow-md text-xs space-y-3">
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <Info className="w-4 h-4 text-[#21D4D8]" />
          Model Estimation & Environmental Assumptions
        </div>

        <p className="text-slate-300 leading-relaxed">
          Water consumption values are calculated using parametric prototype simulation factors (<strong>{settings.underwaterWaterFactor} L/kWh</strong> for underwater pods vs <strong>{settings.landWaterFactor} L/kWh</strong> for land-based evaporative chiller towers). These figures illustrate comparative thermodynamic advantages rather than empirical laboratory measurements.
        </p>

        <div className="p-3 rounded-lg bg-[#071827] border border-[#153450] text-slate-400">
          <strong className="text-white block mb-1">Notice on Seawater Direct Heat Exchange:</strong>
          Seawater cooling utilizes closed-loop conduction plates submerged in marine thermoclines. While the closed loop does not consume potable municipal water, external factors such as local seawater temperature, biological fouling, and electricity grid generation fuel-mix influence comprehensive lifecycle water footprints.
        </div>
      </div>
    </div>
  );
};
