export function formatDateFromSeconds(timestampInSeconds: number): string {
  const date = new Date(timestampInSeconds); // convert to milliseconds
  const month = String(date.getMonth() + 1).padStart(2, '0'); // JS months: 0–11
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}