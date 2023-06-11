export function formatMin(min: number): string {
  return min < 60 ? `${min}min` : `${(min / 60).toFixed(1)}h`
}
