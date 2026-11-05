// Iran has no daylight saving time, so Tehran is a fixed UTC+03:30.
export const TEHRAN_OFFSET_MIN = 210;
export const DAY_MS = 24 * 60 * 60_000;

/** "YYYY-MM-DD" (Gregorian, Tehran date) -> UTC instant of local midnight, or null. */
export function tehranDayStart(dateOnly: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateOnly);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const check = new Date(Date.UTC(y, mo - 1, d));
  if (check.getUTCMonth() !== mo - 1 || check.getUTCDate() !== d) return null;
  return new Date(Date.UTC(y, mo - 1, d) - TEHRAN_OFFSET_MIN * 60_000);
}

/** The Tehran calendar date ("YYYY-MM-DD") of a UTC instant. */
export function tehranDateOf(instant: Date): string {
  return new Date(instant.getTime() + TEHRAN_OFFSET_MIN * 60_000)
    .toISOString()
    .slice(0, 10);
}

/** Iranian weekday for a Tehran date: 0 = Saturday ... 6 = Friday. */
export function iranianWeekday(dateOnly: string): number | null {
  const start = tehranDayStart(dateOnly);
  if (!start) return null;
  const jsDay = new Date(
    start.getTime() + TEHRAN_OFFSET_MIN * 60_000,
  ).getUTCDay();
  return (jsDay + 1) % 7;
}

/** "HH:mm" -> minutes from local midnight, or null. */
export function parseHHmm(value: string): number | null {
  const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
}

/** minutes from local midnight -> "HH:mm". */
export function formatHHmm(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
