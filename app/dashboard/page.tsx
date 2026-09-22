'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import {
  CATALOG,
  CATEGORIES,
  PERIODS,
  STATUS_LABEL,
  USAGE,
  USAGE_ORDER,
  catalogByName,
  categoryColor,
  categoryLabel,
  hasFeature,
} from '@/lib/config';
import {
  SCENARIOS,
  byCategory,
  calcSub,
  computeRecs,
  fmt,
  forecast,
  fmtDate,
  isActive,
  isoDate,
  monthlySeries,
  nextPaymentDateForDay,
  periodLabel,
  recMeta,
  relDays,
  scenarioSavings,
  totals,
  upcoming,
  usageOf,
  type Sub,
} from '@/lib/finance';
import { Icon, Logo, type IconName } from '@/components/Icons';
import { CountUp } from '@/components/CountUp';
import { DonutChart, ForecastChart, SeriesChart } from '@/components/Charts';
import { useAppStore } from '@/components/AppStore';
import { useToast } from '@/components/Toast';

type Tab = 'overview' | 'subs' | 'analytics' | 'savings' | 'calendar';

const TABS: { id: Tab; label: string; icon: IconName }[] = [
  { id: 'overview', label: 'Обзор', icon: 'home' },
  { id: 'subs', label: 'Подписки', icon: 'list' },
  { id: 'analytics', label: 'Аналитика', icon: 'chart' },
  { id: 'savings', label: 'Экономия', icon: 'savings' },
  { id: 'calendar', label: 'Календарь', icon: 'calendar' },
];

const USAGE_TONE: Record<string, string> = {
  low: 'bg-warn-bg text-warn',
  medium: 'bg-bg text-body',
  high: 'bg-save-bg text-save',
};

const REC_TONE: Record<string, string> = {
  warn: 'bg-warn-bg text-warn',
  save: 'bg-save-bg text-save',
  info: 'bg-accent-soft text-accent-ink',
};

const REC_ICON: Record<string, IconName> = {
  unused: 'clock',
  tariff: 'card',
  duplicate: 'layers',
  annual: 'trend-down',
  share: 'chart',
};

function StatCard({ label, value, hint, tone = 'default' }: {
  label: string;
  value: string;
  hint?: string;
  tone?: 'default' | 'save';
}) {
  return (
    <div
      className={`rounded-3xl border p-5 shadow-card sm:p-6 ${
        tone === 'save' ? 'border-save-line bg-save-bg' : 'border-line bg-white'
      }`}
    >
      <p
        className={`text-[11px] font-black uppercase tracking-wider ${
          tone === 'save' ? 'text-save/80' : 'text-mute'
        }`}
      >
        {label}
      </p>
      <p
        className={`num mt-2 font-display text-2xl font-black sm:text-3xl ${
          tone === 'save' ? 'text-save' : 'text-ink'
        }`}
      >
        {value}
      </p>
      {hint && (
        <p className={`mt-1.5 text-[11px] ${tone === 'save' ? 'text-save/80' : 'text-mute'}`}>
          {hint}
        </p>
      )}
    </div>
  );
}

