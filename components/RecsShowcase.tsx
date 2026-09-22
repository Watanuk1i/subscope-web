'use client';

import { useMemo, useState } from 'react';
import { SCENARIOS, computeRecs, fmt, recMeta, scenarioSavings, type Sub } from '@/lib/finance';
import { CountUp } from '@/components/CountUp';
import { Icon, type IconName } from '@/components/Icons';

const DEMO: Sub[] = [
  { id: 'd1', name: 'Netflix', category: 'video', price: 699, currency: 'RUB', period: 'month', status: 'active', usage: 'low' },
  { id: 'd2', name: 'Кинопоиск', category: 'video', price: 299, currency: 'RUB', period: 'month', status: 'active', usage: 'high' },
  { id: 'd3', name: 'Яндекс Музыка', category: 'music', price: 399, currency: 'RUB', period: 'month', status: 'active', usage: 'medium' },
  { id: 'd4', name: 'Spotify', category: 'music', price: 299, currency: 'RUB', period: 'month', status: 'active', usage: 'medium' },
  { id: 'd5', name: 'ChatGPT Plus', category: 'ai', price: 2499, currency: 'RUB', period: 'month', status: 'active', usage: 'high' },
  { id: 'd6', name: 'iCloud+', category: 'cloud', price: 149, currency: 'RUB', period: 'month', status: 'active', usage: 'low' },
  { id: 'd7', name: 'Adobe Creative Cloud', category: 'soft', price: 1990, currency: 'RUB', period: 'month', status: 'active', usage: 'medium' },
  { id: 'd8', name: 'Telegram Premium', category: 'apps', price: 299, currency: 'RUB', period: 'month', status: 'active', usage: 'high' },
];

const FACTORS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'card', title: 'Стоимость', text: 'Считаем реальную цену в месяц, даже если списывают раз в год' },
  { icon: 'clock', title: 'Частота использования', text: 'Вы отмечаете редко / иногда / часто — это главный сигнал' },
  { icon: 'layers', title: 'Категории', text: 'Группируем траты: кино, музыка, ИИ, облако, софт' },
  { icon: 'list', title: 'Похожие сервисы', text: 'Два стриминга или две музыки в одной категории — повод выбрать один' },
  { icon: 'calendar', title: 'Регулярность платежей', text: 'Смотрим даты списаний и ближайшие платежи' },
  { icon: 'trend-up', title: 'Динамика расходов', text: 'Сравниваем месяцы и показываем, куда идёт рост' },
];

const TONE: Record<string, { icon: IconName; className: string }> = {
  warn: { icon: 'warn', className: 'bg-warn-bg text-warn' },
  save: { icon: 'trend-down', className: 'bg-save-bg text-save' },
  info: { icon: 'info', className: 'bg-accent-soft text-accent-ink' },
};

export function RecsShowcase() {
  const { list } = useMemo(() => computeRecs(DEMO), []);
  const [scenarioId, setScenarioId] = useState(SCENARIOS[1].id);
  const [open, setOpen] = useState<string | null>(null);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[1];
  const shown = scenario.types ? list.filter((r) => scenario.types!.includes(r.type)) : list;
  const monthly = scenarioSavings(list, scenario);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <div className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-lg font-bold text-ink">Рекомендации на демо-данных</h3>
          <span className="rounded-full bg-save-bg px-3 py-1.5 text-xs font-bold text-save">
            − <CountUp value={monthly} format={(n) => fmt(n)} /> / мес
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setScenarioId(s.id)}
              aria-pressed={s.id === scenarioId}
              className={`press rounded-full border px-3.5 py-2 text-xs font-bold transition ${
                s.id === scenarioId
                  ? 'border-transparent bg-ink text-white shadow-sm'
                  : 'border-line bg-white text-body hover:border-ink/30'
              }`}
            >
              {s.label} · {fmt(scenarioSavings(list, s))}
            </button>
          ))}
        </div>
        <p className="mt-2.5 text-xs text-mute">{scenario.hint}</p>

        <ul className="mt-5 space-y-2.5">
          {shown.map((r) => {
            const meta = recMeta(r.type);
            const tone = TONE[meta.tone];
            const isOpen = open === r.key;
            return (
              <li key={r.key}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : r.key)}
                  aria-expanded={isOpen}
                  className={`press w-full rounded-2xl border p-4 text-left transition ${
                    isOpen ? 'border-ink/25 bg-bg' : 'border-line bg-white hover:border-ink/25'
                  }`}
                >
                  <span className="flex items-start gap-3">
                    <span className={`grid size-8 shrink-0 place-items-center rounded-xl ${tone.className}`}>
                      <Icon name={tone.icon} size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <span className="font-bold text-ink">{r.title}</span>
                        <span className="num shrink-0 font-mono text-xs font-bold text-save">
                          экономия {fmt(r.saving)} / мес
                        </span>
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-body">{r.text}</span>
                      {isOpen && (
                        <span className="slide-up mt-3 flex items-center gap-2 rounded-xl bg-ink px-3 py-2 text-[11px] font-semibold text-white">
                          <Icon name="spark" size={13} className="text-accent" />
                          {r.action}
                        </span>
                      )}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
          {shown.length === 0 && (
            <li className="rounded-2xl border border-dashed border-line p-6 text-center text-xs text-mute">
              В этом сценарии рекомендаций нет
            </li>
          )}
        </ul>
      </div>

      <div className="rounded-3xl border border-line bg-surface-2 p-5 shadow-card sm:p-7">
        <h3 className="font-display text-lg font-bold text-ink">Что анализирует движок</h3>
        <p className="mt-1.5 text-xs text-body">
          Рекомендации не случайные: каждая строится из шести факторов и пересчитывается, когда вы
          меняете цену, период или отметку об использовании.
        </p>
        <ul className="mt-5 space-y-3">
          {FACTORS.map((f) => (
            <li key={f.title} className="flex gap-3 rounded-2xl bg-white p-3.5 shadow-card">
              <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-ink">
                <Icon name={f.icon} size={16} />
              </span>
              <span>
                <span className="block text-sm font-bold text-ink">{f.title}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-body">{f.text}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-2xl bg-warn-bg px-4 py-3 text-[11px] leading-relaxed text-warn">
          Рекомендации носят информационный характер: решение об отмене всегда за вами.
        </p>
      </div>
    </div>
  );
}
