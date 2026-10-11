import {
  DataCenterMetrics,
  LocationType,
  SchedulingDecision,
  SimulationSettings,
  Workload,
} from '../types';
import { estimateWorkloadExecutionEnergy } from './energyCalculator';
import { calculateWaterUsageLiters } from './waterCalculator';

export function evaluateAndScheduleWorkload(
  workload: Omit<Workload, 'id' | 'status' | 'submittedAt'>,
  underwaterDC: DataCenterMetrics,
  landDC: DataCenterMetrics,
  settings: SimulationSettings
): SchedulingDecision {
  const reqCpu = workload.cpuRequired;

  // 1. Calculate projected CPU
  const projUnderwaterCpu = underwaterDC.cpuUtilization + reqCpu;
  const projLandCpu = landDC.cpuUtilization + reqCpu;

  // 2. Safety & Capacity Checks
  const underwaterCapacityOk = projUnderwaterCpu <= settings.underwaterSafeCpuLimit;
  const underwaterTempOk = underwaterDC.temperature < settings.underwaterTempWarningLimit;
  const underwaterEligible = underwaterCapacityOk && underwaterTempOk;

  const landCapacityOk = projLandCpu <= settings.landSafeCpuLimit;
  const landTempOk = landDC.temperature < settings.landTempWarningLimit;
  const landEligible = landCapacityOk && landTempOk;

  // 3. Energy and Water estimations for eligible candidates
  const energyUnderwater = estimateWorkloadExecutionEnergy(
    underwaterDC,
    reqCpu,
    workload.durationMinutes,
    settings
  );
  const energyLand = estimateWorkloadExecutionEnergy(
    landDC,
    reqCpu,
    workload.durationMinutes,
    settings
  );

  const waterUnderwater = calculateWaterUsageLiters(energyUnderwater, 'Underwater', settings);
  const waterLand = calculateWaterUsageLiters(energyLand, 'Land-Based', settings);

  // Rejection check if neither is eligible
  if (!underwaterEligible && !landEligible) {
    let reason = 'Workload rejected: insufficient capacity or thermal headroom across all data centers.';
    if (projUnderwaterCpu > settings.underwaterSafeCpuLimit && projLandCpu > settings.landSafeCpuLimit) {
      reason = `Both data centers would breach safe CPU limits (Underwater projected: ${projUnderwaterCpu.toFixed(1)}% / Max ${settings.underwaterSafeCpuLimit}%, Land projected: ${projLandCpu.toFixed(1)}% / Max ${settings.landSafeCpuLimit}%).`;
    } else if (!underwaterTempOk || !landTempOk) {
      reason = 'Data center thermal limits exceeded. Workload rejected to prevent hardware throttling.';
    }

    return {
      isEligible: false,
      underwaterEligible: false,
      landEligible: false,
      cpuBeforeUnderwater: underwaterDC.cpuUtilization,
      cpuAfterUnderwater: underwaterDC.cpuUtilization,
      cpuBeforeLand: landDC.cpuUtilization,
      cpuAfterLand: landDC.cpuUtilization,
      selectionReason: '',
      rejectionReason: reason,
    };
  }

  // Handle explicit preferences if requested and eligible
  let selectedLocation: LocationType;
  let alternativeLocation: LocationType | undefined;

  if (workload.preferredLocation === 'Underwater' && underwaterEligible) {
    selectedLocation = 'Underwater';
    alternativeLocation = landEligible ? 'Land-Based' : undefined;
  } else if (workload.preferredLocation === 'Land-Based' && landEligible) {
    selectedLocation = 'Land-Based';
    alternativeLocation = underwaterEligible ? 'Underwater' : undefined;
  } else if (underwaterEligible && !landEligible) {
    selectedLocation = 'Underwater';
    alternativeLocation = undefined;
  } else if (!underwaterEligible && landEligible) {
    selectedLocation = 'Land-Based';
    alternativeLocation = undefined;
  } else {
    // Both are eligible! Apply rule-based multi-criteria scoring
    // Criteria: Energy savings (PUE difference), Water footprint, Available CPU headroom
    const energySavingsUnderwater = energyLand - energyUnderwater;
    const waterSavingsUnderwater = waterLand - waterUnderwater;

    // Normalizing criteria based on preference
    if (settings.autoSchedulingPreference === 'MaxWaterSavings') {
      selectedLocation = waterSavingsUnderwater >= 0 ? 'Underwater' : 'Land-Based';
    } else if (settings.autoSchedulingPreference === 'MaxEnergySavings') {
      selectedLocation = energySavingsUnderwater >= 0 ? 'Underwater' : 'Land-Based';
    } else {
      // Balanced: default favors underwater for compute-intensive workloads due to 1.07 PUE & water conservation
      // But considers load balancing if underwater is significantly more loaded than land
      if (projUnderwaterCpu > 75 && landDC.cpuUtilization < 40) {
        selectedLocation = 'Land-Based';
      } else {
        selectedLocation = energySavingsUnderwater >= 0 ? 'Underwater' : 'Land-Based';
      }
    }
    alternativeLocation = selectedLocation === 'Underwater' ? 'Land-Based' : 'Underwater';
  }

  // Compute energy & water differential compared to alternative if exists
  const selectedEnergy = selectedLocation === 'Underwater' ? energyUnderwater : energyLand;
  const altEnergy = alternativeLocation === 'Land-Based' ? energyLand : energyUnderwater;
  const energyDiff = alternativeLocation ? altEnergy - selectedEnergy : 0;

  const selectedWater = selectedLocation === 'Underwater' ? waterUnderwater : waterLand;
  const altWater = alternativeLocation === 'Land-Based' ? waterLand : waterUnderwater;
  const waterDiff = alternativeLocation ? altWater - selectedWater : 0;

  // Build verifiable transparent explanation
  let explanation = '';
  if (selectedLocation === 'Underwater') {
    explanation = `AQUAEON scheduled to Underwater Data Center: Safe CPU headroom available (${projUnderwaterCpu.toFixed(1)}% ≤ ${settings.underwaterSafeCpuLimit}%), PUE ${settings.underwaterPue.toFixed(2)} vs ${settings.landPue.toFixed(2)}. Saves ~${Math.max(0, energyDiff).toFixed(3)} kWh energy and ~${Math.max(0, waterDiff).toFixed(2)} L water cooling footprint compared to land-based.`;
  } else {
    explanation = `AQUAEON scheduled to Land-Based Data Center: `;
    if (!underwaterEligible) {
      explanation += `Underwater facility unavailable or near safety thresholds (${underwaterDC.cpuUtilization.toFixed(1)}% CPU, ${underwaterDC.temperature.toFixed(1)}°C). Assigned to Land-Based with safe projected CPU (${projLandCpu.toFixed(1)}%).`;
    } else {
      explanation += `Selected based on capacity balance and operational constraints. Projected CPU: ${projLandCpu.toFixed(1)}%.`;
    }
  }

  return {
    isEligible: true,
    selectedLocation,
    alternativeLocation,
    underwaterEligible,
    landEligible,
    estimatedEnergyUnderwater: energyUnderwater,
    estimatedEnergyLand: energyLand,
    estimatedWaterUnderwater: waterUnderwater,
    estimatedWaterLand: waterLand,
    cpuBeforeUnderwater: underwaterDC.cpuUtilization,
    cpuAfterUnderwater: selectedLocation === 'Underwater' ? projUnderwaterCpu : underwaterDC.cpuUtilization,
    cpuBeforeLand: landDC.cpuUtilization,
    cpuAfterLand: selectedLocation === 'Land-Based' ? projLandCpu : landDC.cpuUtilization,
    energyDiffKWh: energyDiff,
    waterDiffLiters: waterDiff,
    selectionReason: explanation,
  };
}
