export function normalizeOneToNine(value: number): number {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`normalizeOneToNine expects a positive integer, got ${value}`);
  }

  return ((value - 1) % 9) + 1;
}

export function normalizeZeroToNine(value: number): number {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`normalizeZeroToNine expects a non-negative integer, got ${value}`);
  }

  if (value === 0) {
    return 0;
  }

  return normalizeOneToNine(value);
}

export function normalizeClosedTwentyTwo(value: number): number {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`normalizeClosedTwentyTwo expects a non-negative integer, got ${value}`);
  }

  const normalized = value % 22;
  return normalized === 0 ? 22 : normalized;
}

export function buildQuersumRow(values: number[]): number[] {
  if (values.length < 2) {
    return [];
  }

  const next: number[] = [];
  for (let index = 0; index < values.length - 1; index += 1) {
    next.push(normalizeZeroToNine(values[index] + values[index + 1]));
  }

  return next;
}

export function buildQuersumTriangle(values: number[]): number[][] {
  if (values.length === 0) {
    throw new Error("buildQuersumTriangle expects a non-empty array");
  }

  const triangle: number[][] = [values.slice()];
  while (triangle[triangle.length - 1].length > 1) {
    triangle.push(buildQuersumRow(triangle[triangle.length - 1]));
  }

  return triangle;
}
