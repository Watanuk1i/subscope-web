'use client';

import { useState } from 'react';
import Link from 'next/link';

// Полный каталог сервисов для чека (как в вашем оригинальном макете)
const INITIAL_RECEIPT_ITEMS = [
  { id: 'netflix', name: 'Netflix', price: 699, checked: true, rare: true },
  { id: 'spotify', name: 'Spotify', price: 299, checked: true, rare: false },
  { id: 'youtube', name: 'YouTube Premium', price: 399, checked: true, rare: false },
  { id: 'yandex', name: 'Яндекс Плюс', price: 399, checked: false, rare: false },
  { id: 'chatgpt', name: 'ChatGPT', price: 2499, checked: false, rare: false },
  { id: 'claude', name: 'Claude', price: 1900, checked: false, rare: false },
  { id: 'google', name: 'Google One', price: 299, checked: true, rare: true },
  { id: 'adobe', name: 'Adobe CC', price: 1990, checked: false, rare: false },
  { id: 'vpn', name: 'VPN', price: 299, checked: false, rare: false },
  { id: 'course', name: 'Онлайн-курсы', price: 990, checked: false, rare: false },
];

export default function SubscopeMasterLanding() {
  // Состояние чека
  const [items, setItems] = useState(INITIAL_RECEIPT_ITEMS);
  const [billingPeriod, setBillingPeriod] = useState<'month' | 'year'>('month');

  const toggleCheck = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const toggleRare = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setItems(prev => prev.map(item => item.id === id ? { ...item, rare: !item.rare } : item));
  };

  // Расчеты чека
  const totalMonthly = items.reduce((acc, item) => item.checked ? acc + item.price : acc, 0);
  const rareMonthly = items.reduce((acc, item) => (item.checked && item.rare) ? acc + item.price : acc, 0);

  return (
    <div className="min-h-screen bg-[#F4F5F9] text-[#171A3A] font-sans selection:bg-[#FF5A1F] selection:text-white">
      {/* Навигация */}
      <header className="sticky top-0 z-50 bg-[#F4F5F9]/90 backdrop-blur-md border-b border-[#DCDFEC]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link className="flex items-center gap-3 group" href="/">
            <div className="w-10 h-10 rounded-2xl bg-[#171A3A] flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-105 transition">
              S
            </div>
            <span className="font-black text-xl tracking-wider text-[#171A3A] font-['Unbounded',sans-serif]">
              SUBSCOPE
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#4B5079]">
            <a href="#how" className="hover:text-[#171A3A] transition">Как это работает</a>
            <a href="#recs" className="hover:text-[#171A3A] transition">Рекомендации</a>
            <a href="#pricing" className="hover:text-[#171A3A] transition">Тарифы</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link className="bg-[#171A3A] hover:bg-[#2A2F5B] text-white px-6 py-3 rounded-full text-sm font-bold transition shadow-lg shadow-[#171A3A]/20 active:scale-95" href="/dashboard">
              Личный кабинет
            </Link>
          </div>
        </div>
      </header>

      {/* Главный экран (Hero) с вашим фирменным чеком */}
      <main>
        <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 px-4 py-2 rounded-full text-xs font-bold text-[#FF5A1F] uppercase tracking-wider">
              ✦ Управление подписками нового поколения
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#171A3A] leading-[1.1] font-['Unbounded',sans-serif]">
              Контролируйте расходы на подписки в один клик
            </h1>

            <p className="text-lg sm:text-xl text-[#4B5079] max-w-xl leading-relaxed font-normal">
              Забудьте про неожиданные списания. SUBSCOPE объединяет все регулярные платежи, анализирует траты и находит точки реальной экономии.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link className="w-full sm:w-auto bg-[#FF5A1F] hover:bg-[#E54D15] text-[#171A3A] px-8 py-4 rounded-2xl font-bold text-base transition shadow-xl shadow-[#FF5A1F]/25 text-center active:scale-95" href="/dashboard">
                Рассчитать мои расходы
              </Link>
              <a href="#how" className="w-full sm:w-auto bg-white hover:bg-[#EDEEF5] text-[#171A3A] border border-[#DCDFEC] px-8 py-4 rounded-2xl font-bold text-base transition text-center shadow-sm">
                Узнать больше
              </a>
            </div>

            <div className="flex items-center gap-6 text-sm text-[#6E7398] font-medium pt-2">
              <span>✓ Бесплатно до 5 подписок</span>
              <span>✓ Без привязки карты</span>
            </div>
          </div>

          {/* ТОТ САМЫЙ ФИРМЕННЫЙ ИНТЕРАКТИВНЫЙ ЧЕК */}
          <div className="w-full max-w-[440px] mx-auto justify-self-end">
            <div className="relative bg-[#FCFCFA] text-[#171A3A] p-6 sm:p-8 rounded-t-lg shadow-2xl font-mono text-sm border-b-[12px] border-[#FCFCFA] border-dashed ring-1 ring-[#C9CBD8]">
              {/* Шапка чека */}
              <div className="flex justify-between items-baseline border-b-2 border-dashed border-[#C9CBD8] pb-4 mb-4">
                <b className="font-black text-base font-['Unbounded',sans-serif] tracking-wide">SUBSCOPE</b>
                <span className="text-xs text-[#65698A] font-sans">Чек ваших подписок</span>
              </div>
              <p className="text-xs text-[#65698A] font-sans mb-5 leading-relaxed">
                Отметьте сервисы, за которые платите, и те, которыми пользуетесь редко.
              </p>

              {/* Список сервисов */}
              <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={item.id} className={`flex items-center justify-between gap-2 py-1.5 transition ${!item.checked ? 'opacity-40' : ''}`}>
                    <label className="flex items-center gap-2.5 cursor-pointer flex-1 select-none min-w-0">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleCheck(item.id)}
                        className="w-4 h-4 rounded border-[#C9CBD8] accent-[#171A3A] cursor-pointer"
                      />
                      <span className="truncate font-sans font-medium text-xs sm:text-sm">{item.name}</span>
                    </label>
                    <div className="border-b border-dotted border-[#C9CBD8] flex-1 mx-2 min-w-[20px]" />
                    <span className="font-bold text-xs sm:text-sm whitespace-nowrap">{item.price} ₽</span>
                    <button
                      type="button"
                      onClick={(e) => toggleRare(item.id, e)}
                      className={`px-2 py-0.5 text-[11px] font-sans rounded border transition ${item.rare ? 'bg-[#FFE3D6] border-[#FF5A1F] text-[#8A2B05] font-bold' : 'border-[#C9CBD8] text-[#65698A] hover:border-[#171A3A]'}`}
                    >
                      редко
                    </button>
                  </div>
                ))}
              </div>

              {/* Итоги чека */}
              <div className="border-t-2 border-dashed border-[#C9CBD8] mt-6 pt-4 space-y-2 text-xs font-sans">
                <div className="flex justify-between text-base font-bold font-mono">
                  <span>В месяц</span>
                  <span className="text-[#FF5A1F]">{totalMonthly} ₽</span>
                </div>
                <div className="flex justify-between font-mono text-[#65698A]">
                  <span>В год</span>
                  <span>{totalMonthly * 12} ₽</span>
                </div>
                <div className="flex justify-between text-[#0B7F58] font-mono font-medium pt-1">
                  <span>Редко используете</span>
                  <span>{rareMonthly} ₽/мес</span>
                </div>
                <div className="flex justify-between text-[#0B7F58] font-mono font-bold text-sm pb-1">
                  <span>Можно вернуть за год</span>
                  <span>{rareMonthly * 12} ₽</span>
                </div>
              </div>

              <Link className="w-full mt-6 inline-flex items-center justify-center min-h-[48px] bg-[#FF5A1F] text-[#171A3A] font-bold rounded-full text-sm font-sans hover:opacity-95 transition shadow-md" href="/dashboard">
                Найти возможности для экономии
              </Link>

              <p className="text-[11px] text-center text-[#65698A] font-sans mt-3">
                Цены ориентировочные. В кабинете вы укажете свои.
              </p>
            </div>
          </div>
        </section>

        {/* Секция: Деньги уходят незаметно */}
        <section className="py-20 bg-white border-y border-[#DCDFEC]">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-black font-['Unbounded',sans-serif] tracking-tight">
                Деньги уходят незаметно
              </h2>
              <p className="text-[#4B5079] text-base md:text-lg leading-relaxed">
                Подписки оформляются за минуту, а вспоминать о них приходится месяцами. Обычно из виду пропадает сразу несколько важных вещей.
              </p>
            </div>
            <div className="space-y-4">
              {[
                'Какие подписки у вас реально активны',
                'Сколько уходит на мелкие сервисы за год',
                'В какие дни списываются деньги с карты',
                'Какими сервисами вы перестали пользоваться'
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-[#F4F5F9] border border-[#DCDFEC]">
                  <div className="w-6 h-6 rounded-full bg-[#FF5A1F]/20 text-[#FF5A1F] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    0{i+1}
                  </div>
                  <p className="font-semibold text-[#171A3A] text-sm sm:text-base">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Секция: Как это работает */}
        <section id="how" className="py-24 max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-black font-['Unbounded',sans-serif]">Как это работает</h2>
            <p className="text-[#4B5079]">Три простых шага к полному порядку в ваших финансах</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-[#DCDFEC] rounded-3xl p-8 space-y-4 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-[#171A3A] text-white flex items-center justify-center font-bold text-lg font-['Unbounded',sans-serif]">1</div>
              <h3 className="text-xl font-bold">Добавьте подписки</h3>
              <p className="text-[#4B5079] text-sm leading-relaxed">Выберите готовые сервисы из каталога или настройте индивидуальные параметры списания.</p>
            </div>
            <div className="bg-white border border-[#DCDFEC] rounded-3xl p-8 space-y-4 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-[#FF5A1F] text-[#171A3A] flex items-center justify-center font-bold text-lg font-['Unbounded',sans-serif]">2</div>
              <h3 className="text-xl font-bold">Получите анализ</h3>
              <p className="text-[#4B5079] text-sm leading-relaxed">Система наглядно покажет расходы за месяц, год и распределение бюджета по категориям.</p>
            </div>
            <div className="bg-white border border-[#DCDFEC] rounded-3xl p-8 space-y-4 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-[#0B7F58] text-white flex items-center justify-center font-bold text-lg font-['Unbounded',sans-serif]">3</div>
              <h3 className="text-xl font-bold">Сокращайте траты</h3>
              <p className="text-[#4B5079] text-sm leading-relaxed">Используйте умные рекомендации, чтобы вовремя отменять ненужные подписки и переходить на годовые тарифы.</p>
            </div>
          </div>
        </section>

        {/* Секция: Тарифы */}
        <section id="pricing" className="py-24 bg-white border-t border-[#DCDFEC]">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl font-black font-['Unbounded',sans-serif]">Тарифы</h2>
              <p className="text-[#4B5079]">Начните бесплатно. Переходите на PRO для максимальной экономии.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {/* FREE */}
              <div className="bg-[#F4F5F9] border border-[#DCDFEC] rounded-3xl p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black font-['Unbounded',sans-serif]">FREE</h3>
                  <p className="text-[#4B5079] text-sm mt-1">Базовый контроль</p>
                  <div className="text-4xl font-black font-['Unbounded',sans-serif] mt-6">0 ₽</div>
                  <p className="text-xs text-[#6E7398] mt-1">Навсегда</p>
                  <ul className="mt-6 space-y-3 text-sm font-medium text-[#4B5079]">
                    <li>✓ До 5 активных подписок</li>
                    <li>✓ Базовая статистика</li>
                    <li>✓ Расходы за месяц и год</li>
                  </ul>
                </div>
                <Link className="mt-8 w-full min-h-[48px] flex items-center justify-center rounded-full bg-white border border-[#DCDFEC] font-bold text-sm hover:border-[#171A3A] transition shadow-sm" href="/dashboard">
                  Начать бесплатно
                </Link>
              </div>

              {/* PRO */}
              <div className="bg-[#171A3A] text-white rounded-3xl p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#FF5A1F] text-[#171A3A] text-xs font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider">
                  Популярный
                </div>
                <div>
                  <h3 className="text-xl font-black font-['Unbounded',sans-serif]">PRO</h3>
                  <p className="text-white/70 text-sm mt-1">Для полной экономии</p>
                  <div className="text-4xl font-black font-['Unbounded',sans-serif] mt-6">
                    399 ₽ <span className="text-sm font-normal opacity-70">/ месяц</span>
                  </div>
                  <p className="text-xs text-[#FF5A1F] font-semibold mt-1">или 3 490 ₽ в год (скидка 27%)</p>
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
              <div className="bg-[#F4F5F9] border border-[#DCDFEC] rounded-3xl p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black font-['Unbounded',sans-serif]">PRO+</h3>
                  <p className="text-[#4B5079] text-sm mt-1">Максимум возможностей</p>
                  <div className="text-4xl font-black font-['Unbounded',sans-serif] mt-6">
                    699 ₽ <span className="text-sm font-normal text-[#6E7398]">/ месяц</span>
                  </div>
                  <p className="text-xs text-[#6E7398] mt-1">или 5 990 ₽ в год</p>
                  <ul className="mt-6 space-y-3 text-sm font-medium text-[#4B5079]">
                    <li>✓ Всё из тарифа PRO</li>
                    <li>✓ AI-анализ расходов</li>
                    <li>✓ Персональные сценарии</li>
                    <li>✓ Продвинутые отчёты</li>
                  </ul>
                </div>
                <Link className="mt-8 w-full min-h-[48px] flex items-center justify-center rounded-full bg-white border border-[#DCDFEC] font-bold text-sm hover:border-[#171A3A] transition shadow-sm" href="/dashboard">
                  Выбрать PRO+
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Футер */}
      <footer className="border-t border-[#DCDFEC] py-12 text-[#6E7398] text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#171A3A] flex items-center justify-center text-white font-bold text-xs">S</div>
            <span className="font-bold text-[#171A3A]">SUBSCOPE</span>
          </div>
          <p>© 2026 SUBSCOPE. Все права защищены.</p>
          <Link className="text-[#FF5A1F] font-bold hover:underline" href="/dashboard">
            Открыть личный кабинет →
          </Link>
        </div>
      </footer>
    </div>
  );
}
