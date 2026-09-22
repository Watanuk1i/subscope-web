'use client';

import { useState } from 'react';
import { CONFIG, PLAN_ORDER, type PlanId } from '@/lib/config';
import { plural } from '@/lib/finance';
import { Icon } from '@/components/Icons';
import { CountUp } from '@/components/CountUp';
import { Reveal } from '@/components/Reveal';
import { useAppStore, type Billing } from '@/components/AppStore';

interface PricingProps {
  onChoose?: (plan: PlanId) => void;
  compact?: boolean;
}

export function PricingToggle({
  billing,
  onChange,
}: {
  billing: Billing;
  onChange: (b: Billing) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-line bg-white p-1 shadow-card">
      {(['month', 'year'] as Billing[]).map((b) => (
        <button
          key={b}
          type="button"
          onClick={() => onChange(b)}
          aria-pressed={billing === b}
          className={`press rounded-full px-4 py-2 text-xs font-bold transition ${
            billing === b ? 'bg-ink text-white shadow-sm' : 'text-mute hover:text-ink'
          }`}
        >
          {b === 'month' ? 'В месяц' : 'В год'}
          {b === 'year' && (
            <span
              className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${
                billing === b ? 'bg-accent text-white' : 'bg-save/15 text-save'
              }`}
            >
              −17%
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function Pricing({ onChoose, compact = false }: PricingProps) {
  const { plan, setPlan, money } = useAppStore();
  const [billing, setBilling] = useState<Billing>('month');

  const pick = (id: PlanId) => {
    setPlan(id);
    onChoose?.(id);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <PricingToggle billing={billing} onChange={setBilling} />
      </div>

      <div
        className={`grid gap-5 ${
          compact ? 'md:grid-cols-3' : 'grid-cols-1 md:grid-cols-3'
        } items-start`}
      >
        {PLAN_ORDER.map((id, i) => {
          const p = CONFIG.plans[id];
          const isCurrent = plan === id;
          const price = billing === 'month' ? p.price.month : p.price.year;
          const featured = id === 'pro';

          return (
            <Reveal
              key={id}
              delay={i * 90}
              className={`relative rounded-3xl border p-6 sm:p-7 transition ${
                featured
                  ? 'border-transparent bg-ink text-white shadow-pop'
                  : 'border-line bg-white shadow-card card-hover'
              }`}
            >
              {featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-sm">
                  Выбор большинства
                </span>
              )}
              {isCurrent && (
                <span
                  className={`absolute right-5 top-5 flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    featured ? 'bg-white/15 text-white' : 'bg-save/15 text-save'
                  }`}
                >
                  <Icon name="check" size={12} /> ваш тариф
                </span>
              )}

              <p
                className={`font-display text-lg font-bold tracking-wide ${
                  featured ? 'text-white' : 'text-ink'
                }`}
              >
                {p.name}
              </p>
              <p className={`mt-1 text-xs ${featured ? 'text-white/60' : 'text-mute'}`}>{p.blurb}</p>

              <div className="mt-6 flex items-end gap-2">
                <span
                  className={`font-display text-3xl font-black tabular-nums ${
                    featured ? 'text-white' : 'text-ink'
                  }`}
                >
                  <CountUp value={price} format={(n) => money(Math.round(n))} />
                </span>
                <span className={`pb-1 text-xs ${featured ? 'text-white/60' : 'text-mute'}`}>
                  / {billing === 'month' ? 'мес' : 'год'}
                </span>
              </div>

              {billing === 'year' && price > 0 && (
                <p className={`mt-1 text-[11px] ${featured ? 'text-white/60' : 'text-mute'}`}>
                  ≈ {money(Math.round(price / 12))} в месяц · экономия{' '}
                  {money(p.price.month * 12 - price)} в год
                </p>
              )}

              <ul className="mt-6 space-y-2.5 text-xs">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <span
                      className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded-full ${
                        featured ? 'bg-accent text-white' : 'bg-save/15 text-save'
                      }`}
                    >
                      <Icon name="check" size={11} />
                    </span>
                    <span className={featured ? 'text-white/85' : 'text-body'}>{f}</span>
                  </li>
                ))}
              </ul>

              <p className={`mt-5 text-[11px] ${featured ? 'text-white/50' : 'text-mute'}`}>
                {p.limit === Number.POSITIVE_INFINITY
                  ? 'Без лимита на подписки'
                  : `Лимит: ${p.limit} ${plural(p.limit, 'активная подписка', 'активные подписки', 'активных подписок')}`}
              </p>

              <button
                type="button"
                onClick={() => pick(id)}
                disabled={isCurrent}
                className={`press mt-4 w-full rounded-2xl py-3 text-sm font-bold transition disabled:cursor-default disabled:opacity-60 ${
                  featured
                    ? 'bg-accent text-white hover:brightness-110'
                    : isCurrent
                      ? 'border border-line bg-bg text-mute'
                      : 'bg-ink text-white hover:bg-ink/90'
                }`}
              >
                {isCurrent ? 'Тариф активен' : id === 'free' ? 'Пользоваться бесплатно' : `Перейти на ${p.name}`}
              </button>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
