export type PlanId = 'free' | 'pro' | 'pro_plus';
export type FeatureFlag =
  | 'basic'
  | 'advanced'
  | 'recs'
  | 'forecast'
  | 'calendar'
  | 'history'
  | 'notify'
  | 'scenarios'
  | 'compare'
  | 'reports'
  | 'analysis';

export interface Plan {
  id: PlanId;
  name: string;
  blurb: string;
  price: { month: number; year: number };
  limit: number;
  flags: FeatureFlag[];
  features: string[];
}

const PRO_FLAGS: FeatureFlag[] = [
  'basic',
  'advanced',
  'recs',
  'forecast',
  'calendar',
  'history',
  'notify',
];

export const CONFIG = {
  currencies: {
    RUB: { rate: 1, symbol: '₽', label: 'Российский рубль, ₽' },
    USD: { rate: 90, symbol: '$', label: 'Доллар США, $' },
    EUR: { rate: 98, symbol: '€', label: 'Евро, €' },
  } as Record<string, { rate: number; symbol: string; label: string }>,
  // ориентировочная скидка сервисов при оплате за год
  annualDiscount: 0.17,
  // не предлагаем годовую оплату для совсем дешёвых подписок, ₽/мес
  annualMinMonthly: 149,
  plans: {
    free: {
      id: 'free',
      name: 'FREE',
      blurb: 'Чтобы навести порядок',
      price: { month: 0, year: 0 },
      limit: 5,
      flags: ['basic', 'calendar'],
      features: [
        'До 5 активных подписок',
        'Базовая статистика',
        'Расходы за месяц и год',
        'Календарь ближайших списаний',
      ],
    },
    pro: {
      id: 'pro',
      name: 'PRO',
      blurb: 'Для тех, кто хочет сэкономить',
      price: { month: 399, year: 3490 },
      limit: Number.POSITIVE_INFINITY,
      flags: PRO_FLAGS,
      features: [
        'Неограниченное количество подписок',
        'Расширенная аналитика и история',
        'Рекомендации по экономии',
        'Прогноз расходов на год',
        'Полный календарь списаний',
        'Уведомления о платежах',
      ],
    },
    pro_plus: {
      id: 'pro_plus',
      name: 'PRO+',
      blurb: 'Максимум выгоды',
      price: { month: 699, year: 5990 },
      limit: Number.POSITIVE_INFINITY,
      flags: [...PRO_FLAGS, 'scenarios', 'compare', 'reports', 'analysis'],
      features: [
        'Всё из тарифа PRO',
        'Сценарии экономии',
        'Сравнение тарифов сервисов',
        'Разбор расходов по вашим данным',
        'Расширенные финансовые отчёты',
      ],
    },
  } as Record<PlanId, Plan>,
} as const;

export const PLAN_ORDER: PlanId[] = ['free', 'pro', 'pro_plus'];

export const CATEGORIES: Record<string, { label: string; color: string }> = {
  ai: { label: 'ИИ-сервисы', color: '#4353FF' },
  video: { label: 'Кино и ТВ', color: '#E8552B' },
  music: { label: 'Музыка', color: '#D63A82' },
  cloud: { label: 'Облако', color: '#1789A8' },
  soft: { label: 'Софт', color: '#8347E8' },
  games: { label: 'Игры', color: '#C48800' },
  edu: { label: 'Образование', color: '#0B7F58' },
  vpn: { label: 'VPN', color: '#257575' },
  apps: { label: 'Приложения', color: '#B06E33' },
  other: { label: 'Другое', color: '#7A80A3' },
};

// категории, в которых часто заводят несколько похожих сервисов
export const DUP_CATS = ['ai', 'video', 'music', 'cloud', 'vpn'];

export const PERIODS: Record<
  string,
  { label: string; per: string; months: number }
> = {
  week: { label: 'Раз в неделю', per: 'в неделю', months: 12 / 52 },
  month: { label: 'Раз в месяц', per: 'в месяц', months: 1 },
  quarter: { label: 'Раз в 3 месяца', per: 'в 3 месяца', months: 3 },
  halfyear: { label: 'Раз в полгода', per: 'в полгода', months: 6 },
  year: { label: 'Раз в год', per: 'в год', months: 12 },
};

export const USAGE: Record<string, { label: string; rank: number; hint: string }> = {
  low: { label: 'Редко', rank: 0, hint: 'Открываю пару раз в месяц или реже' },
  medium: { label: 'Иногда', rank: 1, hint: 'Пользуюсь, но не каждый день' },
  high: { label: 'Часто', rank: 2, hint: 'Пользуюсь постоянно' },
};

export const USAGE_ORDER = ['low', 'medium', 'high'] as const;

