'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !name || busy) return;
    setBusy(true);
    setMessage('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    setBusy(false);

    if (error) {
      setMessage(error.message);
      return;
    }
    if (data.session) {
      router.push('/dashboard');
    } else {
      setMessage('Аккаунт создан. Подтвердите почту по ссылке из письма, затем войдите.');
    }
  }

  return (
    <div className="min-h-screen bg-[#EAEBF2] text-[#171A3A] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#DCDFEC] shadow-xl p-8 space-y-6">

        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#171A3A] text-white font-black text-xl mb-2 shadow-md">
            S
          </Link>
          <h1 className="text-2xl font-black font-['Unbounded',sans-serif]">Создать аккаунт</h1>
          <p className="text-xs text-[#4B5079]">Начните бесплатно контролировать свои подписки</p>
        </div>

        {message && (
          <div className="bg-[#FFF0D9] border border-[#F0C896] text-[#9A5B00] px-4 py-3 rounded-2xl text-xs font-semibold">
            {message}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#4B5079] mb-1">Ваше имя</label>
            <input
              type="text"
              placeholder="Иван"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-[#DCDFEC] text-sm focus:outline-none focus:border-[#FF5A1F] bg-[#EAEBF2]/50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4B5079] mb-1">Электронная почта</label>
            <input
              type="email"
              placeholder="user@subscope.app"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-[#DCDFEC] text-sm focus:outline-none focus:border-[#FF5A1F] bg-[#EAEBF2]/50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4B5079] mb-1">Пароль</label>
            <input
              type="password"
              minLength={6}
              placeholder="Минимум 6 символов"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-[#DCDFEC] text-sm focus:outline-none focus:border-[#FF5A1F] bg-[#EAEBF2]/50"
              required
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full py-3.5 rounded-2xl bg-[#FF5A1F] text-[#171A3A] text-sm font-bold hover:bg-[#E54D15] transition shadow-md disabled:opacity-60"
          >
            {busy ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="text-center space-y-2 pt-2">
          <p className="text-xs text-[#6E7398]">
            Уже есть аккаунт?{' '}
            <Link href="/login" className="font-bold text-[#FF5A1F] hover:underline">
              Войти
            </Link>
          </p>
          <div>
            <Link href="/" className="text-xs font-bold text-[#6E7398] hover:text-[#FF5A1F] transition">
              ← На главную
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
