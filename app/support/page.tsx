'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message) return;
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[#EAEBF2] text-[#171A3A] font-sans">
      {/* Шапка */}
      <header className="sticky top-0 z-50 bg-[#EAEBF2]/90 backdrop-blur-md border-b border-[#DCDFEC]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link className="flex items-center gap-3 group" href="/">
            <div className="w-10 h-10 rounded-2xl bg-[#171A3A] flex items-center justify-center text-white font-black text-lg shadow-md">
              S
            </div>
            <span className="font-black text-xl tracking-wider text-[#171A3A] font-['Unbounded',sans-serif]">
              SUBSCOPE
            </span>
          </Link>
          <Link className="bg-[#171A3A] text-white px-6 py-3 rounded-full text-sm font-bold shadow-md hover:bg-[#2A2F5B] transition" href="/dashboard">
            Личный кабинет
          </Link>
        </div>
      </header>

      {/* Основной контент */}
      <main className="py-16 max-w-4xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black font-['Unbounded',sans-serif]">Служба поддержки</h1>
          <p className="text-[#4B5079]">Мы всегда готовы помочь вам разобраться с любыми вопросами по сервису.</p>
        </div>

        <div className="bg-white rounded-3xl border border-[#DCDFEC] shadow-sm p-8 space-y-6">
          <h2 className="text-xl font-bold font-['Unbounded',sans-serif]">Напишите нам сообщение</h2>

          {submitted ? (
            <div className="bg-[#DDF3E9] border border-[#A9DCC5] text-[#0B7F58] p-6 rounded-2xl font-bold text-center space-y-2">
              <p>✓ Сообщение успешно отправлено!</p>
              <p className="text-xs font-normal">Наша служба поддержки ответит вам на указанную почту в течение 24 часов.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4B5079] mb-1">Ваш Email</label>
                <input
                  type="email"
                  placeholder="user@subscope.app"
                  className="w-full px-4 py-3 rounded-2xl border border-[#DCDFEC] text-sm focus:outline-none focus:border-[#FF5A1F] bg-[#EAEBF2]/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4B5079] mb-1">Опишите ваш вопрос или проблему</label>
                <textarea
                  rows={4}
                  placeholder="Расскажите, с чем возникли трудности..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-[#DCDFEC] text-sm focus:outline-none focus:border-[#FF5A1F] bg-[#EAEBF2]/50"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-[#FF5A1F] hover:bg-[#E54D15] text-[#171A3A] px-8 py-3.5 rounded-2xl text-sm font-bold transition shadow-md"
              >
                Отправить запрос
              </button>
            </form>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-[#DCDFEC] shadow-sm p-8 space-y-4">
          <h2 className="text-xl font-bold font-['Unbounded',sans-serif]">Часто задаваемые вопросы (FAQ)</h2>
          <div className="space-y-3 text-sm text-[#4B5079]">
            <details className="p-4 rounded-2xl bg-[#EAEBF2]/50 border border-[#DCDFEC]">
              <summary className="font-bold cursor-pointer text-[#171A3A]">Безопасно ли хранить данные о подписках?</summary>
              <p className="mt-2 text-xs leading-relaxed">Да, мы не запрашиваем пароли или данные банковских карт. В базе данных хранятся только названия сервисов и суммы.</p>
            </details>
            <details className="p-4 rounded-2xl bg-[#EAEBF2]/50 border border-[#DCDFEC]">
              <summary className="font-bold cursor-pointer text-[#171A3A]">Как удалить подписку?</summary>
              <p className="mt-2 text-xs leading-relaxed">Вы можете в любой момент удалить любую запись в личном кабинете, нажав на иконку крестика напротив нужного сервиса.</p>
            </details>
            <details className="p-4 rounded-2xl bg-[#EAEBF2]/50 border border-[#DCDFEC]">
              <summary className="font-bold cursor-pointer text-[#171A3A]">Что значит статус «На паузе»?</summary>
              <p className="mt-2 text-xs leading-relaxed">Подписка на паузе не учитывается в расходах, но остаётся в вашем списке. Это удобно для сервисов, которыми вы пользуетесь сезонно.</p>
            </details>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-[#DCDFEC] py-8 text-xs text-[#6E7398]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 SUBSCOPE. Все права защищены.</p>
          <div className="flex gap-6">
            <Link href="/pricing" className="hover:text-[#FF5A1F] transition">Тарифы</Link>
            <Link href="/login" className="hover:text-[#FF5A1F] transition">Вход</Link>
            <Link href="/" className="hover:text-[#FF5A1F] transition">На главную</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
