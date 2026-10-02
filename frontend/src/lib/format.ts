export function formatINR(n: number): string {
  if (!isFinite(n)) return "₹0";
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export function formatINRCompact(n: number): string {
  if (!isFinite(n)) return "₹0";
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  return formatINR(n);
}

export function formatNum(n: number): string {
  return Math.round(n).toLocaleString("en-IN");
}
