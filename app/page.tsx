import Link from 'next/link';
import { CATALOG, CATEGORIES, CONFIG } from '@/lib/config';
import { fmt } from '@/lib/finance';
import { Icon, Logo, type IconName } from '@/components/Icons';
import { Reveal } from '@/components/Reveal';
import { Receipt } from '@/components/Receipt';
import { LossCalc } from '@/components/LossCalc';
import { RecsShowcase } from '@/components/RecsShowcase';
import { Pricing } from '@/components/Pricing';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

const LEAKS: { icon: IconName; title: string; text: string; metric: string }[] = [
  {
    icon: 'clock',
    title: 'Автопродление по умолчанию',
    text: 'Сервисы продлевают подписку молча. Платёж приходит в день, о котором вы не помните.',
    metric: 'до 40% списаний — незапланированные',
  },
  {
    icon: 'layers',
    title: 'Дубли в одной категории',
    text: 'Два онлайн-кинотеатра и две музыки одновременно. Пользуетесь одним — платите за оба.',
    metric: 'в среднем 1 дубль на 6 подписок',
  },
  {
    icon: 'card',
    title: 'Дорогой тариф',
    text: 'Максимальный пакет берут «на всякий случай», хотя базовый закрывает те же задачи.',
    metric: 'переплата 300–1 500 ₽ в месяц',
  },
  {
    icon: 'bell',
    title: 'Пробный период закончился',
    text: 'Бесплатные 30 дней превращаются в регулярный платёж, если не отменить вручную.',
    metric: 'каждый третий забывает отменить',
  },
  {
    icon: 'globe',
    title: 'Подписки «за себя и того парня»',
    text: 'Семейные тарифы и общие аккаунты, за которые вы платите целиком.',
    metric: 'можно делить на 2–4 человек',
  },
];

const STEPS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'plus',
    title: 'Добавьте подписки',
    text: 'Выберите сервис из каталога — цена и категория подставятся сами, или впишите свои данные.',
  },
  {
    icon: 'clock',
    title: 'Отметьте, как часто пользуетесь',
    text: 'Редко, иногда или часто. Это главный сигнал для рекомендаций.',
  },
  {
    icon: 'chart',
    title: 'Смотрите расчёты',
    text: 'Расходы за месяц, год и пять лет, доли по категориям, календарь ближайших списаний.',
  },
  {
    icon: 'savings',
    title: 'Забирайте экономию',
    text: 'SUBSCOPE покажет конкретные шаги: отменить, сменить тариф, перейти на годовую оплату.',
  },
];

const TRUST: { icon: IconName; text: string }[] = [
  { icon: 'shield', text: 'Без доступа к вашим картам и банку' },
  { icon: 'clock', text: 'Настройка за 2 минуты' },
  { icon: 'check', text: 'Бесплатный тариф без срока' },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Нужно ли подключать банк или почту?',
    a: 'Нет. SUBSCOPE не запрашивает доступ к банковскому приложению, почте или картам. Вы сами вносите подписки — это безопаснее и занимает пару минут.',
  },
  {
    q: 'Откуда берутся цены в каталоге сервисов?',
    a: 'Мы держим справочник популярных сервисов с ориентировочными ценами и тарифами, чтобы вы не вводили их вручную. Условия меняются, поэтому сумму при добавлении всегда можно поправить: расчёты строятся по вашим данным, а не по справочнику.',
  },
  {
    q: 'Как считается возможная экономия?',
    a: 'Из трёх источников: подписки с отметкой «пользуюсь редко», переход на более дешёвый тариф того же сервиса и годовая оплата вместо ежемесячной (обычно минус 15–20%). Сценарии «Аккуратный», «Оптимальный» и «Максимальный» отличаются тем, насколько решительные шаги в них входят.',
  },
  {
    q: 'Что будет, если удалить подписку из списка?',
    a: 'Запись пропадёт из кабинета и перестанет учитываться в расчётах. История расходов за прошлые месяцы сохраняется, чтобы динамика не ломалась.',
  },
  {
    q: 'Мои данные видят другие люди?',
    a: 'Нет. Аккаунт приватный, данные лежат в защищённой базе Supabase и передаются только по HTTPS. Мы не продаём статистику и не показываем чужие подписки.',
  },
  {
    q: 'Можно пользоваться бесплатно?',
    a: 'Да. Тариф FREE бессрочный: до 5 активных подписок, базовая статистика, расходы за месяц и год, календарь ближайших списаний. PRO и PRO+ добавляют аналитику, рекомендации, прогноз и сценарии экономии.',
  },
  {
    q: 'Как оплатить тариф и безопасно ли это?',
    a: 'Оплата проходит на странице оформления: карту или СБП принимает платёжный провайдер, SUBSCOPE не видит и не хранит платёжные данные. Чек приходит на почту, отключить продление можно в любой момент. К вашим счетам и банковскому приложению сервис доступа не имеет.',
  },
];

