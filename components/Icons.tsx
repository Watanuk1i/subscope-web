import type { ReactElement, SVGProps } from 'react';

export type IconName =
  | 'home'
  | 'list'
  | 'chart'
  | 'savings'
  | 'calendar'
  | 'settings'
  | 'plus'
  | 'search'
  | 'trash'
  | 'edit'
  | 'pause'
  | 'play'
  | 'check'
  | 'chevron-down'
  | 'chevron-right'
  | 'chevron-left'
  | 'x'
  | 'arrow-right'
  | 'shield'
  | 'lock'
  | 'bell'
  | 'card'
  | 'user'
  | 'logout'
  | 'warn'
  | 'info'
  | 'spark'
  | 'menu'
  | 'receipt'
  | 'clock'
  | 'globe'
  | 'mail'
  | 'filter'
  | 'trend-down'
  | 'trend-up'
  | 'layers';

const PATHS: Record<IconName, ReactElement> = {
  home: <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-5H9v5H5a1 1 0 0 1-1-1z" />,
  list: (
    <>
      <path d="M8 6h12M8 12h12M8 18h12" />
      <circle cx="4" cy="6" r="1.2" />
      <circle cx="4" cy="12" r="1.2" />
      <circle cx="4" cy="18" r="1.2" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V4" />
      <path d="M4 20h16" />
      <rect x="7.5" y="12" width="3" height="5" rx="1" />
      <rect x="12.5" y="8" width="3" height="9" rx="1" />
      <rect x="17.5" y="14" width="3" height="3" rx="1" />
    </>
  ),
  savings: (
    <>
      <path d="M12 3v3" />
      <path d="M9.5 6h5a4.5 4.5 0 0 1 4.5 4.5V16a4 4 0 0 1-4 4h-6a4 4 0 0 1-4-4v-5.5A4.5 4.5 0 0 1 9.5 6z" />
      <path d="M9.5 12h5" />
      <path d="M12 9.5v5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
      <path d="M3.5 10h17M8 3.5v3M16 3.5v3" />
      <circle cx="8" cy="14" r="1" />
      <circle cx="12" cy="14" r="1" />
      <circle cx="16" cy="14" r="1" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.2l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 3 15.4H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.2-2.9l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 10 4.6V4a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 21 11h.1a2 2 0 1 1 0 4H21a1.7 1.7 0 0 0-1.6 1z" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M9.5 7V5.5A1.5 1.5 0 0 1 11 4h2a1.5 1.5 0 0 1 1.5 1.5V7" />
      <path d="M6.5 7 7.4 19a1.6 1.6 0 0 0 1.6 1.5h6a1.6 1.6 0 0 0 1.6-1.5L17.5 7" />
      <path d="M10.5 11v5.5M13.5 11v5.5" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z" />
      <path d="m14.5 6.5 3 3" />
    </>
  ),
  pause: (
    <>
      <rect x="7" y="5" width="3.5" height="14" rx="1.4" />
      <rect x="13.5" y="5" width="3.5" height="14" rx="1.4" />
    </>
  ),
  play: <path d="M8 5.5v13l10-6.5z" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  'chevron-down': <path d="m6 9.5 6 6 6-6" />,
  'chevron-right': <path d="m9.5 6 6 6-6 6" />,
  'chevron-left': <path d="m14.5 6-6 6 6 6" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  'arrow-right': <path d="M4 12h15m-5.5-5.5L19 12l-5.5 5.5" />,
  shield: (
    <>
      <path d="M12 3.5 19 6v6c0 4.2-2.9 7.4-7 8.6-4.1-1.2-7-4.4-7-8.6V6z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10" width="15" height="10.5" rx="3" />
      <path d="M8 10V7.5a4 4 0 1 1 8 0V10" />
    </>
  ),
  bell: (
    <>
      <path d="M6.5 10a5.5 5.5 0 1 1 11 0c0 4 1.5 5.5 1.5 5.5H5S6.5 14 6.5 10z" />
      <path d="M10 19a2.2 2.2 0 0 0 4 0" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="3" />
      <path d="M3 10h18M6.5 14.5h4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M4.8 20a7.2 7.2 0 0 1 14.4 0" />
    </>
  ),
  logout: (
    <>
      <path d="M14 5.5H7A2.5 2.5 0 0 0 4.5 8v8A2.5 2.5 0 0 0 7 18.5h7" />
      <path d="M17 15.5 20.5 12 17 8.5M20 12H10" />
    </>
  ),
  warn: (
    <>
      <path d="M12 4.5 21 19.5H3z" />
      <path d="M12 10v4.5M12 17.2v.3" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5M12 7.8v.3" />
    </>
  ),
  spark: (
    <path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18.5l-1.8-5.9L4.5 10.8 10.2 9z" />
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  receipt: (
    <>
      <path d="M6 3.5h12v17l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4z" />
      <path d="M9 8h6M9 12h6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.6 2.5 14.4 0 17-2.5-2.6-2.5-14.4 0-17z" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="3" />
      <path d="m4 8 8 5.5L20 8" />
    </>
  ),
  filter: <path d="M4 6h16l-6.2 7.2V19l-3.6-2v-3.8z" />,
  'trend-down': (
    <>
      <path d="M4 7.5 10.5 14l3-3L20 17.5" />
      <path d="M20 12.5v5h-5" />
    </>
  ),
  'trend-up': (
    <>
      <path d="M4 17 10.5 10.5l3 3L20 7" />
      <path d="M20 12V7h-5" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3.5 8.5 4.5-8.5 4.5L3.5 8z" />
      <path d="m4 12.5 8 4.2 8-4.2M4 16.8l8 4.2 8-4.2" />
    </>
  ),
};

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}

export function Logo({ className = '', size = 40 }: { className?: string; size?: number }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-2xl bg-navy text-white font-display font-extrabold shadow-card ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.45 }}
    >
      S
    </span>
  );
}
