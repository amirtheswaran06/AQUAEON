import { DataCenterMetrics, SimulationSettings } from '../types';

/**
 * P_server = P_idle + (P_max - P_idle) * U_CPU
 * where U_CPU is 0.0 - 1.0
 */
export function calculateServerPowerWatts(
  idleWatts: number,
  maxWatts: number,
  cpuUtilizationPercent: number
): number {
  const uCpu = Math.max(0, Math.min(100, cpuUtilizationPercent)) / 100;
  return idleWatts + (maxWatts - idleWatts) * uCpu;
}

/**
 * Facility power = Server power * PUE
 */
export function calculateFacilityPowerWatts(
  serverPowerWatts: number,
  pue: number
): number {
  return serverPowerWatts * pue;
}

/**
 * Energy in kWh for a duration (in minutes)
 * E_kWh = (P_facility / 1000) * (duration_minutes / 60)
 */
export function calculateWorkloadEnergyKWh(
  facilityPowerWatts: number,
  durationMinutes: number
): number {
  const durationHours = durationMinutes / 60;
  return (facilityPowerWatts / 1000) * durationHours;
}

/**
 * Estimate additional energy consumption of running a specific workload on a data center
 */
export function estimateWorkloadExecutionEnergy(
  dc: DataCenterMetrics,
  workloadCpuPercent: number,
  durationMinutes: number,
  settings: SimulationSettings
): number {
  // Estimated CPU during execution
  const projectedCpu = Math.min(100, dc.cpuUtilization + workloadCpuPercent);
  
  // Power delta or total active workload slice:
  // For workload direct energy attribution: difference between facility power at projected CPU vs current CPU
  // OR the workload's direct fraction of facility power.
  // Using formula: E_kWh = (P_facility_workload / 1000) * duration_hours
  // Where P_server_workload = (P_max - P_idle) * (workloadCpu / 100) + (P_idle * workloadCpu / 100)
  // Which simplifies to: server power consumed by the workload's CPU slice.
  const pue = dc.name === 'Underwater' ? settings.underwaterPue : settings.landPue;
  const workloadServerWatts = calculateServerPowerWatts(
    settings.idleServerPowerWatts * (workloadCpuPercent / 100),
    settings.maxServerPowerWatts * (workloadCpuPercent / 100),
    100
  );
  const facilityPowerWatts = calculateFacilityPowerWatts(workloadServerWatts, pue);
  return calculateWorkloadEnergyKWh(facilityPowerWatts, durationMinutes);
}

/**
 * Calculate electricity cost
 */
export function calculateElectricityCost(
  energyKWh: number,
  pricePerKWh: number
): number {
  return energyKWh * pricePerKWh;
}
