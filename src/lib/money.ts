export function formatUsd(amount: number, digits = 0): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatUsdFlexible(amount: number): string {
  const digits = Number.isInteger(amount) ? 0 : 2;
  return formatUsd(amount, digits);
}

export function formatPoints(amount: number): string {
  return new Intl.NumberFormat("en-US").format(amount);
}

export function assertNever(value: never): never {
  throw new Error(`Unhandled union member: ${String(value)}`);
}
