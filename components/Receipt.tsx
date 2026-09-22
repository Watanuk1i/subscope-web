'use client';

import { useMemo, useState } from 'react';
import { CATALOG, USAGE, USAGE_ORDER } from '@/lib/config';
import { fmt } from '@/lib/finance';
import { CountUp } from '@/components/CountUp';
import { Icon } from '@/components/Icons';

interface DemoSub {
  id: string;
  name: string;
  color: string;
  ink?: string;
  price: number;
  annual: boolean;
  usage: 'low' | 'medium' | 'high';
}

const START: DemoSub[] = [
  { id: 'yandex', name: 'Яндекс Плюс', color: '#FFCC00', ink: '#14172E', price: 399, annual: true, usage: 'high' },
  { id: 'kinopoisk', name: 'Кинопоиск', color: '#FF5500', price: 299, annual: true, usage: 'low' },
  { id: 'chatgpt', name: 'ChatGPT Plus', color: '#10A37F', price: 2499, annual: false, usage: 'medium' },
  { id: 'icloud', name: 'iCloud+ 200 ГБ', color: '#3693F5', price: 149, annual: false, usage: 'low' },
  { id: 'xbox', name: 'Xbox Game Pass', color: '#107C10', price: 749, annual: false, usage: 'medium' },
];

const BARS = [3, 1, 2, 1, 4, 1, 2, 3, 1, 1, 2, 4, 1, 3, 2, 1, 1, 4, 2, 1, 3, 1, 2, 1, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1, 3];

const RECEIPT_DATE = new Date().toLocaleDateString('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function Receipt() {
  const [subs, setSubs] = useState<DemoSub[]>(START);
  const [view, setView] = useState<'month' | 'year'>('month');

  const cycle = (id: string) => {
    setSubs((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const i = USAGE_ORDER.indexOf(s.usage);
        return { ...s, usage: USAGE_ORDER[(i + 1) % USAGE_ORDER.length] };
      }),
    );
  };

  const calc = useMemo(() => {
    const monthly = subs.reduce((a, s) => a + s.price, 0);
    const wasted = subs.filter((s) => s.usage === 'low').reduce((a, s) => a + s.price, 0);
    const annual = subs
      .filter((s) => s.usage !== 'low' && s.annual)
      .reduce((a, s) => a + s.price * 0.17, 0);
    const saving = Math.round(wasted + annual);
    return { monthly, wasted, saving };
  }, [subs]);

  const multiplier = view === 'month' ? 1 : 12;
  const suffix = view === 'month' ? 'мес' : 'год';

  return (
    <div className="relative w-full max-w-[380px] pb-4">
      <div className="receipt receipt-top rounded-[2px] px-5 pb-6 pt-8 text-[#5c6079] sm:px-7">
        {/* шапка чека */}
        <div className="text-center">
          <div className="mx-auto grid size-9 place-items-center rounded-xl bg-ink text-white">
            <Icon name="receipt" size={18} />
          </div>
          <p className="mt-3 font-display text-base font-black tracking-[0.22em] text-ink">SUBSCOPE</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8d91a8]">
            чек регулярных списаний
          </p>
          <div className="mt-3 flex justify-between font-mono text-[10px] text-[#8d91a8]">
            <span>№ 00{subs.length}42</span>
            <span>{RECEIPT_DATE}</span>
          </div>
          <div className="perforation mt-3" />
        </div>

        {/* переключатель периода */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8d91a8]">
            показать за
          </p>
          <div className="inline-flex rounded-full border border-[#d5d7e2] bg-white p-0.5">
            {(['month', 'year'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={`press rounded-full px-3 py-1 text-[11px] font-bold transition ${
                  view === v ? 'bg-ink text-white' : 'text-[#8d91a8] hover:text-ink'
                }`}
              >
                {v === 'month' ? 'Месяц' : 'Год'}
              </button>
            ))}
          </div>
        </div>

        {/* строки чека */}
        <ul className="mt-4 space-y-2.5">
          {subs.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => cycle(s.id)}
                title="Нажмите, чтобы отметить, как часто пользуетесь"
                className="group flex w-full items-center gap-2.5 rounded-lg px-1 py-1 text-left transition hover:bg-ink/[0.03]"
              >
                <span
                  className="grid size-6 shrink-0 place-items-center rounded-md font-mono text-[10px] font-bold"
                  style={{ background: s.color, color: s.ink ?? '#fff' }}
                >
                  {s.name[0]}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block truncate font-mono text-[11.5px] ${
                      s.usage === 'low' ? 'text-ink line-through decoration-accent/60' : 'text-ink'
                    }`}
                  >
                    {s.name}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[9.5px] uppercase tracking-wide text-[#8d91a8]">
                    {USAGE[s.usage].label}
                    <Icon
                      name="edit"
                      size={9}
                      className="opacity-0 transition group-hover:opacity-70"
                    />
                  </span>
                </span>
                <span className="num shrink-0 font-mono text-[11.5px] font-bold text-ink">
                  {fmt(s.price * multiplier)}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="perforation my-4" />

        {/* итоги */}
        <dl className="space-y-2 font-mono text-[11.5px]">
          <div className="flex justify-between gap-3">
            <dt className="text-[#8d91a8]">Расходы / {suffix}</dt>
            <dd className="num font-bold text-ink">
              <CountUp value={calc.monthly * multiplier} format={(n) => fmt(n)} />
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-[#8d91a8]">За год</dt>
            <dd className="num text-ink">{fmt(calc.monthly * 12)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-[#8d91a8]">За 5 лет</dt>
            <dd className="num text-ink">{fmt(calc.monthly * 60)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-[#8d91a8]">Списывается впустую</dt>
            <dd className="num font-bold text-danger">−{fmt(calc.wasted * multiplier)}</dd>
          </div>
        </dl>

        <div className="mt-4 rounded-xl bg-save-bg px-3 py-3 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-save/80">
            можно сохранить
          </p>
          <p className="font-display text-2xl font-black text-save">
            <CountUp value={calc.saving * multiplier} format={(n) => fmt(n)} />
            <span className="ml-1 font-sans text-[11px] font-bold">/ {suffix}</span>
          </p>
        </div>

        <div className="perforation my-4" />

        <p className="text-center font-mono text-[10px] leading-relaxed text-[#8d91a8]">
          Нажмите на строку и отметьте,
          <br />
          как часто вы пользуетесь сервисом
        </p>

        <div className="barcode mt-4 justify-center">
          {BARS.map((h, i) => (
            <i key={i} style={{ height: `${18 + h * 4}px`, width: h > 2 ? '3px' : '2px' }} />
          ))}
        </div>
        <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-[#8d91a8]">
          {CATALOG.length} сервисов в каталоге · субск·оп
        </p>
      </div>
    </div>
  );
}
