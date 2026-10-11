import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { HourlyTrendPoint, Workload } from '../../types';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, children }) => (
  <div className="bg-[#0B2942]/70 border border-[#153450] rounded-xl p-5 shadow-md flex flex-col">
    <div className="mb-4">
      <h3 className="text-base font-semibold text-white tracking-tight">{title}</h3>
      {subtitle && <p className="text-xs text-[#94A3B8] mt-0.5">{subtitle}</p>}
    </div>
    <div className="flex-1 min-h-[260px] w-full">{children}</div>
  </div>
);

// 1. Energy Consumption Over Time
export const EnergyTrendChart: React.FC<{ data: HourlyTrendPoint[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="energyUnderwater" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#21D4D8" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#21D4D8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="energyLand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#153450" />
        <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
        <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
        <Tooltip
          contentStyle={{ backgroundColor: '#071827', borderColor: '#153450', borderRadius: '8px', fontSize: '12px' }}
        />
        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
        <Area
          type="monotone"
          dataKey="energyUnderwater"
          name="Underwater (kWh)"
          stroke="#21D4D8"
          fillOpacity={1}
          fill="url(#energyUnderwater)"
        />
        <Area
          type="monotone"
          dataKey="energyLand"
          name="Land-Based (kWh)"
          stroke="#F59E0B"
          fillOpacity={1}
          fill="url(#energyLand)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// 2. Water Consumption Over Time
export const WaterTrendChart: React.FC<{ data: HourlyTrendPoint[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#153450" />
        <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
        <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
        <Tooltip
          contentStyle={{ backgroundColor: '#071827', borderColor: '#153450', borderRadius: '8px', fontSize: '12px' }}
        />
        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
        <Line
          type="monotone"
          dataKey="waterLand"
          name="Land-Based Water (L)"
          stroke="#EF4444"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="waterUnderwater"
          name="Underwater Water (L)"
          stroke="#14B8A6"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

// 3. Workload Location Distribution Pie
export const WorkloadDistributionChart: React.FC<{
  underwaterCount: number;
  landCount: number;
}> = ({ underwaterCount, landCount }) => {
  const data = [
    { name: 'Underwater DC', value: underwaterCount, color: '#21D4D8' },
    { name: 'Land-Based DC', value: landCount, color: '#F59E0B' },
  ];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={85}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} stroke="#071827" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ backgroundColor: '#071827', borderColor: '#153450', borderRadius: '8px', fontSize: '12px' }}
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

// 4. CPU Utilization Comparison Bar
export const CpuComparisonChart: React.FC<{
  underwaterCpu: number;
  landCpu: number;
}> = ({ underwaterCpu, landCpu }) => {
  const data = [
    { name: 'Underwater DC', CPU: underwaterCpu, fill: '#21D4D8' },
    { name: 'Land-Based DC', CPU: landCpu, fill: '#14B8A6' },
  ];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#153450" />
        <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
        <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 100]} tickLine={false} />
        <Tooltip
          contentStyle={{ backgroundColor: '#071827', borderColor: '#153450', borderRadius: '8px', fontSize: '12px' }}
        />
        <Bar dataKey="CPU" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

// 5. Workload Processing Status
export const WorkloadStatusChart: React.FC<{ workloads: Workload[] }> = ({ workloads }) => {
  const statusCounts = workloads.reduce(
    (acc, w) => {
      acc[w.status] = (acc[w.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const data = [
    { status: 'Running', count: statusCounts['Running'] || 0, fill: '#21D4D8' },
    { status: 'Completed', count: statusCounts['Completed'] || 0, fill: '#10B981' },
    { status: 'Pending', count: statusCounts['Pending'] || 0, fill: '#F59E0B' },
    { status: 'Rejected', count: statusCounts['Rejected'] || 0, fill: '#EF4444' },
  ];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 15, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#153450" />
        <XAxis type="number" stroke="#94A3B8" fontSize={11} />
        <YAxis dataKey="status" type="category" stroke="#94A3B8" fontSize={11} />
        <Tooltip
          contentStyle={{ backgroundColor: '#071827', borderColor: '#153450', borderRadius: '8px', fontSize: '12px' }}
        />
        <Bar dataKey="count" name="Workloads" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={`bar-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
