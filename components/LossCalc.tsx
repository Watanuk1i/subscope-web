'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import { CONFIG } from '@/lib/config';
import { fmt, plural } from '@/lib/finance';
import { CountUp } from '@/components/CountUp';
import { Icon } from '@/components/Icons';

const MIN_COUNT = 1;
const MAX_COUNT = 20;
const MIN_PRICE = 100;
const MAX_PRICE = 3000;
const PRICE_STEP = 50;

function Slider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  const p = ((value - min) / (max - min)) * 100;
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-mute">{label}</span>
        <span className="font-display text-lg font-bold text-ink">{display}</span>
      </span>
      <input
        type="range"
        className="slider mt-3"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ '--p': `${p}%` } as CSSProperties}
      />
    </label>
  );
}

export function LossCalc() {
  const [count, setCount] = useState(7);
  const [price, setPrice] = useState(450);

  const result = useMemo(() => {
    const monthly = count * price;
    const year = monthly * 12;
    const five = monthly * 60;
    const saving = Math.round(year * CONFIG.annualDiscount);
    return { monthly, year, five, saving };
  }, [count, price]);

  const maxBar = 20 * 3000 * 12;

  return (
    <div className="grid gap-6 rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="space-y-7">
        <div>
          <h3 className="font-display text-xl font-bold text-ink">Калькулятор потерь</h3>
          <p className="mt-1.5 text-sm text-body">
            Подвигайте ползунки — увидите, сколько подписки забирают за год и за пять лет.
          </p>
        </div>

        <Slider
          label="Количество подписок"
          value={count}
          min={MIN_COUNT}
          max={MAX_COUNT}
          step={1}
          display={`${count} ${plural(count, 'подписка', 'подписки', 'подписок')}`}
          onChange={setCount}
        />
        <Slider
          label="Средняя цена"
          value={price}
          min={MIN_PRICE}
          max={MAX_PRICE}
          step={PRICE_STEP}
          display={`${fmt(price)} / мес`}
          onChange={setPrice}
        />

        <div className="rounded-2xl bg-bg px-4 py-3 text-xs text-body">
          <span className="font-bold text-ink">{fmt(result.monthly)}</span> списывается каждый месяц
          — обычно несколькими незаметными платежами.
        </div>
      </div>

      <div className="space-y-5 rounded-2xl bg-ink p-6 text-white">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
            сколько это стоит
          </p>
          <Icon name="trend-down" size={16} className="text-accent" />
        </div>

        <div>
          <p className="text-xs text-white/60">За месяц</p>
          <p className="num font-display text-2xl font-black">
            <CountUp value={result.monthly} format={(n) => fmt(n)} />
          </p>
        </div>
        <div>
          <p className="text-xs text-white/60">За год</p>
          <p className="num font-display text-3xl font-black text-accent">
            <CountUp value={result.year} format={(n) => fmt(n)} />
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="bar-fill h-full rounded-full bg-accent"
              style={{ width: `${Math.min(100, (result.year / maxBar) * 100)}%` }}
            />
          </div>
        </div>
        <div>
          <p className="text-xs text-white/60">За 5 лет</p>
          <p className="num font-display text-xl font-black">
            <CountUp value={result.five} format={(n) => fmt(n)} />
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 px-4 py-3">
          <p className="text-xs text-white/70">
            Реальная экономия при оптимизации тарифов и отмене лишнего — около{' '}
            {Math.round(CONFIG.annualDiscount * 100)}% в год:
          </p>
          <p className="num mt-1 font-display text-lg font-black text-save-bg">
            − <CountUp value={result.saving} format={(n) => fmt(n)} /> / год
          </p>
        </div>
      </div>
    </div>
  );
}
