'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'month' | 'year'>('month');

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
      <main className="py-16 max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black font-['Unbounded',sans-serif]">Тарифы и цены</h1>
          <p className="text-[#4B5079]">Выберите план, который подходит для вашего контроля над регулярными расходами.</p>

          <div className="inline-flex p-1.5 bg-white border border-[#DCDFEC] rounded-full shadow-sm mt-4">
            <button
              type="button"
              onClick={() => setBillingPeriod('month')}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition ${billingPeriod === 'month' ? 'bg-[#171A3A] text-white shadow-md' : 'text-[#4B5079] hover:text-[#171A3A]'}`}
            >
              Помесячно
            </button>
            <button
              type="button"
              onClick={() => setBillingPeriod('year')}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition ${billingPeriod === 'year' ? 'bg-[#171A3A] text-white shadow-md' : 'text-[#4B5079] hover:text-[#171A3A]'}`}
            >
              За год <span className="text-[#FF5A1F] text-xs font-black ml-1">(-20%)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* FREE */}
          <div className="bg-white border border-[#DCDFEC] rounded-3xl p-8 flex flex-col justify-between shadow-sm">
            <div>
              <h2 className="text-xl font-black font-['Unbounded',sans-serif]">FREE</h2>
              <p className="text-[#4B5079] text-sm mt-1">Базовый контроль</p>
              <div className="text-4xl font-black font-['Unbounded',sans-serif] mt-6">0 ₽</div>
              <p className="text-xs text-[#6E7398] mt-1">Навсегда</p>
              <ul className="mt-6 space-y-3 text-sm font-medium text-[#4B5079]">
                <li>✓ До 5 активных подписок</li>
                <li>✓ Базовая статистика</li>
                <li>✓ Расходы за месяц и год</li>
              </ul>
            </div>
            <Link className="mt-8 w-full min-h-[48px] flex items-center justify-center rounded-full bg-[#EAEBF2] border border-[#DCDFEC] font-bold text-sm hover:border-[#171A3A] transition shadow-sm" href="/dashboard">
              Начать бесплатно
            </Link>
          </div>

          {/* PRO */}
          <div className="bg-[#171A3A] text-white rounded-3xl p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#FF5A1F] text-[#171A3A] text-xs font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider">
              Популярный
            </div>
            <div>
              <h2 className="text-xl font-black font-['Unbounded',sans-serif]">PRO</h2>
              <p className="text-white/70 text-sm mt-1">Для полной экономии</p>
              <div className="text-4xl font-black font-['Unbounded',sans-serif] mt-6">
                {billingPeriod === 'month' ? '399 ₽' : '3 290 ₽'}
                <span className="text-sm font-normal opacity-70"> / {billingPeriod === 'month' ? 'месяц' : 'год'}</span>
              </div>
              <p className="text-xs text-[#FF5A1F] font-semibold mt-1">
                {billingPeriod === 'year' ? 'Экономия 1 498 ₽ в год' : 'или 3 290 ₽ при оплате за год'}
              </p>
              <ul className="mt-6 space-y-3 text-sm font-medium text-white/90">
                <li>✓ Неограниченно подписок</li>
                <li>✓ Умные рекомендации</li>
                <li>✓ Календарь списаний</li>
                <li>✓ Прогноз трат на год</li>
              </ul>
            </div>
            <Link className="mt-8 w-full min-h-[48px] flex items-center justify-center rounded-full bg-[#FF5A1F] text-[#171A3A] font-bold text-sm hover:opacity-95 transition shadow-md" href="/dashboard">
              Выбрать PRO
            </Link>
          </div>

          {/* PRO+ */}
          <div className="bg-white border border-[#DCDFEC] rounded-3xl p-8 flex flex-col justify-between shadow-sm">
            <div>
              <h2 className="text-xl font-black font-['Unbounded',sans-serif]">PRO+</h2>
              <p className="text-[#4B5079] text-sm mt-1">Максимум возможностей</p>
              <div className="text-4xl font-black font-['Unbounded',sans-serif] mt-6">
                {billingPeriod === 'month' ? '699 ₽' : '5 490 ₽'}
                <span className="text-sm font-normal text-[#6E7398]"> / {billingPeriod === 'month' ? 'месяц' : 'год'}</span>
              </div>
              <p className="text-xs text-[#6E7398] mt-1">
                {billingPeriod === 'year' ? 'Максимальный пакет услуг' : 'или 5 490 ₽ при оплате за год'}
              </p>
              <ul className="mt-6 space-y-3 text-sm font-medium text-[#4B5079]">
                <li>✓ Всё из тарифа PRO</li>
                <li>✓ AI-анализ расходов</li>
                <li>✓ Персональные сценарии</li>
                <li>✓ Продвинутые отчёты</li>
              </ul>
            </div>
            <Link className="mt-8 w-full min-h-[48px] flex items-center justify-center rounded-full bg-[#EAEBF2] border border-[#DCDFEC] font-bold text-sm hover:border-[#171A3A] transition shadow-sm" href="/dashboard">
              Выбрать PRO+
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-[#DCDFEC] py-8 text-xs text-[#6E7398]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 SUBSCOPE. Все права защищены.</p>
          <div className="flex gap-6">
            <Link href="/support" className="hover:text-[#FF5A1F] transition">Поддержка</Link>
            <Link href="/login" className="hover:text-[#FF5A1F] transition">Вход</Link>
            <Link href="/" className="hover:text-[#FF5A1F] transition">На главную</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