const SECURITY: { icon: IconName; t: string; d: string }[] = [
  { icon: 'lock', t: 'Соединение только по HTTPS', d: 'Защищённые заголовки и HSTS включены на уровне сервера' },
  { icon: 'shield', t: 'Нет банковских данных', d: 'Мы не храним номера карт, CVV и пароли от сторонних сервисов' },
  { icon: 'card', t: 'Оплата тарифа — через провайдера', d: 'Платёж за SUBSCOPE принимает платёжный провайдер: мы не видим и не храним данные карты' },
  { icon: 'user', t: 'Приватный аккаунт', d: 'Ваши подписки видны только вам после входа' },
  { icon: 'info', t: 'Прозрачные расчёты', d: 'Формулы не скрыты: цена за месяц, год и экономия считаются открыто' },
];

function Donut() {
  const slices = [
    { label: CATEGORIES.ai.label, color: CATEGORIES.ai.color, value: 2499 },
    { label: CATEGORIES.soft.label, color: CATEGORIES.soft.color, value: 1990 },
    { label: CATEGORIES.video.label, color: CATEGORIES.video.color, value: 998 },
    { label: CATEGORIES.music.label, color: CATEGORIES.music.color, value: 698 },
    { label: CATEGORIES.cloud.label, color: CATEGORIES.cloud.color, value: 149 },
  ];
  const total = slices.reduce((a, s) => a + s.value, 0);
  const R = 54;
  const C = 2 * Math.PI * R;
  let offset = 0;

  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg
        viewBox="0 0 140 140"
        className="size-32 shrink-0 -rotate-90"
        role="img"
        aria-label="Структура расходов по категориям"
      >
        <circle cx="70" cy="70" r={R} fill="none" stroke="#e2e5ef" strokeWidth="18" />
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
              strokeWidth="18"
              strokeDasharray={dash}
              strokeDashoffset={shift}
            />
          );
        })}
      </svg>
      <ul className="min-w-0 flex-1 space-y-2 text-xs">
        {slices.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span className="size-2.5 shrink-0 rounded-full" style={{ background: s.color }} />
            <span className="truncate text-body">{s.label}</span>
            <span className="num ml-auto shrink-0 font-mono font-bold text-ink">
              {Math.round((s.value / total) * 100)}%
            </span>
          </li>
        ))}
        <li className="flex items-center gap-2 border-t border-line pt-2">
          <span className="text-body">Всего в месяц</span>
          <span className="num ml-auto font-mono font-bold text-ink">{fmt(total)}</span>
        </li>
      </ul>
    </div>
  );
}

