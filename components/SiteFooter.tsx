import Link from 'next/link';
import { CATEGORIES } from '@/lib/config';
import { Icon, Logo } from '@/components/Icons';

const PRODUCT = [
  { href: '/dashboard', label: 'Личный кабинет' },
  { href: '/pricing', label: 'Тарифы' },
  { href: '/#calc', label: 'Калькулятор потерь' },
  { href: '/#recs', label: 'Умные рекомендации' },
];

const HELP = [
  { href: '/support', label: 'Поддержка и вопросы' },
  { href: '/#faq', label: 'Частые вопросы' },
  { href: '/#value', label: 'Что вы получаете' },
  { href: '/login', label: 'Вход в аккаунт' },
];

export function SiteFooter() {
  const cats = Object.values(CATEGORIES);

  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* верхняя полоса-призыв */}
        <div className="-mt-px grid gap-4 rounded-b-3xl border border-t-0 border-line bg-bg px-5 py-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center lg:px-8">
          <div>
            <p className="font-display text-base font-bold text-ink">
              Проверьте свои подписки за 2 минуты
            </p>
            <p className="mt-1 text-xs leading-relaxed text-body">
              Добавьте сервисы из каталога одним нажатием — SUBSCOPE посчитает расходы за месяц, год
              и пять лет и покажет, где вы переплачиваете.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/signup"
              className="press rounded-full bg-accent px-5 py-3 text-xs font-bold text-white shadow-card transition hover:bg-accent-deep"
            >
              Создать аккаунт
            </Link>
            <Link
              href="/dashboard"
              className="press rounded-full border border-line bg-white px-5 py-3 text-xs font-bold text-ink transition hover:border-ink/30"
            >
              Открыть без регистрации
            </Link>
          </div>
        </div>

        <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.2fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Logo size={32} />
              <span className="font-display text-sm font-black tracking-[0.16em] text-ink">
                SUBSCOPE
              </span>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-body">
              Платформа для контроля регулярных платежей: собираем подписки в одном месте, считаем
              реальную стоимость в месяц и год, предупреждаем о списаниях и показываем, от чего можно
              отказаться без потери качества.
            </p>
            <p className="inline-flex items-center gap-2 rounded-full bg-save-bg px-3 py-1.5 text-[11px] font-bold text-save">
              <span className="size-1.5 rounded-full bg-save" />
              Сервис работает · данные хранятся в Supabase
            </p>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-wider text-ink">Продукт</p>
            <ul className="mt-4 space-y-2.5 text-xs text-body">
              {PRODUCT.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition hover:text-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-wider text-ink">Помощь</p>
            <ul className="mt-4 space-y-2.5 text-xs text-body">
              {HELP.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition hover:text-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-wider text-ink">
              Категории, которые мы считаем
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {cats.map((c) => (
                <span
                  key={c.label}
                  className="rounded-full border border-line bg-bg px-2.5 py-1 text-[11px] font-semibold text-body"
                  style={{ borderLeft: `3px solid ${c.color}` }}
                >
                  {c.label}
                </span>
              ))}
            </div>
            <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-mute">
              <Icon name="savings" size={14} className="mt-px shrink-0 text-save" />
              Средняя найденная экономия в несколько раз превышает цену тарифа — сервис окупается
              первой же отменённой подпиской.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-line py-6 text-[11px] text-mute sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 SUBSCOPE. Все права защищены.</p>
          <p>Расчёты носят информационный характер и являются оценкой.</p>
        </div>
      </div>
    </footer>
  );
}
