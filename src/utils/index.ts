export function getOption(index: number) {
  return `opt_${index + 1}` as number|string;
}

export function* range(start: number, end?: number) {
  if (end == undefined) {
    end = start;
    start = 1;
  }
  for (; start <= end; start++) {
    yield start;
  }
}

export function omit(key: string, obj: Record<string, any>) {
  const { [key]: omitted, ...rest } = obj;
  return rest;
}

export const formatter =
  (total: number=0, prefix: string) =>
  (variant: number, showPrefix = true) =>
    ((variant / total) * 100).toFixed(2) + (showPrefix ? prefix : 0);
