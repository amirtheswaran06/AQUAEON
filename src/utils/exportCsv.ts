import { Workload } from '../types';

export function exportWorkloadsToCsv(workloads: Workload[]): void {
  const headers = [
    'Workload ID',
    'Workload Name',
    'Type',
    'CPU Required (%)',
    'Duration (min)',
    'Priority',
    'Preferred Location',
    'Assigned Location',
    'Estimated Energy (kWh)',
    'Estimated Water (Liters)',
    'Energy Saved (kWh)',
    'Water Saved (Liters)',
    'Status',
    'Submitted At',
    'Reason / Notes'
  ];

  const rows = workloads.map(w => [
    `"${w.id}"`,
    `"${w.name.replace(/"/g, '""')}"`,
    `"${w.type}"`,
    w.cpuRequired,
    w.durationMinutes,
    `"${w.priority}"`,
    `"${w.preferredLocation}"`,
    `"${w.assignedLocation || 'None'}"`,
    (w.estimatedEnergyKWh || 0).toFixed(4),
    (w.estimatedWaterLiters || 0).toFixed(4),
    (w.energySavedKWh || 0).toFixed(4),
    (w.waterSavedLiters || 0).toFixed(4),
    `"${w.status}"`,
    `"${w.submittedAt}"`,
    `"${(w.scheduledReason || w.rejectionReason || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `aquaeon_workload_report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportSustainabilitySummaryCsv(summaryData: {
  totalWorkloads: number;
  totalEnergyKWh: number;
  totalEnergySavedKWh: number;
  totalWaterSavedLiters: number;
  avgCpuUtilization: number;
  underwaterCount: number;
  landCount: number;
  electricityCostSavedUSD: number;
}): void {
  const lines = [
    'AQUAEON - Executive Sustainability & Energy Optimization Report',
    `Generated: ${new Date().toISOString()}`,
    'Environment: Simulated Hybrid Underwater / Land Infrastructure',
    '',
    'Metric,Value,Unit',
    `Total Workloads Processed,${summaryData.totalWorkloads},units`,
    `Total Facility Energy Consumed,${summaryData.totalEnergyKWh.toFixed(3)},kWh`,
    `Estimated Energy Saved vs Baseline,${summaryData.totalEnergySavedKWh.toFixed(3)},kWh`,
    `Estimated Cooling Water Avoided,${summaryData.totalWaterSavedLiters.toFixed(2)},Liters`,
    `Average Infrastructure CPU Utilization,${summaryData.avgCpuUtilization.toFixed(1)},%`,
    `Underwater Workload Count,${summaryData.underwaterCount},workloads`,
    `Land-Based Workload Count,${summaryData.landCount},workloads`,
    `Estimated Cost Savings,${summaryData.electricityCostSavedUSD.toFixed(2)},USD`
  ];

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `aquaeon_sustainability_summary_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
