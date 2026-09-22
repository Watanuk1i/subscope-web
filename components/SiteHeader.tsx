'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icon, Logo } from '@/components/Icons';

const NAV = [
  { href: '#how', label: 'Как работает' },
  { href: '#leaks', label: 'Куда уходят деньги' },
  { href: '#calc', label: 'Калькулятор' },
  { href: '#recs', label: 'Рекомендации' },
  { href: '#pricing', label: 'Тарифы' },
  { href: '#faq', label: 'Вопросы' },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow ${
        scrolled ? 'border-b border-line bg-bg/85 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:h-[72px]">
        <Link href="/" className="flex items-center gap-2.5" aria-label="SUBSCOPE — на главную">
          <Logo size={34} />
          <span className="font-display text-[15px] font-black tracking-[0.16em] text-ink">
            SUBSCOPE
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-full px-3 py-2 text-[13px] font-semibold text-body transition hover:bg-white hover:text-ink"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 sm:flex">
          <Link
            href="/login"
            className="press rounded-full px-4 py-2.5 text-[13px] font-bold text-ink transition hover:bg-white"
          >
            Войти
          </Link>
          <Link
            href="/dashboard"
            className="press rounded-full bg-accent px-4 py-2.5 text-[13px] font-bold text-white shadow-lift transition hover:bg-accent-deep"
          >
            Личный кабинет
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          className="press ml-auto grid size-10 place-items-center rounded-xl border border-line bg-white text-ink sm:ml-2 lg:hidden"
        >
          <Icon name={open ? 'x' : 'menu'} size={20} />
        </button>
      </div>

      {open && (
        <div className="slide-up border-t border-line bg-bg px-4 pb-6 pt-3 lg:hidden">
          <nav className="grid gap-1">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-ink transition hover:bg-white"
              >
                {n.label}
                <Icon name="chevron-right" size={16} className="text-mute" />
              </a>
            ))}
          </nav>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="press rounded-2xl border border-line bg-white py-3 text-center text-sm font-bold text-ink"
            >
              Войти
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="press rounded-2xl bg-accent py-3 text-center text-sm font-bold text-white"
            >
              Кабинет
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
