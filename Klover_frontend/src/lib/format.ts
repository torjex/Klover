/** Every backend timestamp and schedule is UTC, so the UI formats in UTC too. */

const utc = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", ...options });

const timeFmt = utc({ hour: "2-digit", minute: "2-digit", hour12: false });
const dayFmt = utc({ weekday: "short" });
const dateFmt = utc({ day: "numeric", month: "short" });
const fullFmt = utc({ day: "numeric", month: "short", year: "numeric" });

export const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
/** Backend day numbers ordered Monday-first for display. */
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

export function formatTimeUtc(value: string | Date): string {
  return timeFmt.format(new Date(value));
}

export function formatDateUtc(value: string | Date): string {
  return dateFmt.format(new Date(value));
}

export function formatFullDateUtc(value: string | Date): string {
  return fullFmt.format(new Date(value));
}

export function formatWeekdayUtc(value: string | Date): string {
  return dayFmt.format(new Date(value));
}

export function padTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

/** "Today, 06:40 UTC" / "Yesterday, 18:15 UTC" / "3 Sep, 18:15 UTC". */
export function formatWhenUtc(value: string | Date): string {
  const date = new Date(value);
  const dayKey = (d: Date) => d.toISOString().slice(0, 10);
  const now = new Date();
  const yesterday = new Date(now.getTime() - 86_400_000);
  const tomorrow = new Date(now.getTime() + 86_400_000);
  const prefix =
    dayKey(date) === dayKey(now)
      ? "Today"
      : dayKey(date) === dayKey(yesterday)
        ? "Yesterday"
        : dayKey(date) === dayKey(tomorrow)
          ? "Tomorrow"
          : dateFmt.format(date);
  return `${prefix}, ${timeFmt.format(date)} UTC`;
}

/** Compact variant of formatWhenUtc for tight metric slots: "Today, 06:30". */
export function formatWhenShortUtc(value: string | Date): string {
  return formatWhenUtc(value).replace(" UTC", "");
}

export function relativeDayUtc(value: string | Date): string {
  const date = new Date(value);
  const dayKey = (d: Date) => d.toISOString().slice(0, 10);
  const now = new Date();
  if (dayKey(date) === dayKey(now)) return "Today";
  if (dayKey(date) === dayKey(new Date(now.getTime() + 86_400_000))) return "Tomorrow";
  if (dayKey(date) === dayKey(new Date(now.getTime() - 86_400_000))) return "Yesterday";
  return dayFmt.format(date);
}

/** 600 -> "10 min", 90 -> "1 min 30 s", 45 -> "45 s". */
export function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  if (minutes === 0) return `${rest} s`;
  if (rest === 0) return `${minutes} min`;
  return `${minutes} min ${rest} s`;
}

/** Countdown clock: 452 -> "07:32". */
export function formatClock(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(total / 60);
  return `${String(minutes).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function formatLiters(liters: number): string {
  if (!Number.isFinite(liters)) return "0 L";
  if (liters >= 1000) return `${(liters / 1000).toFixed(liters >= 10_000 ? 0 : 1)} kL`;
  return `${Math.round(liters)} L`;
}

export function formatPercentChange(current: number, previous: number): { text: string; direction: "up" | "down" | "flat" } {
  if (previous <= 0)
    return current > 0 ? { text: "no comparison yet", direction: "flat" } : { text: "no usage yet", direction: "flat" };
  const change = ((current - previous) / previous) * 100;
  if (Math.abs(change) < 0.5) return { text: "level with yesterday", direction: "flat" };
  return {
    text: `${Math.abs(change) >= 100 ? Math.round(Math.abs(change)) : Math.abs(change).toFixed(0)}% vs yesterday`,
    direction: change > 0 ? "up" : "down",
  };
}

export function formatCoordinates(latitude: number, longitude: number): string {
  const lat = `${Math.abs(latitude).toFixed(2)}° ${latitude >= 0 ? "N" : "S"}`;
  const lon = `${Math.abs(longitude).toFixed(2)}° ${longitude >= 0 ? "E" : "W"}`;
  return `${lat}, ${lon}`;
}

export function describeDays(days: number[]): string {
  const set = new Set(days);
  if (set.size === 7) return "Every day";
  if (set.size === 5 && [1, 2, 3, 4, 5].every((d) => set.has(d))) return "Weekdays";
  if (set.size === 2 && set.has(0) && set.has(6)) return "Weekends";
  return WEEK_ORDER.filter((d) => set.has(d))
    .map((d) => DAY_LABELS[d])
    .join(", ");
}
