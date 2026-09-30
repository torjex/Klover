import { useMemo } from "react";
import { api, num } from "../api/client";
import { useAsync } from "../hooks/useAsync";
import { PageHead } from "../components/layout/AppShell";
import { Alert, Badge, Card, EmptyState, Icon, Segmented, Skeleton } from "../components/ui";
import { SERIES_COLORS, UsageChart } from "../components/UsageChart";
import type { Bucket, Series } from "../components/UsageChart";
import {
  formatDuration,
  formatLiters,
  formatPercentChange,
  formatWhenUtc,
} from "../lib/format";
import type { Consumption, Period, Run } from "../api/types";
import { useSearchParams } from "react-router-dom";
import "./ActivityPage.css";

const PERIODS: { value: Period; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

export function ActivityPage() {
  const [params, setParams] = useSearchParams();
  const period = (PERIODS.find((p) => p.value === params.get("period"))?.value ?? "today") as Period;

  const consumption = useAsync(() => api.consumption(period), [period], { intervalMs: 60_000 });
  const daily = useAsync(() => api.dailyConsumption("week"), []);
  const runs = useAsync(() => loadRuns(period), [period], { intervalMs: 60_000 });

  const { buckets, series } = useMemo(
    () => buildChart(period, runs.data ?? [], consumption.data ?? null),
    [period, runs.data, consumption.data],
  );

  const total = consumption.data?.totalLiters ?? 0;
  const days = daily.data?.days ?? [];
  const yesterday = days.length >= 2 ? days[days.length - 2].liters : 0;
  const trend = formatPercentChange(total, yesterday);

  return (
    <>
      <PageHead title="Water & activity" subtitle="Estimated from each zone's configured flow rate." />

      {consumption.error ? <Alert tone="error">{consumption.error}</Alert> : null}

      <Card>
        <div className="activity__top">
          <div>
            <h2 style={{ fontSize: 18 }}>Estimated water use</h2>
            <div style={{ marginTop: 14 }}>
              <Segmented
                ariaLabel="Reporting period"
                value={period}
                options={PERIODS}
                onChange={(next) => setParams(next === "today" ? {} : { period: next })}
              />
            </div>
            {consumption.initial ? (
              <div style={{ marginTop: 24 }}>
                <Skeleton height={38} width="60%" />
                <div style={{ height: 10 }} />
                <Skeleton height={12} width="80%" />
              </div>
            ) : (
              <>
                <div className="activity__total">{formatLiters(total)}</div>
                <div className="activity__total-label">
                  Total estimated use · {period === "today" ? "today" : period === "week" ? "last 7 days" : "last 30 days"}
                </div>
                {period === "today" ? (
                  <div
                    className="activity__trend"
                    style={{
                      color:
                        trend.direction === "up"
                          ? "var(--green-600)"
                          : trend.direction === "down"
                            ? "var(--warn)"
                            : "var(--muted)",
                    }}
                  >
                    {trend.direction !== "flat" ? (
                      <Icon name={trend.direction === "up" ? "trend-up" : "trend-down"} size={14} />
                    ) : null}
                    {trend.text}
                  </div>
                ) : null}
              </>
            )}
          </div>

          <div>
            {runs.initial ? (
              <Skeleton height={190} />
            ) : (
              <UsageChart buckets={buckets} series={series} totalLiters={total} />
            )}
          </div>
        </div>
      </Card>

      <h2 className="section-title">Activity log</h2>

      <Card>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Time (UTC)</th>
                <th>Zone</th>
                <th>Status</th>
                <th>Duration</th>
                <th className="right">Estimated use</th>
              </tr>
            </thead>
            <tbody>
              {runs.initial ? (
                [0, 1, 2, 3].map((i) => (
                  <tr key={i}>
                    <td colSpan={5}>
                      <Skeleton height={22} />
                    </td>
                  </tr>
                ))
              ) : (runs.data ?? []).length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: 0 }}>
                    <EmptyState icon="activity" title="No runs recorded yet">
                      Manual and scheduled runs appear here as soon as they start.
                    </EmptyState>
                  </td>
                </tr>
              ) : (
                (runs.data ?? []).slice(0, 40).map((run) => (
                  <tr key={run.id}>
                    <td>{formatWhenUtc(run.started_at)}</td>
                    <td style={{ color: "var(--ink)", fontWeight: 500 }}>{run.zone_name ?? "—"}</td>
                    <td>{statusBadge(run)}</td>
                    <td className="num">{formatDuration(actualSeconds(run))}</td>
                    <td className="right num">{formatLiters(num(run.liters_used))}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function statusBadge(run: Run) {
  if (run.status === "running")
    return (
      <Badge tone="success" dot live>
        Running
      </Badge>
    );
  if (run.status === "stopped") return <Badge tone="warn">Stopped early</Badge>;
  return <Badge tone="neutral">Completed</Badge>;
}

/** A stopped run is shorter than its requested duration. */
function actualSeconds(run: Run): number {
  if (run.ended_at)
    return Math.max(0, (Date.parse(run.ended_at) - Date.parse(run.started_at)) / 1000);
  return run.duration_seconds;
}

/** Run history is capped at 100 rows per request, so longer periods need paging. */
async function loadRuns(period: Period): Promise<Run[]> {
  const pages = period === "today" ? 1 : period === "week" ? 3 : 5;
  const all: Run[] = [];
  for (let page = 0; page < pages; page++) {
    const batch = await api.runs({ limit: 100, offset: page * 100 });
    all.push(...batch);
    if (batch.length < 100) break;
  }
  const since = windowStart(period);
  return all.filter((run) => Date.parse(run.started_at) >= since);
}

function windowStart(period: Period): number {
  const now = new Date();
  if (period === "today") return Date.parse(`${now.toISOString().slice(0, 10)}T00:00:00Z`);
  const days = period === "week" ? 7 : 30;
  return now.getTime() - days * 86_400_000;
}

function buildChart(
  period: Period,
  runs: Run[],
  consumption: Consumption | null,
): { buckets: Bucket[]; series: Series[] } {
  const totals = consumption?.byZone ?? [];
  const series: Series[] = totals.map((zone, index) => ({
    id: zone.zone_id,
    name: zone.zone_name,
    color: SERIES_COLORS[index % SERIES_COLORS.length],
    liters: zone.liters,
  }));
  const known = new Set(series.map((s) => s.id));

  const buckets: Bucket[] =
    period === "today"
      ? Array.from({ length: 24 }, (_, hour) => ({
          label: `${String(hour).padStart(2, "0")}:00`,
          showLabel: hour % 6 === 0,
          byZone: new Map<string, number>(),
        }))
      : Array.from({ length: period === "week" ? 7 : 30 }, (_, index) => {
          const days = period === "week" ? 7 : 30;
          const date = new Date(Date.now() - (days - 1 - index) * 86_400_000);
          return {
            label: new Intl.DateTimeFormat("en-GB", {
              timeZone: "UTC",
              day: "numeric",
              month: "short",
            }).format(date),
            showLabel: period === "week" ? true : index % 6 === 0,
            byZone: new Map<string, number>(),
          };
        });

  for (const run of runs) {
    if (run.status === "running" || !known.has(run.zone_id)) continue;
    const started = new Date(run.started_at);
    const index =
      period === "today"
        ? started.getUTCHours()
        : buckets.length -
          1 -
          Math.floor((Date.now() - started.getTime()) / 86_400_000);
    const bucket = buckets[index];
    if (!bucket) continue;
    bucket.byZone.set(run.zone_id, (bucket.byZone.get(run.zone_id) ?? 0) + num(run.liters_used));
  }

  return { buckets, series };
}
