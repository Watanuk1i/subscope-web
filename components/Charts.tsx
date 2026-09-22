'use client';

import { fmt } from '@/lib/finance';

export interface Slice {
  label: string;
  color: string;
  value: number;
}

export function DonutChart({ slices, centerLabel, centerValue }: {
  slices: Slice[];
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = slices.reduce((a, s) => a + s.value, 0) || 1;
  const R = 54;
  const C = 2 * Math.PI * R;
  let offset = 0;

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="relative shrink-0">
        <svg viewBox="0 0 140 140" className="size-36 -rotate-90" role="img" aria-label="Доли расходов по категориям">
          <circle cx="70" cy="70" r={R} fill="none" stroke="#e2e5ef" strokeWidth="16" />
          {slices.map((s) => {
            const len = (s.value / total) * C;
            const dash = `${len} ${C - len}`;
            const shift = -offset;
            offset += len;
            return (
              <circle
                key={s.label}
                cx="70"
                cy="70"
                r={R}
                fill="none"
                stroke={s.color}
                strokeWidth="16"
                strokeDasharray={dash}
                strokeDashoffset={shift}
              />
            );
          })}
        </svg>
        {centerValue && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="num font-display text-base font-black text-ink">{centerValue}</span>
            {centerLabel && <span className="text-[10px] text-mute">{centerLabel}</span>}
          </div>
        )}
      </div>

      <ul className="min-w-0 flex-1 space-y-2 text-xs">
        {slices.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span className="size-2.5 shrink-0 rounded-full" style={{ background: s.color }} />
            <span className="truncate text-body">{s.label}</span>
            <span className="num ml-auto shrink-0 font-mono text-[11px] font-bold text-ink">
              {fmt(s.value)}
            </span>
            <span className="num w-9 shrink-0 text-right font-mono text-[11px] text-mute">
              {Math.round((s.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SeriesChart({ points }: {
  points: { label: string; amount: number; future: boolean; current: boolean }[];
}) {
  const max = Math.max(...points.map((p) => p.amount), 1);
  return (
    <div>
      <div className="flex h-40 items-end gap-1.5 sm:gap-2">
        {points.map((p, i) => (
          <div key={`${p.label}-${i}`} className="group relative flex-1">
            <div
              className={`bar-fill w-full rounded-t-lg transition-all ${
                p.future
                  ? 'bg-line-2/70'
                  : p.current
                    ? 'bg-accent'
                    : 'bg-ink/80'
              }`}
              style={{ height: `${Math.max(6, (p.amount / max) * 160)}px` }}
            />
            <span className="pointer-events-none absolute -top-7 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 font-mono text-[10px] font-bold text-white opacity-0 transition group-hover:opacity-100">
              {fmt(p.amount)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1.5 sm:gap-2">
        {points.map((p, i) => (
          <span
            key={`${p.label}-${i}`}
            className={`flex-1 truncate text-center font-mono text-[10px] ${
              p.current ? 'font-bold text-accent' : 'text-mute'
            }`}
          >
            {p.label}
          </span>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-mute">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-ink/80" /> прошлые месяцы
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-accent" /> текущий
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-line-2" /> план по датам списаний
        </span>
      </div>
    </div>
  );
}

export function ForecastChart({ raw, optimized }: { raw: number[]; optimized: number[] }) {
  const W = 320;
  const H = 150;
  const PAD = 8;
  const max = Math.max(...raw, 1);
  const x = (i: number) => PAD + (i * (W - PAD * 2)) / (raw.length - 1);
  const y = (v: number) => H - PAD - (v / max) * (H - PAD * 2);
  const path = (vals: number[]) => vals.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Прогноз расходов на 12 месяцев">
        <path d={path(raw)} fill="none" stroke="#cbd0e0" strokeWidth="2.5" strokeDasharray="5 4" />
        <path d={path(optimized)} fill="none" stroke="#0b7f58" strokeWidth="2.5" />
        <circle cx={x(raw.length - 1)} cy={y(raw[raw.length - 1])} r="3.5" fill="#cbd0e0" />
        <circle cx={x(optimized.length - 1)} cy={y(optimized[optimized.length - 1])} r="3.5" fill="#0b7f58" />
      </svg>
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-mute">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded bg-line-2" /> как сейчас
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded bg-save" /> с рекомендациями
        </span>
      </div>
    </div>
  );
}
