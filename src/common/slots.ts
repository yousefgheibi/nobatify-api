import { tehranDayStart } from "./date-helper.js";

export interface Hours {
  isOpen: boolean;
  opensMin: number; // minutes from Tehran midnight
  closesMin: number;
}

/**
 * UTC start times of every free slot on a Tehran date (30-minute steps).
 * Pure: no database, so it is unit tested directly.
 */
export function freeSlots(opts: {
  dateOnly: string;
  hours: Hours | undefined;
  durationMin: number;
  busy: { startsAt: Date; endsAt: Date }[];
  now: Date;
}): Date[] {
  const { hours, durationMin, busy, now } = opts;
  const dayStart = tehranDayStart(opts.dateOnly);
  if (!dayStart || !hours || !hours.isOpen || durationMin <= 0) return [];

  const slots: Date[] = [];
  for (let t = hours.opensMin; t + durationMin <= hours.closesMin; t += 30) {
    const start = dayStart.getTime() + t * 60_000;
    const end = start + durationMin * 60_000;
    if (start <= now.getTime()) continue;
    const taken = busy.some(
      (b) => start < b.endsAt.getTime() && end > b.startsAt.getTime(),
    );
    if (!taken) slots.push(new Date(start));
  }
  return slots;
}
