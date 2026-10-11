export function formatEnergy(kWh: number): string {
  if (kWh < 1) {
    return `${(kWh * 1000).toFixed(0)} Wh`;
  }
  return `${kWh.toFixed(2)} kWh`;
}

export function formatWater(liters: number): string {
  if (liters < 1) {
    return `${(liters * 1000).toFixed(0)} mL`;
  }
  return `${liters.toFixed(2)} L`;
}

export function formatCurrency(usd: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(usd);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
