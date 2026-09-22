'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Icon, Logo } from '@/components/Icons';
import { useToast } from '@/components/Toast';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const toast = useToast();

  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    if (!email || !name || busy) return;
    setBusy(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    setBusy(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    if (data.session) {
      toast.ok('Аккаунт создан — добро пожаловать!');
      router.push('/dashboard');
    } else {
      setSent(true);
      toast.ok('Аккаунт создан. Подтвердите почту по ссылке из письма.');
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg px-4 py-10">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="glow left-1/2 top-[-20%] size-[420px] -translate-x-1/2 bg-[#4353FF]/20"
        aria-hidden="true"
      />

      <Link href="/" className="relative flex items-center gap-2.5" aria-label="SUBSCOPE — на главную">
        <Logo size={38} />
        <span className="font-display text-sm font-black tracking-[0.16em] text-ink">SUBSCOPE</span>
      </Link>

      <div className="pop relative mt-6 w-full max-w-md rounded-3xl border border-line bg-white p-7 shadow-lift sm:p-9">
        <h1 className="font-display text-2xl font-black text-ink">Создать аккаунт</h1>
        <p className="mt-1.5 text-xs leading-relaxed text-body">
          Бесплатный тариф без срока: до 5 подписок, базовая статистика и календарь списаний.
        </p>

        {sent ? (
          <div className="mt-6 rounded-2xl border border-save-line bg-save-bg p-5 text-center">
            <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-save text-white">
              <Icon name="mail" size={20} />
            </span>
            <p className="mt-3 text-sm font-bold text-save">Письмо отправлено</p>
            <p className="mt-1.5 text-xs leading-relaxed text-save/80">
              Подтвердите почту по ссылке из письма и войдите с теми же данными.
            </p>
            <Link
              href="/login"
              className="press mt-4 inline-block rounded-full bg-save px-5 py-2.5 text-xs font-bold text-white transition hover:brightness-110"
            >
              Перейти ко входу
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-body" htmlFor="sign-name">
                Имя
              </label>
              <input
                id="sign-name"
                type="text"
                autoComplete="name"
                placeholder="Как к вам обращаться"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-line bg-bg/60 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-body" htmlFor="sign-email">
                Электронная почта
              </label>
              <input
                id="sign-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-line bg-bg/60 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-body" htmlFor="sign-pass">
                Пароль
              </label>
              <input
                id="sign-pass"
                type="password"
                autoComplete="new-password"
                placeholder="Минимум 6 символов"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                className="w-full rounded-2xl border border-line bg-bg/60 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="press w-full rounded-2xl bg-accent py-3.5 text-sm font-bold text-white shadow-lift transition hover:bg-accent-deep disabled:opacity-60"
            >
              {busy ? 'Создаём аккаунт…' : 'Создать аккаунт'}
            </button>
          </form>
        )}

        <div className="mt-6 space-y-2 text-center">
          <p className="text-xs text-body">
            Уже есть аккаунт?{' '}
            <Link href="/login" className="font-bold text-accent hover:underline">
              Войти
            </Link>
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-mute transition hover:text-ink"
          >
            <Icon name="chevron-left" size={13} /> Вернуться на главную
          </Link>
        </div>
      </div>

      <p className="relative mt-6 flex items-center gap-2 text-[11px] text-mute">
        <Icon name="lock" size={13} className="text-save" />
        Регистрация через Supabase Auth · данные карт не запрашиваем
      </p>
    </div>
  );
}