function Locked({ flag, children }: { flag: 'pro' | 'pro_plus'; children: ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-white shadow-card">
      <div className="locked-body p-6 sm:p-8">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/60 p-6 text-center backdrop-blur-[1px]">
        <span className="grid size-11 place-items-center rounded-2xl bg-ink text-white">
          <Icon name="lock" size={20} />
        </span>
        <p className="max-w-xs text-sm font-bold text-ink">
          Доступно на тарифе {flag === 'pro' ? 'PRO' : 'PRO+'}
        </p>
        <p className="max-w-xs text-xs text-body">
          Откройте расширенную аналитику, прогноз и сценарии экономии.
        </p>
        <Link
          href="/pricing"
          className="press mt-1 rounded-full bg-accent px-5 py-2.5 text-xs font-bold text-white transition hover:bg-accent-deep"
        >
          Посмотреть тарифы
        </Link>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const toast = useToast();
  const { plan, limit, money, ready } = useAppStore();

  const [subs, setSubs] = useState<Sub[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('overview');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Сервисы');
  const [price, setPrice] = useState('');
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [day, setDay] = useState('15');
  const [usage, setUsage] = useState<'low' | 'medium' | 'high'>('medium');
  const [saving, setSaving] = useState(false);

  async function fetchSubs() {
    setLoading(true);
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(`Не удалось загрузить подписки: ${error.message}`);
    } else if (data) {
      setSubs(data as Sub[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchSubs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeSubs = useMemo(() => subs.filter(isActive), [subs]);
  const sum = useMemo(() => totals(subs), [subs]);
  const recs = useMemo(() => computeRecs(subs), [subs]);
  const slices = useMemo(() => byCategory(activeSubs), [activeSubs]);
  const donutSlices = useMemo(
    () => slices.map((s) => ({ label: s.label, color: s.color, value: s.amount })),
    [slices],
  );
  const series = useMemo(() => monthlySeries(subs), [subs]);
  const next30 = useMemo(() => upcoming(subs, 30), [subs]);
  const fc = useMemo(
    () => forecast(sum.monthly, recs.saving),
    [sum.monthly, recs.saving],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return subs.filter((s) => {
      const okSearch =
        !q ||
        String(s.name).toLowerCase().includes(q) ||
        String(s.category || '').toLowerCase().includes(q);
      const okStatus = statusFilter === 'all' || s.status === statusFilter;
      return okSearch && okStatus;
    });
  }, [subs, search, statusFilter]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const value = parseFloat(price);
    if (!name.trim() || !Number.isFinite(value) || value <= 0) {
      toast.warn('Укажите название и цену больше нуля');
      return;
    }
    if (activeSubs.length >= limit) {
      toast.warn(`На тарифе ${plan.toUpperCase()} лимит ${limit} активных подписок — откройте PRO`);
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('subscriptions').insert([
      {
        name: name.trim(),
        category,
        price: value,
        currency: 'RUB',
        period,
        status: 'active',
        usage,
        next_payment: nextPaymentDateForDay(parseInt(day, 10) || 15),
      },
    ]);
    setSaving(false);
    if (error) {
      toast.error(`База не приняла запись: ${error.message}`);
      return;
    }
    toast.ok(`Подписка «${name.trim()}» добавлена`);
    setName('');
    setPrice('');
    setModalOpen(false);
    fetchSubs();
  }

  async function patchSub(id: string, patch: Partial<Sub>, okText: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update(patch)
      .eq('id', id)
      .select();

    if (error) {
      toast.error(`База не приняла изменение: ${error.message}`);
      return;
    }
    if (!data || data.length === 0) {
      toast.warn('База не разрешает UPDATE для анонимных пользователей (RLS). Выполните SQL-политики из инструкции.');
      return;
    }
    toast.ok(okText);
    fetchSubs();
  }

  async function removeSub(id: string, label: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      toast.error(`База не приняла удаление: ${error.message}`);
      return;
    }
    if (!data || data.length === 0) {
      toast.warn('База не разрешает DELETE для анонимных пользователей (RLS). Выполните SQL-политики из инструкции.');
      return;
    }
    toast.ok(`Подписка «${label}» удалена`);
    fetchSubs();
  }

  function cycleUsage(sub: Sub) {
    const order = USAGE_ORDER as unknown as string[];
    const next = order[(order.indexOf(usageOf(sub)) + 1) % order.length];
    patchSub(sub.id, { usage: next }, `«${sub.name}»: использование — ${USAGE[next].label.toLowerCase()}`);
  }

  function pickFromCatalog(id: string) {
    const item = CATALOG.find((c) => c.id === id);
    if (!item) return;
    setName(item.name);
    setPrice(String(item.price));
    setCategory(categoryLabel(item.cat));
  }

  const monthTotal30 = next30.reduce((a, u) => a + u.amount, 0);

  return (
    <div className="min-h-screen bg-bg pb-24 lg:pb-10">
      {/* шапка */}
      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="SUBSCOPE — на главную">
            <Logo size={32} />
            <span className="font-display text-sm font-black tracking-[0.16em] text-ink">
              SUBSCOPE
            </span>
          </Link>
          <span className="rounded-full bg-ink px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
            {plan === 'free' ? 'FREE' : plan === 'pro' ? 'PRO' : 'PRO+'}
          </span>

          <nav className="ml-4 hidden items-center gap-1 lg:flex">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`press flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-bold transition ${
                  tab === t.id ? 'bg-ink text-white shadow-sm' : 'text-body hover:bg-white'
                }`}
              >
                <Icon name={t.icon} size={15} />
                {t.label}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/settings"
              className="press grid size-10 place-items-center rounded-xl border border-line bg-white text-ink transition hover:border-ink/30"
              title="Настройки"
              aria-label="Настройки"
            >
              <Icon name="settings" size={18} />
            </Link>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="press hidden items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-[13px] font-bold text-white shadow-lift transition hover:bg-accent-deep sm:flex"
            >
              <Icon name="plus" size={16} /> Добавить
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* ОБЗОР */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-black text-ink sm:text-3xl">
                  Обзор расходов
                </h1>
                <p className="mt-1 text-sm text-body">
                  {activeSubs.length} активных · всего записей {subs.length}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-line bg-white p-10 text-center text-sm text-mute">
                Загружаем данные из Supabase…
              </div>
            ) : subs.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-line bg-white p-10 text-center shadow-card sm:p-14">
                <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent-soft text-accent">
                  <Icon name="receipt" size={26} />
                </span>
                <h2 className="mt-5 font-display text-xl font-black text-ink sm:text-2xl">
                  Пока нет ни одной подписки
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-body">
                  Добавьте первую подписку — SUBSCOPE посчитает стоимость за месяц, покажет
                  ближайшие списания и подскажет, где вы переплачиваете.
                </p>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="press mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-white shadow-lift transition hover:bg-accent-deep"
                >
                  <Icon name="plus" size={16} /> Добавить подписку
                </button>
                <p className="mt-3 text-[11px] text-mute">
                  Можно выбрать сервис из каталога — цена подставится сама
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    label="Расходы / мес"
                    value={ready ? money(sum.monthly) : fmt(sum.monthly)}
                    hint={`прогноз за год ~${fmt(sum.yearly)}`}
                  />
                  <StatCard
                    label="За 5 лет"
                    value={fmt(sum.fiveYears)}
                    hint="если ничего не менять"
                  />
                  <StatCard
                    label="Активные сервисы"
                    value={String(activeSubs.length)}
                    hint={`следующее списание ${sum.next ? fmtDate(isoDate(sum.next.date)) : '—'}`}
                  />
                  <StatCard
                    label="Можно сохранить"
                    value={`${fmt(recs.saving)} / мес`}
                    hint={`${fmt(recs.saving * 12)} за год по рекомендациям`}
                    tone="save"
                  />
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                  <section className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-7">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="font-display text-lg font-bold text-ink">
                        Ближайшие списания
                      </h2>
                      <button
                        type="button"
                        onClick={() => setTab('calendar')}
                        className="press text-xs font-bold text-accent hover:underline"
                      >
                        весь календарь
                      </button>
                    </div>
                    {next30.length === 0 ? (
                      <p className="mt-6 rounded-2xl border border-dashed border-line p-6 text-center text-xs text-mute">
                        Ближайших списаний нет — добавьте подписки.
                      </p>
                    ) : (
                      <ul className="mt-4 space-y-2">
                        {next30.slice(0, 4).map((u) => (
                          <li
                            key={`${u.sub.id}-${u.date}`}
                            className="flex items-center gap-3 rounded-2xl bg-bg px-4 py-3"
                          >
                            <span
                              className="grid size-9 shrink-0 place-items-center rounded-xl font-mono text-xs font-bold text-white"
                              style={{ background: categoryColor(String(u.sub.category)) }}
                            >
                              {String(u.sub.name)[0]}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-bold text-ink">
                                {u.sub.name}
                              </span>
                              <span className="block text-[11px] text-mute">
                                {fmtDate(isoDate(u.date))} · {relDays(isoDate(u.date))}
                              </span>
                            </span>
                            <span className="num shrink-0 font-mono text-sm font-bold text-ink">
                              {fmt(u.amount)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="mt-4 rounded-2xl bg-bg px-4 py-3 text-xs text-body">
                      Итого будущих списаний за 30 дней:{' '}
                      <span className="num font-bold text-ink">{fmt(monthTotal30)}</span>
                    </p>
                  </section>

                  <section className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-7">
                    <h2 className="font-display text-lg font-bold text-ink">Структура расходов</h2>
                    {slices.length === 0 ? (
                      <p className="mt-6 rounded-2xl border border-dashed border-line p-6 text-center text-xs text-mute">
                        Пока нечего показать.
                      </p>
                    ) : (
                      <div className="mt-5">
                        <DonutChart
                          slices={donutSlices}
                          centerValue={fmt(sum.monthly)}
                          centerLabel="в месяц"
                        />
                      </div>
                    )}
                  </section>
                </div>

                {recs.list.length > 0 && (
                  <section className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-7">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="font-display text-lg font-bold text-ink">
                        Что можно оптимизировать
                      </h2>
                      <button
                        type="button"
                        onClick={() => setTab('savings')}
                        className="press text-xs font-bold text-accent hover:underline"
                      >
                        все рекомендации
                      </button>
                    </div>
                    <ul className="mt-4 grid gap-2.5 md:grid-cols-3">
                      {recs.list.slice(0, 3).map((r) => {
                        const meta = recMeta(r.type);
                        return (
                          <li key={r.key} className="rounded-2xl border border-line p-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${REC_TONE[meta.tone]}`}
                            >
                              <Icon name={REC_ICON[r.type]} size={12} />
                              {meta.label}
                            </span>
                            <p className="mt-2.5 text-sm font-bold text-ink">{r.title}</p>
                            <p className="mt-1 text-xs leading-relaxed text-body">{r.text}</p>
                            <p className="num mt-2.5 font-mono text-xs font-bold text-save">
                              экономия {fmt(r.saving)} / мес
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                )}
              </>
            )}
          </div>
        )}

        {/* ПОДПИСКИ */}
        {tab === 'subs' && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="font-display text-2xl font-black text-ink sm:text-3xl">Подписки</h1>
                <p className="mt-1 text-sm text-body">
                  Нажмите на отметку использования, чтобы уточнить частоту
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="relative">
                  <Icon
                    name="search"
                    size={15}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mute"
                  />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Поиск по названию…"
                    className="w-full rounded-full border border-line bg-white py-2.5 pl-9 pr-4 text-xs font-semibold text-ink outline-none transition focus:border-accent sm:w-56"
                  />
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  aria-label="Фильтр по статусу"
                  className="rounded-full border border-line bg-white px-3.5 py-2.5 text-xs font-semibold text-ink outline-none transition focus:border-accent"
                >
                  <option value="all">Все статусы</option>
                  <option value="active">Активные</option>
                  <option value="paused">На паузе</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-line bg-white p-10 text-center text-sm text-mute">
                Загружаем данные из Supabase…
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-line bg-white p-12 text-center">
                <p className="text-sm font-bold text-ink">Подписок не найдено</p>
                <p className="mt-1.5 text-xs text-body">
                  Добавьте первую подписку или сбросьте фильтры поиска.
                </p>
                <div className="mt-5 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setStatusFilter('all');
                    }}
                    className="press rounded-full border border-line px-4 py-2.5 text-xs font-bold text-ink transition hover:border-ink/30"
                  >
                    Сбросить фильтры
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="press rounded-full bg-accent px-4 py-2.5 text-xs font-bold text-white transition hover:bg-accent-deep"
                  >
                    Добавить подписку
                  </button>
                </div>
              </div>
            ) : (
              <>
                <ul className="space-y-2.5">
                  {filtered.map((sub) => {
                  const analysis = calcSub(sub, recs.list);
                  const active = isActive(sub);
                  return (
                    <li
                      key={sub.id}
                      className="rounded-3xl border border-line bg-white p-4 shadow-card transition hover:border-ink/25 sm:p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex min-w-0 flex-1 items-center gap-3.5">
                          <span
                            className="grid size-11 shrink-0 place-items-center rounded-2xl font-display text-sm font-black text-white"
                            style={{ background: categoryColor(String(sub.category)) }}
                          >
                            {String(sub.name)[0]}
                          </span>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="truncate text-sm font-bold text-ink sm:text-base">
                                {sub.name}
                              </p>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                  active ? 'bg-save-bg text-save' : 'bg-warn-bg text-warn'
                                }`}
                              >
                                {STATUS_LABEL[String(sub.status)] || sub.status}
                              </span>
                            </div>
                            <p className="mt-0.5 text-[11px] text-mute">
                              {categoryLabel(String(sub.category))} · {periodLabel(sub.period)} ·
                              списание {fmtDate(sub.next_payment)}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                          <button
                            type="button"
                            onClick={() => cycleUsage(sub)}
                            title={USAGE[usageOf(sub)].hint}
                            className={`press rounded-full px-3 py-1.5 text-[11px] font-bold transition ${USAGE_TONE[usageOf(sub)]}`}
                          >
                            {USAGE[usageOf(sub)].label}
                          </button>
                          <div className="text-right">
                            <p className="num font-display text-base font-black text-ink">
                              {fmt(Number(sub.price))}
                            </p>
                            <p className="num text-[10px] text-mute">
                              ≈ {fmt(analysis.monthly_cost)} / мес
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                patchSub(
                                  sub.id,
                                  { status: active ? 'paused' : 'active' },
                                  active
                                    ? `«${sub.name}» поставлена на паузу`
                                    : `«${sub.name}» возобновлена`,
                                )
                              }
                              title={active ? 'Поставить на паузу' : 'Возобновить'}
                              aria-label={active ? 'Поставить на паузу' : 'Возобновить'}
                              className={`press grid size-9 place-items-center rounded-xl transition ${
                                active
                                  ? 'bg-warn-bg text-warn hover:brightness-95'
                                  : 'bg-save-bg text-save hover:brightness-95'
                              }`}
                            >
                              <Icon name={active ? 'pause' : 'play'} size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeSub(sub.id, String(sub.name))}
                              title="Удалить подписку"
                              aria-label="Удалить подписку"
                              className="press grid size-9 place-items-center rounded-xl bg-danger-bg text-danger transition hover:brightness-95"
                            >
                              <Icon name="trash" size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
                </ul>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="press flex w-full items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-line bg-white/60 py-4 text-sm font-bold text-body transition hover:border-accent hover:text-accent"
                >
                  <Icon name="plus" size={16} /> Добавить подписку
                </button>
              </>
            )}
          </div>
        )}

        {/* АНАЛИТИКА */}
        {tab === 'analytics' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl font-black text-ink sm:text-3xl">Аналитика</h1>
              <p className="mt-1 text-sm text-body">
                Категории, динамика по месяцам и прогноз на год вперёд
              </p>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-line bg-white p-10 text-center text-sm text-mute">
                Загружаем данные из Supabase…
              </div>
            ) : (
              <>
                <div className="grid gap-6 lg:grid-cols-2">
                  <section className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-7">
                    <h2 className="font-display text-lg font-bold text-ink">По категориям</h2>
                    {slices.length === 0 ? (
                      <p className="mt-6 rounded-2xl border border-dashed border-line p-6 text-center text-xs text-mute">
                        Нет активных подписок.
                      </p>
                    ) : (
                      <div className="mt-5">
                        <DonutChart
                          slices={donutSlices}
                          centerValue={fmt(sum.monthly)}
                          centerLabel="в месяц"
                        />
                      </div>
                    )}
                  </section>

                  <section className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-7">
                    <h2 className="font-display text-lg font-bold text-ink">Динамика по месяцам</h2>
                    <div className="mt-5">
                      <SeriesChart points={series} />
                    </div>
                  </section>
                </div>

                {hasFeature(plan, 'forecast') ? (
                  <section className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h2 className="font-display text-lg font-bold text-ink">
                        Прогноз на 12 месяцев
                      </h2>
                      <span className="rounded-full bg-save-bg px-3 py-1.5 text-xs font-bold text-save">
                        экономия за год {fmt(recs.saving * 12)}
                      </span>
                    </div>
                    <div className="mt-5">
                      <ForecastChart raw={fc.raw} optimized={fc.optimized} />
                    </div>
                    <p className="mt-4 text-xs leading-relaxed text-body">
                      Пунктир — расходы, если ничего не менять. Зелёная линия — тот же набор
                      подписок после применения рекомендаций: разница к концу года{' '}
                      <span className="num font-bold text-save">{fmt(recs.saving * 12)}</span>.
                    </p>
                  </section>
                ) : (
                  <Locked flag="pro">
                    <h2 className="font-display text-lg font-bold text-ink">Прогноз на 12 месяцев</h2>
                    <div className="mt-5">
                      <ForecastChart raw={fc.raw} optimized={fc.optimized} />
                    </div>
                  </Locked>
                )}
              </>
            )}
          </div>
        )}

        {/* ЭКОНОМИЯ */}
        {tab === 'savings' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-black text-ink sm:text-3xl">Экономия</h1>
                <p className="mt-1 text-sm text-body">
                  Конкретные шаги с суммами, а не общие советы
                </p>
              </div>
              <div className="rounded-3xl border border-save-line bg-save-bg px-5 py-3 text-right">
                <p className="text-[10px] font-black uppercase tracking-wider text-save/80">
                  потенциал
                </p>
                <p className="num font-display text-xl font-black text-save">
                  <CountUp value={recs.saving} format={(n) => fmt(n)} /> / мес
                </p>
              </div>
            </div>

            {hasFeature(plan, 'scenarios') ? (
              <div className="flex flex-wrap gap-2">
                {SCENARIOS.map((s) => (
                  <div
                    key={s.id}
                    className="flex-1 rounded-2xl border border-line bg-white p-4 shadow-card"
                  >
                    <p className="text-xs font-black uppercase tracking-wider text-mute">
                      {s.label}
                    </p>
                    <p className="num mt-1.5 font-display text-lg font-black text-ink">
                      {fmt(scenarioSavings(recs.list, s))} / мес
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-body">{s.hint}</p>
                  </div>
                ))}
              </div>
            ) : (
              <Locked flag="pro_plus">
                <div className="flex flex-wrap gap-2">
                  {SCENARIOS.map((s) => (
                    <div key={s.id} className="flex-1 rounded-2xl border border-line bg-bg p-4">
                      <p className="text-xs font-black uppercase tracking-wider text-mute">
                        {s.label}
                      </p>
                      <p className="num mt-1.5 font-display text-lg font-black text-ink">
                        {fmt(scenarioSavings(recs.list, s))} / мес
                      </p>
                    </div>
                  ))}
                </div>
              </Locked>
            )}

            {loading ? (
              <div className="rounded-3xl border border-line bg-white p-10 text-center text-sm text-mute">
                Загружаем данные из Supabase…
              </div>
            ) : recs.list.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-line bg-white p-12 text-center">
                <p className="text-sm font-bold text-ink">Рекомендаций пока нет</p>
                <p className="mt-1.5 text-xs text-body">
                  Добавьте подписки и отметьте, как часто ими пользуетесь, — движок подскажет, где
                  сэкономить.
                </p>
              </div>
            ) : (
              <ul className="space-y-2.5">
                {recs.list.map((r) => {
                  const meta = recMeta(r.type);
                  return (
                    <li
                      key={r.key}
                      className="flex flex-col gap-3 rounded-3xl border border-line bg-white p-5 shadow-card sm:flex-row sm:items-center"
                    >
                      <span
                        className={`grid size-11 shrink-0 place-items-center rounded-2xl ${REC_TONE[meta.tone]}`}
                      >
                        <Icon name={REC_ICON[r.type]} size={20} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-black uppercase tracking-wider text-mute">
                          {meta.label}
                        </p>
                        <p className="mt-0.5 text-sm font-bold text-ink">{r.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-body">{r.text}</p>
                      </div>
                      <div className="shrink-0 text-left sm:text-right">
                        <p className="num font-display text-base font-black text-save">
                          {fmt(r.saving)} / мес
                        </p>
                        <p className="mt-1 max-w-[220px] text-[11px] leading-snug text-mute">
                          {r.action}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {/* КАЛЕНДАРЬ */}
        {tab === 'calendar' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl font-black text-ink sm:text-3xl">
                Календарь списаний
              </h1>
              <p className="mt-1 text-sm text-body">Ближайшие 30 дней по датам платежей</p>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-line bg-white p-10 text-center text-sm text-mute">
                Загружаем данные из Supabase…
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  <StatCard
                    label="Списаний за 30 дней"
                    value={String(next30.length)}
                    hint="по активным подпискам"
                  />
                  <StatCard
                    label="Сумма за 30 дней"
                    value={fmt(monthTotal30)}
                    hint="все ближайшие платежи"
                  />
                  <StatCard
                    label="Крупнейший платёж"
                    value={
                      next30.length
                        ? fmt(Math.max(...next30.map((u) => u.amount)))
                        : '—'
                    }
                    hint={
                      next30.length
                        ? next30.reduce((a, b) => (b.amount > a.amount ? b : a)).sub.name
                        : 'нет платежей'
                    }
                  />
                </div>

                {next30.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-line bg-white p-12 text-center">
                    <p className="text-sm font-bold text-ink">Списаний не запланировано</p>
                    <p className="mt-1.5 text-xs text-body">
                      У активных подписок нет даты следующего платежа — укажите день списания при
                      добавлении.
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-2.5">
                    {next30.map((u) => (
                      <li
                        key={`${u.sub.id}-${u.date}`}
                        className="flex items-center gap-4 rounded-3xl border border-line bg-white p-4 shadow-card sm:p-5"
                      >
                        <div className="w-14 shrink-0 text-center">
                          <p className="num font-display text-lg font-black text-ink">
                            {new Date(u.date).getDate()}
                          </p>
                          <p className="text-[10px] uppercase text-mute">
                            {new Date(u.date).toLocaleDateString('ru-RU', { month: 'short' }).replace('.', '')}
                          </p>
                        </div>
                        <span
                          className="grid size-10 shrink-0 place-items-center rounded-xl font-mono text-xs font-bold text-white"
                          style={{ background: categoryColor(String(u.sub.category)) }}
                        >
                          {String(u.sub.name)[0]}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-ink">{u.sub.name}</p>
                          <p className="text-[11px] text-mute">
                            {relDays(isoDate(u.date))} · {periodLabel(u.sub.period)}
                          </p>
                        </div>
                        <p className="num shrink-0 font-mono text-sm font-bold text-ink">
                          {fmt(u.amount)}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* плавающая кнопка добавления на мобильных и планшетах */}
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        aria-label="Добавить подписку"
        title="Добавить подписку"
        className="press fixed bottom-20 right-4 z-40 grid size-14 place-items-center rounded-full bg-accent text-white shadow-pop transition hover:bg-accent-deep lg:hidden"
      >
        <Icon name="plus" size={22} />
      </button>

      {/* нижняя навигация на мобильных */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur-md lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? 'page' : undefined}
              className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold transition ${
                tab === t.id ? 'text-accent' : 'text-mute'
              }`}
            >
              <Icon name={t.icon} size={20} />
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* модальное окно добавления */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/45 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Добавить подписку"
        >
          <div className="slide-up max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-pop sm:rounded-3xl sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-ink">Новая подписка</h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Закрыть"
                className="press grid size-9 place-items-center rounded-xl border border-line text-mute transition hover:text-ink"
              >
                <Icon name="x" size={16} />
              </button>
            </div>

            <p className="mt-1.5 text-xs text-body">
              Выберите сервис из каталога — поля заполнятся сами, или впишите вручную.
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {CATALOG.slice(0, 8).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => pickFromCatalog(c.id)}
                  className="press flex items-center gap-1.5 rounded-full border border-line bg-bg px-2.5 py-1.5 text-[11px] font-semibold text-body transition hover:border-accent hover:text-ink"
                >
                  <span
                    className="size-2 rounded-full"
                    style={{ background: c.color }}
                  />
                  {c.short ?? c.name}
                </button>
              ))}
            </div>

            <form onSubmit={handleAdd} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-body" htmlFor="sub-name">
                  Название сервиса
                </label>
                <input
                  id="sub-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    const hit = catalogByName(e.target.value);
                    if (hit) {
                      setPrice(String(hit.price));
                      setCategory(categoryLabel(hit.cat));
                    }
                  }}
                  placeholder="например, Яндекс Плюс"
                  className="w-full rounded-2xl border border-line bg-bg/60 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-body" htmlFor="sub-price">
                    Цена, ₽
                  </label>
                  <input
                    id="sub-price"
                    type="number"
                    min="1"
                    step="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="299"
                    className="w-full rounded-2xl border border-line bg-bg/60 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-body" htmlFor="sub-day">
                    День списания
                  </label>
                  <input
                    id="sub-day"
                    type="number"
                    min="1"
                    max="31"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className="w-full rounded-2xl border border-line bg-bg/60 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold text-body" htmlFor="sub-period">
                    Период
                  </label>
                  <select
                    id="sub-period"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as 'week' | 'month' | 'year')}
                    className="w-full rounded-2xl border border-line bg-bg/60 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
                  >
                    {Object.entries(PERIODS)
                      .filter(([k]) => k === 'week' || k === 'month' || k === 'year')
                      .map(([k, v]) => (
                        <option key={k} value={k}>
                          {v.label}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-body" htmlFor="sub-usage">
                    Как пользуетесь
                  </label>
                  <select
                    id="sub-usage"
                    value={usage}
                    onChange={(e) => setUsage(e.target.value as 'low' | 'medium' | 'high')}
                    className="w-full rounded-2xl border border-line bg-bg/60 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
                  >
                    {USAGE_ORDER.map((u) => (
                      <option key={u} value={u}>
                        {USAGE[u].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-body" htmlFor="sub-cat">
                  Категория
                </label>
                <select
                  id="sub-cat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-2xl border border-line bg-bg/60 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
                >
                  {Object.values(CATEGORIES).map((c) => (
                    <option key={c.label} value={c.label}>
                      {c.label}
                    </option>
                  ))}
                  {!Object.values(CATEGORIES).some((c) => c.label === category) && (
                    <option value={category}>{category}</option>
                  )}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="press flex-1 rounded-2xl border border-line py-3 text-sm font-bold text-body transition hover:bg-bg"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="press flex-1 rounded-2xl bg-accent py-3 text-sm font-bold text-white transition hover:bg-accent-deep disabled:opacity-60"
                >
                  {saving ? 'Сохраняем…' : 'Сохранить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
