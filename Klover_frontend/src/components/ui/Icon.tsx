import type { CSSProperties, ReactElement } from "react";

export type IconName =
  | "overview"
  | "zones"
  | "droplet"
  | "calendar"
  | "activity"
  | "bars"
  | "list"
  | "cloud"
  | "leaf"
  | "chevron-right"
  | "chevron-down"
  | "arrow-right"
  | "arrow-up"
  | "arrow-down"
  | "plus"
  | "play"
  | "stop"
  | "more"
  | "check"
  | "close"
  | "search"
  | "flask"
  | "rain"
  | "sun"
  | "cloud-sun"
  | "trend-up"
  | "trend-down"
  | "pin"
  | "database"
  | "info"
  | "logout"
  | "clock"
  | "alert"
  | "map"
  | "layers"
  | "crosshair"
  | "pencil"
  | "trash"
  | "sprinkler"
  | "valve"
  | "bulb"
  | "minus"
  | "drone"
  | "move"
  | "lock"
  | "unlock"
  | "expand"
  | "sprout"
  | "help"
  | "hourglass"
  | "image";

const paths: Record<IconName, ReactElement> = {
  overview: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  zones: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18M9 10v10" />
    </>
  ),
  droplet: <path d="M12 3.2 6.9 9.4a6.6 6.6 0 1 0 10.2 0L12 3.2Z" />,
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  activity: (
    <>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </>
  ),
  list: (
    <>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <circle cx="3.6" cy="6" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="3.6" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="3.6" cy="18" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  bars: (
    <>
      <path d="M5 20v-5M12 20V9M19 20V4" strokeWidth="2.6" />
    </>
  ),
  cloud: (
    <path d="M7 18h9.5a3.5 3.5 0 0 0 .4-6.98A5.5 5.5 0 0 0 6.3 10.2 3.9 3.9 0 0 0 7 18Z" />
  ),
  leaf: (
    <>
      <path d="M20 4c0 8-5.2 12-11 12a5 5 0 0 1 0-10c4.4 0 6.6-1 11-2Z" />
      <path d="M4 20c2-4.5 5-7 9-8.6" />
    </>
  ),
  "chevron-right": <path d="m9 5 7 7-7 7" />,
  "chevron-down": <path d="m5 9 7 7 7-7" />,
  "arrow-right": <path d="M4 12h15m-6-6 6 6-6 6" />,
  "arrow-up": <path d="M12 20V5m-6 6 6-6 6 6" />,
  "arrow-down": <path d="M12 4v15m6-6-6 6-6-6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  play: <path d="M8 5.5v13l11-6.5-11-6.5Z" />,
  stop: <rect x="6" y="6" width="12" height="12" rx="1.5" />,
  more: (
    <>
      <circle cx="12" cy="5" r="1.4" />
      <circle cx="12" cy="12" r="1.4" />
      <circle cx="12" cy="19" r="1.4" />
    </>
  ),
  check: <path d="m5 13 4.5 4.5L19 7" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  flask: (
    <>
      <path d="M9 3h6M10 3v6L5 19a1.6 1.6 0 0 0 1.4 2.4h11.2A1.6 1.6 0 0 0 19 19l-5-10V3" />
      <path d="M7.6 15h8.8" />
    </>
  ),
  rain: (
    <>
      <path d="M7 15h9.5a3.5 3.5 0 0 0 .4-6.98A5.5 5.5 0 0 0 6.3 7.2 3.9 3.9 0 0 0 7 15Z" />
      <path d="M9 18.5 8 21m4-2.5-1 2.5m5-2.5-1 2.5" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
    </>
  ),
  "cloud-sun": (
    <>
      <circle cx="8" cy="7.5" r="3" />
      <path d="M8 1.8v1.4M8 11.8v1.4M2.3 7.5h1.4M12.3 7.5h1.4M4 3.5l1 1M11 10.5l1 1M12 3.5l-1 1M5 10.5l-1 1" />
      <path d="M11 20h7a3 3 0 0 0 .3-5.98A4.7 4.7 0 0 0 10.2 12.6 3.4 3.4 0 0 0 11 20Z" />
    </>
  ),
  "trend-up": <path d="M4 16.5 10 10l4 4 6-7.5M20 6.5h-5m5 0v5" />,
  "trend-down": <path d="M4 7.5 10 14l4-4 6 7.5M20 17.5h-5m5 0v-5" />,
  pin: (
    <>
      <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6" rx="7.5" ry="3" />
      <path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 7.8v.6" />
    </>
  ),
  logout: <path d="M15 17v2.5A1.5 1.5 0 0 1 13.5 21h-8A1.5 1.5 0 0 1 4 19.5v-15A1.5 1.5 0 0 1 5.5 3h8A1.5 1.5 0 0 1 15 4.5V7m3 9 4-4-4-4m4 4H9" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.4 2" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3.6 21 19.4H3L12 3.6Z" />
      <path d="M12 10v4M12 16.6v.5" />
    </>
  ),
  map: (
    <>
      <path d="m9 4-6 2.6v13.2L9 17.2l6 2.6 6-2.6V4l-6 2.6L9 4Z" />
      <path d="M9 4v13.2M15 6.6v13.2" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3.4 12.5 8.6 4.8 8.6-4.8" />
    </>
  ),
  crosshair: (
    <>
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </>
  ),
  pencil: (
    <>
      <path d="M4 20.5 4.9 16 16.4 4.5a2.1 2.1 0 0 1 3 3L7.9 19 3.4 20l.6-.5Z" />
      <path d="m14.6 6.3 3.1 3.1" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M9.5 7V5.2A1.2 1.2 0 0 1 10.7 4h2.6a1.2 1.2 0 0 1 1.2 1.2V7" />
      <path d="M6.3 7 7 19.2A1.8 1.8 0 0 0 8.8 21h6.4a1.8 1.8 0 0 0 1.8-1.8L17.7 7" />
      <path d="M10.4 11v6M13.6 11v6" />
    </>
  ),
  sprinkler: (
    <>
      <path d="M12 12.5V21M8.5 21h7" />
      <circle cx="12" cy="10.6" r="2.1" />
      <path d="M6 8.4c1.4-1.6 3.6-2.6 6-2.6s4.6 1 6 2.6M4 5.4c2-2.1 4.9-3.4 8-3.4s6 1.3 8 3.4" />
    </>
  ),
  valve: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8M8.6 12h6.8" />
    </>
  ),
  bulb: (
    <>
      <path d="M9.2 17h5.6M10 20.4h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .8 1.6h5.4c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3Z" />
    </>
  ),
  minus: <path d="M5 12h14" />,
  drone: (
    <>
      <rect x="9" y="9" width="6" height="6" rx="1.5" />
      <path d="M9.4 9.4 6 6M14.6 9.4 18 6M9.4 14.6 6 18M14.6 14.6 18 18" />
      <circle cx="4.6" cy="4.6" r="2.2" />
      <circle cx="19.4" cy="4.6" r="2.2" />
      <circle cx="4.6" cy="19.4" r="2.2" />
      <circle cx="19.4" cy="19.4" r="2.2" />
    </>
  ),
  move: (
    <path d="M12 3v18M3 12h18M12 3 9.4 5.6M12 3l2.6 2.6M12 21l-2.6-2.6M12 21l2.6-2.6M3 12l2.6-2.6M3 12l2.6 2.6M21 12l-2.6-2.6M21 12l-2.6 2.6" />
  ),
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5V7.6a4 4 0 0 1 8 0v2.9" />
    </>
  ),
  unlock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5V7.6a4 4 0 0 1 7.7-1.5" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <circle cx="8.8" cy="10" r="1.6" />
      <path d="m3.6 17.4 4.7-4.5a1.8 1.8 0 0 1 2.5 0l3.4 3.3M13 14.4l1.9-1.8a1.8 1.8 0 0 1 2.5 0l3 2.9" />
    </>
  ),
  hourglass: (
    <>
      <path d="M7 3h10M7 21h10" />
      <path d="M8 3v3.2c0 1.9 4 3.6 4 5.8s-4 3.9-4 5.8V21" />
      <path d="M16 3v3.2c0 1.9-4 3.6-4 5.8s4 3.9 4 5.8V21" />
    </>
  ),
  /** A seedling: the garden area a zone is planted in. */
  sprout: (
    <>
      <path d="M12 21v-8" />
      <path d="M12 13c0-3.3 2.7-6 6-6 0 3.3-2.7 6-6 6Z" />
      <path d="M12 13c0-2.8-2.2-5-5-5 0 2.8 2.2 5 5 5Z" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.4a2.5 2.5 0 0 1 4.9.6c0 1.7-2.5 2-2.5 3.5" />
      <path d="M12 17.2h.01" />
    </>
  ),
  expand: (
    <>
      <path d="M9 4H4v5M15 4h5v5M15 20h5v-5M9 20H4v-5" />
    </>
  ),
};

