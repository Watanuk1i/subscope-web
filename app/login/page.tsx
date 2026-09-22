'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Icon, Logo } from '@/components/Icons';
import { useToast } from '@/components/Toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const toast = useToast();

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    if (!email || busy) return;
    setBusy(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.ok('С возвращением!');
    router.push('/dashboard');
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg px-4 py-10">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="glow left-1/2 top-[-20%] size-[420px] -translate-x-1/2 bg-accent/20" aria-hidden="true" />

      <Link href="/" className="relative flex items-center gap-2.5" aria-label="SUBSCOPE — на главную">
        <Logo size={38} />
        <span className="font-display text-sm font-black tracking-[0.16em] text-ink">SUBSCOPE</span>
      </Link>

      <div className="pop relative mt-6 w-full max-w-md rounded-3xl border border-line bg-white p-7 shadow-lift sm:p-9">
        <h1 className="font-display text-2xl font-black text-ink">Вход в кабинет</h1>
        <p className="mt-1.5 text-xs leading-relaxed text-body">
          Аккаунт хранит ваши подписки и расчёты. Можно продолжать и без входа — данные останутся в
          этом браузере.
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-body" htmlFor="login-email">
              Электронная почта
            </label>
            <input
              id="login-email"
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
            <label className="mb-1 block text-xs font-bold text-body" htmlFor="login-pass">
              Пароль
            </label>
            <input
              id="login-pass"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-line bg-bg/60 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="press w-full rounded-2xl bg-accent py-3.5 text-sm font-bold text-white shadow-lift transition hover:bg-accent-deep disabled:opacity-60"
          >
            {busy ? 'Проверяем…' : 'Войти в кабинет'}
          </button>
        </form>

        <div className="mt-6 space-y-2 text-center">
          <p className="text-xs text-body">
            Нет аккаунта?{' '}
            <Link href="/signup" className="font-bold text-accent hover:underline">
              Зарегистрироваться
            </Link>
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-mute transition hover:text-ink"
          >
            <Icon name="chevron-left" size={13} /> Продолжить без входа
          </Link>
        </div>
      </div>

      <p className="relative mt-6 flex items-center gap-2 text-[11px] text-mute">
        <Icon name="shield" size={13} className="text-save" />
        Пароли проверяет Supabase Auth, мы их не храним
      </p>
    </div>
  );
}
