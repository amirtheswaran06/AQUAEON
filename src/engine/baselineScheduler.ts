import {
  DataCenterMetrics,
  LocationType,
  SimulationSettings,
  Workload,
} from '../types';
import { estimateWorkloadExecutionEnergy } from './energyCalculator';
import { calculateWaterUsageLiters } from './waterCalculator';

export interface BaselineComparisonResult {
  totalBaselineEnergyKWh: number;
  totalAquaeonEnergyKWh: number;
  energySavedKWh: number;
  energySavingsPercent: number;
  totalBaselineWaterLiters: number;
  totalAquaeonWaterLiters: number;
  waterSavedLiters: number;
  waterSavingsPercent: number;
  baselineRejectedCount: number;
  aquaeonRejectedCount: number;
}

/**
 * Baseline Scheduler: A naive static scheduler that simply places 70% of workloads on Land-Based
 * and 30% on Underwater without thermal or water efficiency awareness, or always defaults to Land-Based first.
 */
export function calculateBaselineComparison(
  workloads: Workload[],
  underwaterDC: DataCenterMetrics,
  landDC: DataCenterMetrics,
  settings: SimulationSettings
): BaselineComparisonResult {
  let baselineEnergy = 0;
  let baselineWater = 0;
  let aquaEnergy = 0;
  let aquaWater = 0;
  let baselineRejected = 0;
  let aquaRejected = 0;

  for (const wl of workloads) {
    if (wl.status === 'Rejected') {
      aquaRejected++;
    } else {
      const e = wl.estimatedEnergyKWh || 0;
      const w = wl.estimatedWaterLiters || 0;
      aquaEnergy += e;
      aquaWater += w;
    }

    // Baseline rule: default to Land-Based unless explicitly requested, ignoring water optimization
    const baselineLocation: LocationType = 'Land-Based';
    const baseE = estimateWorkloadExecutionEnergy(
      landDC,
      wl.cpuRequired,
      wl.durationMinutes,
      settings
    );
    const baseW = calculateWaterUsageLiters(baseE, baselineLocation, settings);

    if (wl.status !== 'Cancelled') {
      baselineEnergy += baseE;
      baselineWater += baseW;
    }
  }

  const energySaved = Math.max(0, baselineEnergy - aquaEnergy);
  const energyPercent = baselineEnergy > 0 ? (energySaved / baselineEnergy) * 100 : 0;

  const waterSaved = Math.max(0, baselineWater - aquaWater);
  const waterPercent = baselineWater > 0 ? (waterSaved / baselineWater) * 100 : 0;

  return {
    totalBaselineEnergyKWh: baselineEnergy,
    totalAquaeonEnergyKWh: aquaEnergy,
    energySavedKWh: energySaved,
    energySavingsPercent: energyPercent,
    totalBaselineWaterLiters: baselineWater,
    totalAquaeonWaterLiters: aquaWater,
    waterSavedLiters: waterSaved,
    waterSavingsPercent: waterPercent,
    baselineRejectedCount: baselineRejected,
    aquaeonRejectedCount: aquaRejected,
  };
}
