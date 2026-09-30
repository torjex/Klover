/** Response shapes returned by the Klover test backend (single zone, MQTT/ESP32). */

/** Returned by POST /login. The frontend stores this key and sends it back as x-api-key. */
export interface LoginResponse {
  apiKey: string;
}

/** Returned by GET /water/status. */
export interface WaterStatus {
  watering: boolean;
  remainingSeconds: number;
}

/** Returned by POST /water/now. */
export interface WaterNowResult {
  zone: string;
  durationSeconds: number;
  litersUsed: number;
  startedAt: string;
}

/** Returned by POST /water/stop. */
export interface WaterStopResult {
  zone: string;
  status: string;
}

export type Period = "today" | "week" | "month" | "all";

/** Returned by GET /consumption. */
export interface Consumption {
  period: Period;
  totalLiters: number;
  eventCount: number;
}

/** One row of GET /consumption/by-zone. */
export interface ZoneConsumption {
  zone: string;
  totalLiters: number;
  eventCount: number;
}

/** One row of GET /history. */
export interface HistoryEvent {
  id: number;
  zone: string;
  started_at: string;
  duration_seconds: number;
  liters_used: number;
}

/** Returned by GET /weather/rain-chance. */
export interface RainChance {
  date: string;
  /** Open-Meteo returns null when it has no probability for the location. */
  rainChancePercent: number | null;
  expectedMm: number | null;
}

/** Returned by GET /weather/current. */
export interface CurrentConditions {
  temperatureC: number | null;
  isRainingNow: boolean;
}

/** A stored schedule row, as returned by GET /schedule. */
/** Returned by GET /sensors. Fields are null until the ESP32 has reported at least once. */
export interface SensorReading {
  distance_cm: number | null;
  soil_humidity_pct: number | null;
  air_temp_c: number | null;
  air_humidity_pct: number | null;
  /** Added by the backend, not the ESP32: when this reading was received. */
  receivedAt: string;
}

export interface Schedule {
  id: number;
  zone: string;
  hour: number;
  minute: number;
  duration_seconds: number;
  days_of_week: string;
  enabled: boolean;
}

export interface SchedulePayload {
  zone?: string;
  hour: number;
  minute: number;
  durationSeconds: number;
  daysOfWeek?: string;
  enabled?: boolean;
}
