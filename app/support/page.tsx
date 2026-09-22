import Link from 'next/link';
import { Icon, Logo, type IconName } from '@/components/Icons';
import { Reveal } from '@/components/Reveal';

const CHANNELS: { icon: IconName; title: string; text: string; action: string }[] = [
  {
    icon: 'mail',
    title: 'Почта',
    text: 'support@subscope.app — для вопросов по аккаунту и удалению данных.',
    action: 'Ответ в течение дня',
  },
  {
    icon: 'info',
    title: 'База знаний',
    text: 'Частые вопросы о расчётах, каталоге сервисов и рекомендациях — на главной странице.',
    action: 'Раздел «Вопросы»',
  },
  {
    icon: 'shield',
    title: 'Безопасность',
    text: 'Нашли уязвимость или подозрительное поведение? Напишите нам — проверим и ответим.',
    action: 'Приоритетный разбор',
  },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Подписка не добавилась или не удаляется',
    a: 'Проверьте, что вы не в режиме инкогнито: база доступна по HTTPS, а браузер может блокировать запросы. Если проблема осталась — напишите нам, приложив текст ошибки из всплывающего уведомления.',
  },
  {
    q: 'Цены в каталоге устарели',
    a: 'Справочник сервисов мы обновляем вручную, условия меняются часто. Цену любой подписки можно задать вручную при добавлении или изменить позже — расчёты используют ваши значения.',
  },
  {
    q: 'Как поменять тариф',
    a: 'В настройках, раздел «Тариф и платежи», или на странице тарифов. Переключение мгновенное, данные не теряются.',
  },
  {
    q: 'Хочу удалить все свои данные',
    a: 'Напишите на support@subscope.app с почты аккаунта — удалим записи из базы и подтвердим удаление ответным письмом.',
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="SUBSCOPE — на главную">
            <Logo size={32} />
            <span className="font-display text-sm font-black tracking-[0.16em] text-ink">
              SUBSCOPE
            </span>
          </Link>
          <span className="text-xs font-bold text-mute">/ поддержка</span>
          <Link
            href="/dashboard"
            className="press ml-auto rounded-full border border-line bg-white px-4 py-2.5 text-xs font-bold text-ink transition hover:border-ink/30"
          >
            В кабинет
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">поддержка</p>
          <h1 className="mt-3 font-display text-3xl font-black leading-tight text-ink sm:text-4xl">
            Поможем разобраться
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-body sm:text-base">
            Отвечаем по будням с 10:00 до 19:00 (МСК). Среднее время ответа — несколько часов.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {CHANNELS.map((c, i) => (
            <Reveal key={c.title} delay={i * 70}>
              <article className="card-hover h-full rounded-3xl border border-line bg-white p-6 shadow-card">
                <span className="grid size-11 place-items-center rounded-2xl bg-accent-soft text-accent-ink">
                  <Icon name={c.icon} size={20} />
                </span>
                <h2 className="mt-4 font-display text-base font-bold text-ink">{c.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-body">{c.text}</p>
                <p className="mt-4 inline-flex items-center gap-2 rounded-xl bg-bg px-3 py-2 font-mono text-[11px] font-semibold text-mute">
                  <Icon name="clock" size={13} className="text-accent" />
                  {c.action}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={100} className="mt-14">
          <h2 className="font-display text-2xl font-black text-ink">Частые обращения</h2>
          <div className="mt-5 space-y-2.5">
            {FAQ.map((f) => (
              <details key={f.q} className="faq rounded-2xl border border-line bg-white open:shadow-card">
                <summary className="flex items-center justify-between gap-4 px-5 py-4">
                  <span className="text-sm font-bold text-ink">{f.q}</span>
                  <span className="faq-icon grid size-7 shrink-0 place-items-center rounded-full border border-line bg-bg text-ink">
                    <Icon name="plus" size={14} />
                  </span>
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-body">{f.a}</p>
              </details>
            ))}
          </div>
        </Reveal>

        <Reveal delay={140} className="mt-12">
          <div className="rounded-3xl bg-ink p-8 text-center shadow-pop">
            <h2 className="font-display text-xl font-black text-white">Не нашли ответ?</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/70">
              Опишите ситуацию в письме — приложите скриншот или текст ошибки, так быстрее.
            </p>
            <a
              href="mailto:support@subscope.app"
              className="press mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-white transition hover:bg-accent-deep"
            >
              <Icon name="mail" size={16} /> Написать в поддержку
            </a>
          </div>
        </Reveal>
      </main>
    </div>
  );
}
