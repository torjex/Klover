# Klover frontend

React + TypeScript single-page app for the Klover irrigation backend. Vite dev server,
no UI framework — the design system lives in `src/index.css` (tokens) and
`src/components/ui` (primitives).

## Running it

The backend must be running first (`../Klover_backend`, port 3001).

```bash
npm install
npm run dev
```

The app is served at http://localhost:3000, which is the origin the backend's CORS
configuration allows (`FRONTEND_ORIGIN` in the backend `.env`).

Set `VITE_API_URL` to point at a different backend; it defaults to
`http://127.0.0.1:3001/api`.

## Demo account

```
demo@klover.app / KloverDemo2026!
```

Created by `../Klover_backend/scripts/seed-demo.cjs`, with two weeks of run history from
`../Klover_backend/scripts/seed-demo-history.cjs`. The login screen can fill these in for
you. Registration works too and creates a real, empty account.

## Screens

| Route | Screen |
| --- | --- |
| `/login` | Sign in and registration |
| `/` | Overview — active zones, today's use, rain probability, next schedule, zone cards |
| `/zones` | Zone table with enable/disable, flow rate, last run; add and edit |
| `/watering` | Manual run with duration presets and a live countdown for the active run |
| `/schedules` | Weekly grid in UTC, per-schedule editing, shared rain threshold |
| `/activity` | Stacked usage chart (today by hour, week/month by day) and the run log |
| `/weather` | Live seven-day Open-Meteo forecast, location search, database and mode status |

## Structure

```
src/
  api/          client.ts (fetch wrapper, session storage, adapters) + types.ts
  hooks/        useAuth (session context), useAsync (load/poll/refresh)
  components/
    ui/         Button, Card, Stat, Badge, Toggle, fields, Modal, RowMenu, toasts, icons
    layout/     AppShell (sidebar + page head)
    UsageChart  stacked bar chart
  pages/        one file + one stylesheet per screen
  lib/          format.ts (UTC formatting) and zoneImages.ts
```

## Notes

- Every timestamp and schedule is UTC, matching the backend, and is labelled as such.
- Water volumes are estimates derived from each zone's configured flow rate, not metered.
- Bigint IDs and numeric columns arrive as strings and are kept that way; `num()` parses
  them only where a number is needed.
- A 401 from any request clears the stored session and returns to the login screen.
- Zone photography is assigned deterministically from the zone ID, so a zone keeps its
  picture across reloads.
