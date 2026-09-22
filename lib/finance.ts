import { CATALOG, CATEGORIES, CONFIG, DUP_CATS, PERIODS, USAGE, catalogByName } from './config';

export interface Sub {
  id: string;
  name: string;
  category?: string | null;
  price: number;
  currency?: string | null;
  period?: string | null;
  next_payment?: string | null;
  status?: string | null;
  usage?: string | null;
  note?: string | null;
  created_at?: string | null;
}

export type RecType = 'unused' | 'tariff' | 'duplicate' | 'annual' | 'share';

export interface Recommendation {
  key: string;
  type: RecType;
  subId: string | null;
  subName: string;
  title: string;
  text: string;
  action: string;
  saving: number; // ₽ в месяц
}

export interface Scenario {
  id: 'careful' | 'optimal' | 'max';
  label: string;
  hint: string;
  types: RecType[] | null;
}

export const SCENARIOS: Scenario[] = [
  { id: 'careful', label: 'Аккуратный', hint: 'Без потери доступа: смена тарифа и оплата года', types: ['annual', 'tariff'] },
  { id: 'optimal', label: 'Оптимальный', hint: 'Плюс отмена подписок, которыми вы почти не пользуетесь', types: ['annual', 'tariff', 'unused'] },
  { id: 'max', label: 'Максимальный', hint: 'Плюс отказ от дублирующих сервисов', types: null },
];

const DAY = 86_400_000;

export function today() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function plural(n: number, one: string, few: string, many: string) {
  const abs = Math.abs(n) % 100;
  const n1 = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (n1 > 1 && n1 < 5) return few;
  if (n1 === 1) return one;
  return many;
}

export function fmt(amount: number, currency = 'RUB', decimals = 0) {
  const symbol = CONFIG.currencies[currency]?.symbol || '₽';
  return `${amount.toLocaleString('ru-RU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })} ${symbol}`;
}

export function parseDate(value?: string | null): Date | null {
  if (!value) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
  if (!m) {
    const d = new Date(String(value));
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function isoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function fmtDate(value?: string | null) {
  const d = parseDate(value);
  if (!d) return 'дата не указана';
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}

export function daysUntil(value?: string | null) {
  const d = parseDate(value);
  if (!d) return null;
  return Math.round((d.getTime() - today().getTime()) / DAY);
}

export function relDays(value?: string | null) {
  const n = daysUntil(value);
  if (n === null) return '';
  if (n < 0) return `${Math.abs(n)} ${plural(Math.abs(n), 'день', 'дня', 'дней')} назад`;
  if (n === 0) return 'сегодня';
  if (n === 1) return 'завтра';
  return `через ${n} ${plural(n, 'день', 'дня', 'дней')}`;
}

function addMonths(d: Date, n: number) {
  const first = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  return new Date(first.getFullYear(), first.getMonth(), Math.min(d.getDate(), last));
}

export function periodMonths(period?: string | null) {
  return PERIODS[period || 'month']?.months ?? 1;
}

export function periodLabel(period?: string | null) {
  return PERIODS[period || 'month']?.label || 'Раз в месяц';
}

export function rateOf(currency?: string | null) {
  return CONFIG.currencies[currency || 'RUB']?.rate ?? 1;
}

/** monthly_cost: сколько подписка стоит в месяц в рублях */
export function monthly(sub: Sub) {
  return (Number(sub.price) || 0) * rateOf(sub.currency) / periodMonths(sub.period);
}

/** yearly_cost */
export function yearly(sub: Sub) {
  return monthly(sub) * 12;
}

export function usageOf(sub: Sub) {
  return USAGE[sub.usage || ''] ? (sub.usage as string) : 'medium';
}

export function isActive(sub: Sub) {
  return (sub.status || 'active') === 'active';
}

/** Ближайшая дата списания: next_payment, продвинутый вперёд до сегодня */
export function nextPayment(sub: Sub): Date | null {
  const start = parseDate(sub.next_payment);
  if (!start || !isActive(sub)) return null;
  const months = periodMonths(sub.period);
  let d = start;
  if ((sub.period || 'month') === 'week') {
    while (d < today()) d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7);
    return d;
  }
  let guard = 0;
  while (d < today() && guard < 400) {
    d = addMonths(d, Math.max(1, Math.round(months)));
    guard += 1;
  }
  return d;
}

export function nextPaymentIso(sub: Sub) {
  const d = nextPayment(sub);
  return d ? isoDate(d) : null;
}

/** Следующая дата списания для указанного дня месяца (с учётом коротких месяцев) */
export function nextPaymentDateForDay(day: number, from = today()) {
  const clamped = Math.min(Math.max(Math.round(day) || 1, 1), 31);
  const build = (year: number, month: number) => {
    const last = new Date(year, month + 1, 0).getDate();
    return new Date(year, month, Math.min(clamped, last));
  };
  const date = build(from.getFullYear(), from.getMonth());
  return isoDate(date < from ? build(from.getFullYear(), from.getMonth() + 1) : date);
}

export function paymentDayOf(sub: Sub) {
  const d = parseDate(sub.next_payment);
  return d ? d.getDate() : null;
}

/** Все списания подписки в диапазоне [from, to] */
export function charges(sub: Sub, from: Date, to: Date): Date[] {
  const start = parseDate(sub.next_payment);
  if (!start) return [];

  const advance = makeAdvancer(sub);
  const out: Date[] = [];
  let d = start;

  // отматываем назад, если первое списание раньше диапазона
  let guard = 0;
  while (d > from && guard < 600) {
    d = advance(d, -1);
    guard += 1;
  }
  while (d < from && guard < 1200) {
    d = advance(d, 1);
    guard += 1;
  }
  guard = 0;
  while (d <= to && guard < 600) {
    out.push(d);
    d = advance(d, 1);
    guard += 1;
  }
  return out;
}

function makeAdvancer(sub: Sub) {
  const months = Math.max(1, Math.round(periodMonths(sub.period)));
  const weekly = (sub.period || 'month') === 'week';
  return (d: Date, k: number) =>
    weekly
      ? new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7 * k)
      : addMonths(d, months * k);
}