interface IconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  filled?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function Icon({
  name,
  size = 18,
  strokeWidth = 1.6,
  filled = false,
  className,
  style,
}: IconProps) {
  return (
    <svg
      className={className}
      style={{ flex: "none", ...style }}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}

/** The Klover mark: a lime sprout above two forest leaves. */
export function Logo({ size = 26, tone = "dark" }: { size?: number; tone?: "dark" | "light" }) {
  const leaf = tone === "dark" ? "#0e3222" : "#ffffff";
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path
        d="M15.6 15.4C11.9 10.1 6.9 9.3 2.6 9.9c-.6 4.4.6 9.3 5 11.7 3.4 1.9 6.6 1.3 8 .6Z"
        fill={leaf}
      />
      <path
        d="M16.4 15.4c3.7-5.3 8.7-6.1 13-5.5.6 4.4-.6 9.3-5 11.7-3.4 1.9-6.6 1.3-8 .6Z"
        fill={leaf}
      />
      <path
        d="M16 14.6c-1.5-2.6-1.3-6.4.6-9.3 2.6 1.6 4.2 4.9 3.6 8-.3 1.6-1.1 2.6-1.8 3.1Z"
        fill="#a9d138"
      />
    </svg>
  );
}

export function Wordmark({ tone = "dark", size = 26 }: { tone?: "dark" | "light"; size?: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <Logo size={size} tone={tone} />
      <span
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: size * 0.92,
          fontWeight: 600,
          letterSpacing: "-0.015em",
          color: tone === "dark" ? "var(--forest-900)" : "#ffffff",
          lineHeight: 1,
        }}
      >
        Klover
      </span>
    </span>
  );
}
