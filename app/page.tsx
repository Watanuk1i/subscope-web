'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SubscopeModernLanding() {
  const [activeTab, setActiveTab] = useState<'month' | 'year'>('month');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Навигация */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link className="flex items-center gap-3 group" href="/">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition">
              S
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              SUBSCOPE
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition">Возможности</a>
            <a href="#analytics" className="hover:text-white transition">Аналитика</a>
            <a href="#pricing" className="hover:text-white transition">Тарифы</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-full text-sm font-bold transition shadow-lg shadow-indigo-600/25 active:scale-95" href="/dashboard">
              Личный кабинет
            </Link>
          </div>
        </div>
      </header>

      {/* Главный экран (Hero) с UX-акцентом на приложение */}
      <main>
        <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 max-w-7xl mx-auto px-4 sm:px-6">
          {/* Фоновые градиенты свечения */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-1/3 right-10 w-[250px] h-[250px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full text-xs font-semibold text-indigo-400 uppercase tracking-widest backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              Управление подписками нового поколения
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Контролируйте расходы на подписки{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                в один клик
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Забудьте про неожиданные списания. SUBSCOPE объединяет все ваши регулярные платежи, анализирует траты и находит точки экономии.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold text-base transition shadow-xl shadow-indigo-600/30 text-center active:scale-95" href="/dashboard">
                Открыть дашборд бесплатно
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 px-8 py-4 rounded-2xl font-bold text-base transition text-center"
              >
                Узнать больше
              </a>
            </div>
          </div>

          {/* Интерактивный UI-мокап приложения (Лицо сайта) */}
          <div className="mt-16 md:mt-24 relative max-w-5xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur-xl opacity-30 pointer-events-none" />
            <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-8 shadow-2xl backdrop-blur-xl">
              {/* Шапка мокапа */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Обзор расходов</h3>
                  <p className="text-xs sm:text-sm text-slate-400">Данные синхронизированы с базой в реальном времени</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab('month')}
                    className={`px-4 py-1.5 rounded-lg transition ${activeTab === 'month' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Месяц
                  </button>
                  <button
                    onClick={() => setActiveTab('year')}
                    className={`px-4 py-1.5 rounded-lg transition ${activeTab === 'year' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Год
                  </button>
                </div>
              </div>

              {/* Карточки внутри мокапа */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5">
                  <p className="text-xs font-medium text-slate-400 mb-1">Расходы за период</p>
                  <p className="text-2xl sm:text-3xl font-black text-white">{activeTab === 'month' ? '4 790 ₽' : '57 480 ₽'}</p>
                </div>
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5">
                  <p className="text-xs font-medium text-slate-400 mb-1">Активных подписок</p>
                  <p className="text-2xl sm:text-3xl font-black text-white">6 сервисов</p>
                </div>
                <div className="bg-indigo-950/40 border border-indigo-900/50 rounded-2xl p-5">
                  <p className="text-xs font-medium text-indigo-300 mb-1">Потенциальная экономия</p>
                  <p className="text-2xl sm:text-3xl font-black text-indigo-400">1 250 ₽</p>
                </div>
              </div>

              {/* Список сервисов в мокапе */}
              <div className="space-y-3">
                {[
                  { name: 'ChatGPT Plus', category: 'ИИ-сервисы', price: '2 499 ₽', period: 'в месяц' },
                  { name: 'Яндекс Плюс', category: 'Музыка и Кино', price: '399 ₽', period: 'в месяц' },
                  { name: 'Google One', category: 'Облако', price: '299 ₽', period: 'в месяц' },
                ].map((sub, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60 hover:border-slate-700 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center text-sm">
                        {sub.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm sm:text-base">{sub.name}</p>
                        <p className="text-xs text-slate-400">{sub.category} • {sub.period}</p>
                      </div>
                    </div>
                    <span className="font-bold text-white text-sm sm:text-base">{sub.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Секция возможностей (Features) */}
        <section id="features" className="py-24 bg-slate-900/40 border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Создано для максимального удобства</h2>
              <p className="text-slate-400 text-sm sm:text-base">Всё, что нужно для полного контроля над регулярными платежами в едином красивом интерфейсе.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 hover:border-indigo-500/50 transition">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xl">⚡</div>
                <h3 className="text-xl font-bold text-white">Моментальное добавление</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Интуитивные модальные окна позволяют фиксировать новые сервисы за секунды без лишней рутины.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 hover:border-purple-500/50 transition">
                <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-xl">📊</div>
                <h3 className="text-xl font-bold text-white">Умная аналитика</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Автоматический расчет месячных и годовых расходов, распределение по категориям и контроль бюджета.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 hover:border-emerald-500/50 transition">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-xl">🛡️</div>
                <h3 className="text-xl font-bold text-white">Надежная база данных</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Безопасное хранение информации на базе Supabase с мгновенным доступом с любых ваших устройств.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Футер */}
      <footer className="border-t border-slate-800/80 py-12 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">S</div>
            <span className="font-bold text-slate-300">SUBSCOPE</span>
          </div>
          <p>© 2026 SUBSCOPE. Все права защищены.</p>
          <Link className="text-indigo-400 hover:underline font-semibold" href="/dashboard">
            Перейти в кабинет →
          </Link>
        </div>
      </footer>
    </div>
  );
}