export interface UpcomingItem {
  date: Date;
  sub: Sub;
  amount: number;
}

export function upcoming(subs: Sub[], days = 30): UpcomingItem[] {
  const from = today();
  const to = new Date(from.getTime() + days * DAY);
  const out: UpcomingItem[] = [];
  subs.filter(isActive).forEach(sub => {
    charges(sub, from, to).forEach(date => {
      out.push({ date, sub, amount: (Number(sub.price) || 0) * rateOf(sub.currency) });
    });
  });
  return out.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export interface Totals {
  monthly: number;
  yearly: number;
  count: number;
  fiveYears: number;
  next: { date: Date; sub: Sub } | null;
}

export function totals(subs: Sub[]): Totals {
  const active = subs.filter(isActive);
  const m = active.reduce((acc, s) => acc + monthly(s), 0);
  let next: Totals['next'] = null;
  active.forEach(s => {
    const d = nextPayment(s);
    if (d && (!next || d < next.date)) next = { date: d, sub: s };
  });
  return { monthly: m, yearly: m * 12, count: active.length, fiveYears: m * 60, next };
}

export interface CategorySlice {
  key: string;
  label: string;
  color: string;
  amount: number;
  percent: number;
  count: number;
}

/** Категория из базы: может быть id из каталога, человекочитаемое название или свой текст */
export function categoryOf(raw?: string | null): { key: string; label: string; color: string } {
  const value = String(raw || '').trim();
  if (!value) return { key: 'other', label: CATEGORIES.other.label, color: CATEGORIES.other.color };
  if (CATEGORIES[value]) {
    return { key: value, label: CATEGORIES[value].label, color: CATEGORIES[value].color };
  }
  const byLabel = Object.entries(CATEGORIES).find(
    ([, c]) => c.label.toLowerCase() === value.toLowerCase(),
  );
  if (byLabel) return { key: byLabel[0], label: byLabel[1].label, color: byLabel[1].color };
  const guess = catalogByName(value);
  if (guess) return { key: guess.cat, label: CATEGORIES[guess.cat].label, color: CATEGORIES[guess.cat].color };
  return { key: `custom:${value.toLowerCase()}`, label: value, color: CATEGORIES.other.color };
}

export function byCategory(subs: Sub[], total?: number): CategorySlice[] {
  const map = new Map<string, CategorySlice>();
  subs.filter(isActive).forEach(sub => {
    const cat = categoryOf(sub.category);
    const amount = monthly(sub);
    const prev = map.get(cat.key);
    if (prev) {
      prev.amount += amount;
      prev.count += 1;
    } else {
      map.set(cat.key, { key: cat.key, label: cat.label, color: cat.color, amount, percent: 0, count: 1 });
    }
  });
  const sum = total ?? [...map.values()].reduce((acc, s) => acc + s.amount, 0);
  return [...map.values()]
    .map(s => ({ ...s, amount: Math.round(s.amount), percent: sum > 0 ? Math.round((s.amount / sum) * 100) : 0 }))
    .sort((a, b) => b.amount - a.amount);
}

/**
 * annual_projection: сколько спишется за ближайшие 12 месяцев
 * potential_saving: экономия в месяц из рекомендаций
 */
export function calcSub(sub: Sub, recs?: Recommendation[]) {
  const from = today();
  const to = new Date(from.getTime() + 364 * DAY);
  const list = recs || computeRecs([sub]).list;
  const rec = list.find(r => r.subId === sub.id);
  return {
    monthly_cost: Math.round(monthly(sub)),
    yearly_cost: Math.round(yearly(sub)),
    category: categoryOf(sub.category).label,
    next_payment: nextPaymentIso(sub),
    annual_projection: Math.round(charges(sub, from, to).length * (Number(sub.price) || 0) * rateOf(sub.currency)),
    potential_saving: Math.round(rec?.saving || 0),
  };
}

const REC_META: Record<RecType, { label: string; tone: 'warn' | 'save' | 'info' }> = {
  unused: { label: 'Неиспользуемая подписка', tone: 'warn' },
  tariff: { label: 'Есть более выгодный тариф', tone: 'save' },
  duplicate: { label: 'Несколько похожих сервисов', tone: 'warn' },
  annual: { label: 'Можно сэкономить', tone: 'save' },
  share: { label: 'Большая доля расходов', tone: 'info' },
};

export function recMeta(type: RecType) {
  return REC_META[type];
}

export function computeRecs(subs: Sub[]): { list: Recommendation[]; saving: number } {
  const active = subs.filter(isActive);
  const recs: Recommendation[] = [];
  const used = new Set<string>();
  const total = totals(subs);

  const push = (r: Omit<Recommendation, 'key'>) => {
    recs.push({ ...r, key: `${r.type}:${r.subId || 'all'}` });
  };

  // 1. Редко используемые сервисы
  active
    .filter(s => usageOf(s) === 'low')
    .forEach(s => {
      push({
        type: 'unused',
        subId: s.id,
        subName: s.name,
        title: `${s.name} — ${fmt(monthly(s))} в месяц`,
        text: `Вы отметили, что пользуетесь сервисом редко. Отмена сохранит ${fmt(yearly(s))} в год, а подписку можно вернуть в любой момент.`,
        action: 'Рассмотреть отмену',
        saving: monthly(s),
      });
      used.add(s.id);
    });

  // 2. Похожие сервисы в одной категории
  DUP_CATS.forEach(cat => {
    const group = active.filter(s => categoryOf(s.category).key === cat && !used.has(s.id));
    if (group.length < 2) return;
    const sorted = [...group].sort(
      (a, b) => USAGE[usageOf(a)].rank - USAGE[usageOf(b)].rank || monthly(b) - monthly(a),
    );
    const candidate = sorted[0];
    const best = sorted[sorted.length - 1];
    if (usageOf(candidate) === 'high') return;
    push({
      type: 'duplicate',
      subId: candidate.id,
      subName: candidate.name,
      title: `${candidate.name} и ${best.name} в одной категории`,
      text: `В категории «${CATEGORIES[cat].label}» у вас ${group.length} активных сервиса. Если оставить ${best.name}, экономия составит ${fmt(monthly(candidate))} в месяц.`,
      action: 'Оставить один сервис',
      saving: monthly(candidate),
    });
    used.add(candidate.id);
  });

  // 3. Более дешёвый тариф
  active
    .filter(s => !used.has(s.id) && usageOf(s) === 'medium')
    .forEach(s => {
      const item = CATALOG.find(c => c.name.toLowerCase() === s.name.trim().toLowerCase());
      if (!item?.tiers?.length) return;
      const current = monthly(s);
      const tier = item.tiers.filter(t => t.price < current - 49).sort((a, b) => b.price - a.price)[0];
      if (!tier) return;
      push({
        type: 'tariff',
        subId: s.id,
        subName: s.name,
        title: `${s.name}: тариф «${tier.name}» дешевле`,
        text: `За ${fmt(tier.price)} в месяц доступен тариф «${tier.name}». Если расширенные функции не нужны, экономия — ${fmt(current - tier.price)} в месяц.`,
        action: 'Сравнить тарифы',
        saving: current - tier.price,
      });
      used.add(s.id);
    });

  // 4. Годовая оплата
  active
    .filter(s => !used.has(s.id) && (s.period || 'month') === 'month' && usageOf(s) !== 'low')
    .forEach(s => {
      const item = CATALOG.find(c => c.name.toLowerCase() === s.name.trim().toLowerCase());
      if (!item?.annual) return;
      const m = monthly(s);
      if (m < CONFIG.annualMinMonthly) return;
      push({
        type: 'annual',
        subId: s.id,
        subName: s.name,
        title: `${s.name}: выгоднее оплатить год`,
        text: `Годовая оплата обычно дешевле примерно на ${Math.round(CONFIG.annualDiscount * 100)}%. Это около ${fmt(m * CONFIG.annualDiscount)} в месяц, или ${fmt(m * CONFIG.annualDiscount * 12)} в год.`,
        action: 'Посмотреть выгоду',
        saving: m * CONFIG.annualDiscount,
      });
      used.add(s.id);
    });

  // 5. Информационная: одна категория занимает слишком большую долю
  const cats = byCategory(active, total.monthly);
  if (cats.length > 1 && total.monthly > 0 && cats[0].amount / total.monthly >= 0.45) {
    push({
      type: 'share',
      subId: null,
      subName: cats[0].label,
      title: `${cats[0].percent}% расходов — категория «${cats[0].label}»`,
      text: `Одна категория забирает ${fmt(cats[0].amount)} из ${fmt(total.monthly)} в месяц. Проверьте, все ли сервисы в ней вам нужны.`,
      action: 'Открыть аналитiku',
      saving: 0,
    });
  }

  recs.sort((a, b) => b.saving - a.saving);
  return { list: recs, saving: recs.reduce((acc, r) => acc + r.saving, 0) };
}

export function scenarioSavings(recs: Recommendation[], scenario: Scenario) {
  const filtered = scenario.types ? recs.filter(r => scenario.types!.includes(r.type)) : recs;
  return filtered.reduce((acc, r) => acc + r.saving, 0);
}

/** Расходы по месяцам: прошлые списания + план на ближайшие месяцы */
export function monthlySeries(subs: Sub[], monthsBack = 5, monthsForward = 6) {
  const now = today();
  const out: { label: string; date: Date; amount: number; future: boolean; current: boolean }[] = [];
  for (let i = -monthsBack; i <= monthsForward; i += 1) {
    const from = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const to = new Date(from.getFullYear(), from.getMonth() + 1, 0);
    let amount = 0;
    subs.forEach(sub => {
      if (!isActive(sub)) return;
      charges(sub, from, to).forEach(() => {
        amount += (Number(sub.price) || 0) * rateOf(sub.currency);
      });
    });
    out.push({
      label: from.toLocaleDateString('ru-RU', { month: 'short' }).replace('.', ''),
      date: from,
      amount: Math.round(amount),
      future: i > 0,
      current: i === 0,
    });
  }
  return out;
}

/** Прогноз накопленных расходов за 12 месяцев: как есть и с экономией */
export function forecast(totalMonthly: number, savingMonthly: number) {
  const raw: number[] = [];
  const optimized: number[] = [];
  for (let m = 1; m <= 12; m += 1) {
    raw.push(Math.round(totalMonthly * m));
    optimized.push(Math.round((totalMonthly - savingMonthly) * m));
  }
  return { labels: Array.from({ length: 12 }, (_, i) => `${i + 1}`), raw, optimized };
}
