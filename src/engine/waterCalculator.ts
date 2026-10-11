import { LocationType, SimulationSettings } from '../types';

/**
 * Water usage calculation:
 * Estimated water usage = facility energy (kWh) * configured water factor (liters/kWh)
 */
export function calculateWaterUsageLiters(
  facilityEnergyKWh: number,
  location: LocationType,
  settings: SimulationSettings
): number {
  const factor = location === 'Underwater' ? settings.underwaterWaterFactor : settings.landWaterFactor;
  return facilityEnergyKWh * factor;
}

/**
 * Calculate water saved compared with alternative location
 */
export function calculateWaterDifference(
  chosenEnergyKWh: number,
  chosenLocation: LocationType,
  alternativeEnergyKWh: number,
  alternativeLocation: LocationType,
  settings: SimulationSettings
): {
  waterChosen: number;
  waterAlternative: number;
  waterSaved: number;
  savingsPercentage: number;
} {
  const waterChosen = calculateWaterUsageLiters(chosenEnergyKWh, chosenLocation, settings);
  const waterAlternative = calculateWaterUsageLiters(alternativeEnergyKWh, alternativeLocation, settings);
  const waterSaved = Math.max(0, waterAlternative - waterChosen);
  const savingsPercentage = waterAlternative > 0 ? (waterSaved / waterAlternative) * 100 : 0;

  return {
    waterChosen,
    waterAlternative,
    waterSaved,
    savingsPercentage,
  };
}
