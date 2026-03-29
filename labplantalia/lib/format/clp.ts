export function formatClp(amount: number): string {
  return `$${amount.toLocaleString("es-CL")}`;
}