function DashboardMock() {
  const rows = [
    { n: 'ChatGPT Plus', p: 2499, w: 100, c: CATEGORIES.ai.color },
    { n: 'Adobe CC', p: 1990, w: 80, c: CATEGORIES.soft.color },
    { n: 'Netflix', p: 699, w: 28, c: CATEGORIES.video.color },
  ];

  return (
    <div className="relative rounded-3xl border border-line bg-white p-5 shadow-lift">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-danger/60" />
          <span className="size-2.5 rounded-full bg-warn/60" />
          <span className="size-2.5 rounded-full bg-save/60" />
        </div>
        <span className="rounded-full bg-bg px-2.5 py-1 font-mono text-[10px] text-mute">
          subscope · личный кабинет
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          { k: 'Расходы / мес', v: fmt(6334), tone: 'text-ink' },
          { k: 'За год', v: fmt(76008), tone: 'text-ink' },
          { k: 'Можно сохранить', v: `${fmt(1940)} / мес`, tone: 'text-save' },
        ].map((c) => (
          <div key={c.k} className="rounded-2xl bg-bg p-3.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-mute">{c.k}</p>
            <p className={`num mt-1 font-display text-base font-black ${c.tone}`}>{c.v}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-line p-4">
        <Donut />
      </div>

      <div className="mt-4 space-y-2">
        {rows.map((row, i) => (
          <div key={row.n} className="flex items-center gap-3 rounded-xl bg-bg px-3 py-2.5">
            <span
              className="grid size-7 shrink-0 place-items-center rounded-lg font-mono text-[10px] font-bold text-white"
              style={{ background: row.c }}
            >
              {row.n[0]}
            </span>
            <span className="min-w-0 flex-1 truncate text-xs font-semibold text-ink">{row.n}</span>
            <span className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-line sm:block">
              <span
                className="grow-x block h-full rounded-full"
                style={{ width: `${row.w}%`, background: row.c, animationDelay: `${i * 160}ms` }}
              />
            </span>
            <span className="num shrink-0 font-mono text-xs font-bold text-ink">{fmt(row.p)}</span>
          </div>
        ))}
      </div>

      <div className="floaty absolute -right-3 -top-6 hidden w-52 rounded-2xl border border-line bg-ink p-3.5 text-white shadow-pop sm:block">
        <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-accent">
          <Icon name="bell" size={12} /> напоминание
        </p>
        <p className="mt-1.5 text-xs font-semibold leading-snug">
          Через 3 дня спишется {fmt(2499)} за ChatGPT Plus
        </p>
      </div>
    </div>
  );
}

function Ticker() {
  const items = [...CATALOG, ...CATALOG];
  return (
    <div className="ticker ticker-mask overflow-hidden border-y border-line bg-white/70 py-4">
      <div className="ticker-track gap-3 pr-3">
        {items.map((s, i) => (
          <span
            key={`${s.id}-${i}`}
            className="flex shrink-0 items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-xs font-semibold text-body"
          >
            <span
              className="grid size-5 place-items-center rounded-full font-mono text-[9px] font-bold"
              style={{ background: s.color, color: s.ink ?? '#fff' }}
            >
              {s.name[0]}
            </span>
            {s.short ?? s.name}
            <span className="num font-mono text-[11px] text-mute">{fmt(s.price)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="glow left-[-10%] top-[-12%] size-[420px] bg-accent/25" aria-hidden="true" />
          <div
            className="glow right-[-6%] top-[22%] size-[380px] bg-[#4353FF]/20"
            aria-hidden="true"
          />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-24 lg:pt-16">
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-bold text-body shadow-card">
                  <Icon name="spark" size={13} className="text-accent" />
                  Трекер подписок с расчётом реальной экономии
                </span>
              </Reveal>

              <Reveal delay={70}>
                <h1 className="mt-5 font-display text-[34px] font-black leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[56px]">
                  Подписки съедают{' '}
                  <span className="relative whitespace-nowrap text-accent">
                    больше
                    <svg
                      viewBox="0 0 200 12"
                      preserveAspectRatio="none"
                      className="absolute -bottom-1 left-0 h-2.5 w-full text-accent/40"
                      aria-hidden="true"
                    >
                      <path
                        d="M2 8c40-5 80-6 120-3 25 2 50 1 76-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  ,<br className="hidden sm:block" /> чем кажется
                </h1>
              </Reveal>

              <Reveal delay={140}>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-body sm:text-lg">
                  SUBSCOPE собирает все регулярные платежи в одном месте, переводит годовые и
                  еженедельные списания в понятную цену за месяц и показывает, от чего можно
                  отказаться уже сегодня.
                </p>
              </Reveal>

              <Reveal delay={200}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/dashboard"
                    className="press inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-white shadow-lift transition hover:bg-accent-deep"
                  >
                    Посчитать мои расходы
                    <Icon name="arrow-right" size={16} />
                  </Link>
                  <a
                    href="#calc"
                    className="press inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3.5 text-sm font-bold text-ink transition hover:border-ink/30"
                  >
                    <Icon name="chart" size={16} className="text-accent" />
                    Калькулятор потерь
                  </a>
                </div>
              </Reveal>

              <Reveal delay={260}>
                <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5">
                  {TRUST.map((t) => (
                    <li
                      key={t.text}
                      className="flex items-center gap-2 text-xs font-semibold text-body"
                    >
                      <Icon name={t.icon} size={15} className="text-save" />
                      {t.text}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <Reveal delay={160} className="flex justify-center lg:justify-end">
              <Receipt />
            </Reveal>
          </div>
        </section>

        <Ticker />

        <section id="leaks" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6">
          <Reveal className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">проблема</p>
            <h2 className="mt-3 font-display text-2xl font-black leading-tight text-ink sm:text-4xl">
              Деньги уходят незаметно
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-body sm:text-base">
              Один платёж на 299 ₽ не ощущается тратой. Но пять таких платежей каждый месяц — это{' '}
              <span className="font-bold text-ink">{fmt(17940)}</span> за год, о которых никто не
              принимает решение осознанно.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LEAKS.map((l, i) => (
              <Reveal key={l.title} delay={i * 70}>
                <article className="card-hover h-full rounded-3xl border border-line bg-white p-6 shadow-card">
                  <span className="grid size-11 place-items-center rounded-2xl bg-accent-soft text-accent-ink">
                    <Icon name={l.icon} size={20} />
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold text-ink">{l.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-body">{l.text}</p>
                  <p className="mt-4 inline-flex items-center gap-2 rounded-xl bg-bg px-3 py-2 font-mono text-[11px] font-semibold text-mute">
                    <Icon name="trend-up" size={13} className="text-danger" />
                    {l.metric}
                  </p>
                </article>
              </Reveal>
            ))}

            <Reveal delay={LEAKS.length * 70}>
              <article className="flex h-full flex-col justify-between rounded-3xl bg-ink p-6 text-white shadow-pop">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                    итог
                  </p>
                  <h3 className="mt-3 font-display text-xl font-black leading-snug">
                    В среднем 6–9 подписок, и около 40% из них — лишние
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    Дело не в сумме, а в том, что её никто не считает целиком. Как только расходы
                    видны одним числом, лишнее находится само.
                  </p>
                </div>
                <Link
                  href="/dashboard"
                  className="press mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-ink transition hover:bg-bg"
                >
                  Посчитать свои <Icon name="arrow-right" size={16} />
                </Link>
              </article>
            </Reveal>
          </div>
        </section>

        <section id="how" className="scroll-mt-24 border-y border-line bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <Reveal>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                    как это работает
                  </p>
                  <h2 className="mt-3 font-display text-2xl font-black leading-tight text-ink sm:text-4xl">
                    Четыре шага вместо таблицы в заметках
                  </h2>
                </Reveal>

                <ol className="mt-8 space-y-3">
                  {STEPS.map((s, i) => (
                    <Reveal as="li" key={s.title} delay={i * 80}>
                      <div className="flex gap-4 rounded-2xl border border-line bg-bg p-4 transition hover:border-accent/40 hover:bg-white">
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ink text-white">
                          <Icon name={s.icon} size={18} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[11px] font-black uppercase tracking-wider text-mute">
                            Шаг {i + 1}
                          </p>
                          <h3 className="mt-0.5 font-bold text-ink">{s.title}</h3>
                          <p className="mt-1 text-sm leading-relaxed text-body">{s.text}</p>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </ol>
              </div>

              <Reveal delay={120}>
                <DashboardMock />
              </Reveal>
            </div>
          </div>
        </section>

        <section id="calc" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6">
          <Reveal className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">интерактив</p>
            <h2 className="mt-3 font-display text-2xl font-black leading-tight text-ink sm:text-4xl">
              Сколько вы теряете на подписках
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-body sm:text-base">
              Оцените на глаз. Большинство занижает количество подписок примерно вдвое — часть
              платежей просто не запоминается.
            </p>
          </Reveal>

          <Reveal delay={100} className="mt-10">
            <LossCalc />
          </Reveal>
        </section>

        <section id="recs" className="scroll-mt-24 border-y border-line bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Reveal className="max-w-2xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                умные рекомендации
              </p>
              <h2 className="mt-3 font-display text-2xl font-black leading-tight text-ink sm:text-4xl">
                Не «экономьте больше», а конкретные шаги в рублях
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-body sm:text-base">
                Каждая рекомендация объясняет причину и показывает сумму, которая останется у вас.
                Ниже — живой пример на демо-данных: он считается по той же логике, что и ваш кабинет.
              </p>
            </Reveal>

            <Reveal delay={100} className="mt-10">
              <RecsShowcase />
            </Reveal>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">тарифы</p>
            <h2 className="mt-3 font-display text-2xl font-black leading-tight text-ink sm:text-4xl">
              Окупается одной найденной подпиской
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-body sm:text-base">
              Переключите период — цены пересчитаются. Годовой платёж дешевле примерно на{' '}
              {Math.round(CONFIG.annualDiscount * 100)}%.
            </p>
          </Reveal>

          <Reveal delay={100} className="mt-12">
            <Pricing />
          </Reveal>

          <p className="mt-6 text-center text-xs text-mute">
            Отмена в любой момент · оплату тарифа принимает платёжный провайдер
          </p>
        </section>

        <section id="security" className="scroll-mt-24 border-t border-line bg-white py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
            <Reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                безопасность
              </p>
              <h2 className="mt-3 font-display text-2xl font-black leading-tight text-ink sm:text-3xl">
                Мы не просим доступ к вашим деньгам
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-body">
                SUBSCOPE не подключается к банку и не заглядывает в ваши счета: подписки вы
                вносите сами. Наоборот — это вы платите фиксированную цену тарифа, а сервис
                показывает, где деньги утекают, и помогает сэкономить больше, чем стоит сам.
              </p>

              <ul className="mt-6 space-y-3">
                {SECURITY.map((f) => (
                  <li key={f.t} className="flex gap-3 rounded-2xl border border-line bg-bg p-4">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-save-bg text-save">
                      <Icon name={f.icon} size={17} />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-ink">{f.t}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-body">{f.d}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <div id="faq" className="scroll-mt-24">
              <Reveal>
                <h2 className="font-display text-2xl font-black leading-tight text-ink sm:text-3xl">
                  Частые вопросы
                </h2>
                <p className="mt-3 text-sm text-body">
                  Не нашли ответ — напишите нам на странице{' '}
                  <Link href="/support" className="font-bold text-accent hover:underline">
                    поддержки
                  </Link>
                  .
                </p>
              </Reveal>

              <div className="mt-6 space-y-2.5">
                {FAQ.map((f, i) => (
                  <Reveal key={f.q} delay={i * 50}>
                    <details className="faq rounded-2xl border border-line bg-bg open:bg-white open:shadow-card">
                      <summary className="flex items-center justify-between gap-4 px-5 py-4">
                        <span className="text-sm font-bold text-ink">{f.q}</span>
                        <span className="faq-icon grid size-7 shrink-0 place-items-center rounded-full border border-line bg-white text-ink">
                          <Icon name="plus" size={14} />
                        </span>
                      </summary>
                      <p className="px-5 pb-5 text-sm leading-relaxed text-body">{f.a}</p>
                    </details>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-6 pt-2 sm:px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-[32px] bg-ink px-6 py-14 text-center shadow-pop sm:px-12">
              <div
                className="glow left-1/2 top-[-45%] size-[520px] -translate-x-1/2 bg-accent/30"
                aria-hidden="true"
              />
              <div className="relative">
                <div className="mx-auto flex w-fit items-center gap-2.5">
                  <Logo size={36} />
                  <span className="font-display text-sm font-black tracking-[0.18em] text-white">
                    SUBSCOPE
                  </span>
                </div>
                <h2 className="mx-auto mt-6 max-w-2xl font-display text-2xl font-black leading-tight text-white sm:text-4xl">
                  Узнайте точную сумму своих подписок сегодня
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/70">
                  Добавьте первую подписку — расчёт за месяц, год и пять лет появится сразу, без
                  ожидания и длинных форм.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/signup"
                    className="press rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-white transition hover:bg-accent-deep"
                  >
                    Начать бесплатно
                  </Link>
                  <Link
                    href="/dashboard"
                    className="press rounded-full border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    Посмотреть кабинет
                  </Link>
                </div>
                <p className="mt-5 font-mono text-[11px] uppercase tracking-wider text-white/40">
                  {CATALOG.length} сервисов в каталоге · бесплатный тариф без срока
                </p>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
