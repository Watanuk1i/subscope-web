import Link from 'next/link';
import { Icon, Logo, type IconName } from '@/components/Icons';
import { Pricing } from '@/components/Pricing';
import { Reveal } from '@/components/Reveal';

const INCLUDED: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'list',
    title: 'Каталог из 17 сервисов',
    text: 'Цены и тарифы популярных подписок подставляются автоматически при добавлении.',
  },
  {
    icon: 'chart',
    title: 'Честная цена за месяц',
    text: 'Годовые и еженедельные списания переводим в месячную стоимость для сравнения.',
  },
  {
    icon: 'calendar',
    title: 'Календарь списаний',
    text: 'Видно, в какие даты и сколько спишется в ближайшие 30 дней.',
  },
  {
    icon: 'savings',
    title: 'Рекомендации в рублях',
    text: 'Отмена лишнего, смена тарифа и годовая оплата — с конкретной суммой экономии.',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="SUBSCOPE — на главную">
            <Logo size={32} />
            <span className="font-display text-sm font-black tracking-[0.16em] text-ink">
              SUBSCOPE
            </span>
          </Link>
          <span className="text-xs font-bold text-mute">/ тарифы</span>
          <Link
            href="/dashboard"
            className="press ml-auto rounded-full bg-accent px-4 py-2.5 text-xs font-bold text-white transition hover:bg-accent-deep"
          >
            В кабинет
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">тарифы</p>
          <h1 className="mt-3 font-display text-3xl font-black leading-tight text-ink sm:text-4xl">
            Экономия обычно больше стоимости подписки
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-body sm:text-base">
            Средняя найденная переплата — несколько сотен рублей в месяц. Тариф окупается, как
            только вы отменяете первую лишнюю подписку или переходите на выгодный пакет.
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-12">
          <Pricing />
        </Reveal>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INCLUDED.map((f, i) => (
            <Reveal key={f.title} delay={i * 70}>
              <article className="card-hover h-full rounded-3xl border border-line bg-white p-6 shadow-card">
                <span className="grid size-11 place-items-center rounded-2xl bg-accent-soft text-accent-ink">
                  <Icon name={f.icon} size={20} />
                </span>
                <h2 className="mt-4 font-display text-base font-bold text-ink">{f.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-body">{f.text}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120} className="mt-12">
          <div className="rounded-3xl border border-line bg-white p-6 text-center shadow-card sm:p-8">
            <h2 className="font-display text-lg font-bold text-ink">Остались вопросы?</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-body">
              На странице поддержки собраны частые вопросы и контакты — ответим в течение дня.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href="/support"
                className="press rounded-full border border-line px-5 py-3 text-xs font-bold text-ink transition hover:border-ink/30"
              >
                Открыть поддержку
              </Link>
              <Link
                href="/dashboard"
                className="press rounded-full bg-accent px-5 py-3 text-xs font-bold text-white transition hover:bg-accent-deep"
              >
                Попробовать бесплатно
              </Link>
            </div>
          </div>
        </Reveal>
      </main>
    </div>
  );
}
