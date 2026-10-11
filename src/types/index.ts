export type LocationType = 'Underwater' | 'Land-Based';
export type WorkloadLocationPreference = 'Automatic' | 'Underwater' | 'Land-Based';

export type WorkloadType =
  | 'Video Processing'
  | 'AI Model Inference'
  | 'Data Analytics'
  | 'Scientific Computing'
  | 'File Processing'
  | 'Batch Processing'
  | 'General Computing';

export type WorkloadPriority = 'Low' | 'Normal' | 'High' | 'Critical';

export type WorkloadStatus = 'Pending' | 'Running' | 'Completed' | 'Rejected' | 'Cancelled';

export interface Workload {
  id: string;
  name: string;
  type: WorkloadType;
  cpuRequired: number; // e.g. 20 (%)
  durationMinutes: number;
  priority: WorkloadPriority;
  memoryGB: number;
  preferredLocation: WorkloadLocationPreference;
  assignedLocation?: LocationType;
  estimatedEnergyKWh?: number;
  estimatedWaterLiters?: number;
  energySavedKWh?: number;
  waterSavedLiters?: number;
  status: WorkloadStatus;
  submittedAt: string; // ISO string
  startedAt?: string;
  completedAt?: string;
  scheduledReason?: string;
  rejectionReason?: string;
}

export interface DataCenterMetrics {
  id: string;
  name: LocationType;
  cpuUtilization: number; // percentage 0-100
  temperature: number; // Celsius
  maxServerPowerWatts: number; // e.g. 300 W
  idleServerPowerWatts: number; // e.g. 100 W
  pue: number; // e.g. 1.07 for underwater, 1.35 for land
  safeCpuLimit: number; // percentage, e.g. 85% or 80%
  tempWarningLimit: number; // Celsius, e.g. 35C or 40C
  coolingMethod: string;
  waterFactor: number; // liters per kWh (simulated)
  currentPowerWatts: number; // computed facility power
  workloadCount: number;
  activeWorkloadIds: string[];
}

export interface SimulationSettings {
  underwaterPue: number;
  landPue: number;
  idleServerPowerWatts: number;
  maxServerPowerWatts: number;
  underwaterSafeCpuLimit: number;
  landSafeCpuLimit: number;
  underwaterTempWarningLimit: number;
  landTempWarningLimit: number;
  underwaterWaterFactor: number; // L / kWh
  landWaterFactor: number; // L / kWh
  electricityPricePerKWh: number; // USD / kWh
  simulationSpeedMultiplier: number; // 1x, 2x, 5x, 10x
  autoSchedulingPreference: 'Balanced' | 'MaxEnergySavings' | 'MaxWaterSavings';
}

export interface SchedulingDecision {
  isEligible: boolean;
  selectedLocation?: LocationType;
  alternativeLocation?: LocationType;
  underwaterEligible: boolean;
  landEligible: boolean;
  estimatedEnergyUnderwater?: number;
  estimatedEnergyLand?: number;
  estimatedWaterUnderwater?: number;
  estimatedWaterLand?: number;
  cpuBeforeUnderwater: number;
  cpuAfterUnderwater: number;
  cpuBeforeLand: number;
  cpuAfterLand: number;
  energyDiffKWh?: number;
  waterDiffLiters?: number;
  selectionReason: string;
  rejectionReason?: string;
}

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface TelemetryAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  affectedTarget: LocationType | 'System' | string;
  timestamp: string;
  status: 'active' | 'resolved';
}

export interface HourlyTrendPoint {
  time: string;
  energyUnderwater: number;
  energyLand: number;
  baselineEnergy: number;
  waterUnderwater: number;
  waterLand: number;
  baselineWater: number;
  cpuUnderwater: number;
  cpuLand: number;
}