export const STATUS_LABEL: Record<string, string> = {
  active: 'Активна',
  paused: 'На паузе',
  cancelled: 'Отменена',
};

export interface CatalogItem {
  id: string;
  name: string;
  short?: string;
  cat: string;
  color: string;
  ink?: string;
  price: number;
  annual: boolean;
  tiers: { name: string; price: number }[];
}

/* Каталог сервисов: цены и тарифы — ориентиры для автозаполнения и рекомендаций.
   Их стоит обновлять, условия сервисов меняются. */
export const CATALOG: CatalogItem[] = [
  { id: 'netflix', name: 'Netflix', cat: 'video', color: '#E50914', price: 699, annual: false, tiers: [{ name: 'Базовый с рекламой', price: 399 }] },
  { id: 'spotify', name: 'Spotify', cat: 'music', color: '#1DB954', price: 299, annual: false, tiers: [] },
  { id: 'youtube', name: 'YouTube Premium', cat: 'video', color: '#FF0033', price: 399, annual: false, tiers: [{ name: 'Lite', price: 199 }] },
  { id: 'vkmusic', name: 'VK Музыка', cat: 'music', color: '#0077FF', price: 299, annual: true, tiers: [] },
  { id: 'yandex', name: 'Яндекс Плюс', cat: 'music', color: '#FFCC00', ink: '#171A3A', price: 399, annual: true, tiers: [{ name: 'Базовый', price: 199 }] },
  { id: 'kinopoisk', name: 'Кинопоиск', cat: 'video', color: '#FF5500', price: 299, annual: true, tiers: [] },
  { id: 'chatgpt', name: 'ChatGPT', cat: 'ai', color: '#10A37F', price: 2499, annual: false, tiers: [] },
  { id: 'claude', name: 'Claude', cat: 'ai', color: '#B85C3E', price: 1900, annual: false, tiers: [] },
  { id: 'google', name: 'Google One', cat: 'cloud', color: '#4285F4', price: 299, annual: true, tiers: [{ name: '100 ГБ', price: 149 }] },
  { id: 'icloud', name: 'iCloud+', cat: 'cloud', color: '#3693F5', price: 149, annual: false, tiers: [] },
  { id: 'adobe', name: 'Adobe Creative Cloud', short: 'Adobe CC', cat: 'soft', color: '#EB1000', price: 1990, annual: true, tiers: [{ name: 'Одно приложение', price: 1498 }] },
  { id: 'ms365', name: 'Microsoft 365', cat: 'soft', color: '#D83B01', price: 529, annual: true, tiers: [] },
  { id: 'xbox', name: 'Xbox Game Pass', cat: 'games', color: '#107C10', price: 749, annual: false, tiers: [] },
  { id: 'psplus', name: 'PlayStation Plus', cat: 'games', color: '#003791', price: 699, annual: true, tiers: [] },
  { id: 'telegram', name: 'Telegram Premium', cat: 'apps', color: '#229ED9', price: 299, annual: false, tiers: [] },
  { id: 'vpn', name: 'VPN', cat: 'vpn', color: '#2B8A8A', price: 299, annual: true, tiers: [] },
  { id: 'course', name: 'Онлайн-курсы', cat: 'edu', color: '#0B9A6A', price: 990, annual: true, tiers: [] },
];

export const catalogByName = (name: string) =>
  CATALOG.find(c => c.name.toLowerCase() === String(name || '').trim().toLowerCase());

export function categoryLabel(raw: string) {
  const value = String(raw || '').trim();
  if (!value) return CATEGORIES.other.label;
  if (CATEGORIES[value]) return CATEGORIES[value].label;
  const byLabel = Object.values(CATEGORIES).find(
    (c) => c.label.toLowerCase() === value.toLowerCase(),
  );
  if (byLabel) return byLabel.label;
  const guess = catalogByName(value);
  if (guess) return CATEGORIES[guess.cat].label;
  return value;
}

export function categoryColor(raw: string) {
  const value = String(raw || '').trim();
  if (CATEGORIES[value]) return CATEGORIES[value].color;
  const byLabel = Object.values(CATEGORIES).find(
    (c) => c.label.toLowerCase() === value.toLowerCase(),
  );
  if (byLabel) return byLabel.color;
  const guess = catalogByName(value);
  if (guess) return CATEGORIES[guess.cat].color;
  return CATEGORIES.other.color;
}

export function hasFeature(plan: PlanId, flag: FeatureFlag) {
  return (CONFIG.plans[plan] || CONFIG.plans.free).flags.includes(flag);
}

export function planNeededFor(flag: FeatureFlag): PlanId {
  return (['pro', 'pro_plus'] as PlanId[]).find(p =>
    CONFIG.plans[p].flags.includes(flag),
  ) as PlanId;
}
