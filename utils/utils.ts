export function getRange(start: number, end: number): number[] {
  return Array(end - start + 1)
    .fill(0)
    .map((_, i) => i + start);
}
