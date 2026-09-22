'use client';

import { useState } from 'react';
import Link from 'next/link';

const INITIAL_RECEIPT_ITEMS = [
  { id: 'netflix', name: 'Netflix', price: 699, checked: true, rare: true },
  { id: 'spotify', name: 'Spotify', price: 299, checked: true, rare: false },
  { id: 'youtube', name: 'YouTube Premium', price: 399, checked: true, rare: false },
  { id: 'yandex', name: 'Яндекс Плюс', price: 399, checked: true, rare: false },
  { id: 'chatgpt', name: 'ChatGPT', price: 2499, checked: true, rare: false },
  { id: 'claude', name: 'Claude', price: 1900, checked: false, rare: false },
  { id: 'google', name: 'Google One', price: 299, checked: false, rare: true },
  { id: 'adobe', name: 'Adobe CC', price: 1990, checked: false, rare: false },
  { id: 'vpn', name: 'VPN', price: 299, checked: false, rare: false },
  { id: 'course', name: 'Онлайн-курсы', price: 990, checked: false, rare: false },
];

export default function SubscopeMasterLanding() {
  // Состояние чека
  const [items, setItems] = useState(INITIAL_RECEIPT_ITEMS);
  const [billingPeriod, setBillingPeriod] = useState<'month' | 'year'>('month');
  const [activeRecTab, setActiveRecTab] = useState<'unused' | 'tariff' | 'annual'>('unused');

  const toggleCheck = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const toggleRare = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setItems(prev => prev.map(item => item.id === id ? { ...item, rare: !item.rare } : item));
  };

  const totalMonthly = items.reduce((acc, item) => item.checked ? acc + item.price : acc, 0);
  const rareMonthly = items.reduce((acc, item) => (item.checked && item.rare) ? acc + item.price : acc, 0);

  return (
    <div className="min-h-screen bg-[#EAEBF2] text-[#171A3A] font-sans selection:bg-[#FF5A1F] selection:text-white">
      {/* Навигация */}
      <header className="sticky top-0 z-50 bg-[#EAEBF2]/90 backdrop-blur-md border-b border-[#DCDFEC]">
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
            <a href="#recs" className="hover:text-[#171A3A] transition">Умные рекомендации</a>
            <a href="#pricing" className="hover:text-[#171A3A] transition">Тарифы</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link className="bg-[#171A3A] hover:bg-[#2A2F5B] text-white px-6 py-3 rounded-full text-sm font-bold transition shadow-lg shadow-[#171A3A]/20 active:scale-95" href="/dashboard">
              Личный кабинет
            </Link>
          </div>
        </div>
      </header>

      {/* Главный экран (Hero) */}
      <main>
        <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-[#FF5A1F]/10 border border-[#FF5A1F]/20 px-4 py-2 rounded-full text-xs font-bold text-[#FF5A1F] uppercase tracking-wider">
              ✦ Контроль регулярных финансов
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#171A3A] leading-[1.1] font-['Unbounded',sans-serif]">
              Контролируйте расходы на подписки в один клик
            </h1>

            <p className="text-lg sm:text-xl text-[#4B5079] max-w-xl leading-relaxed font-normal">
              Хватит терять деньги на забытых автопродлениях. SUBSCOPE собирает все ваши сервисы в единую панель, считает траты и находит точки реальной экономии.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link className="w-full sm:w-auto bg-[#FF5A1F] hover:bg-[#E54D15] text-[#171A3A] px-8 py-4 rounded-2xl font-bold text-base transition shadow-xl shadow-[#FF5A1F]/25 text-center active:scale-95" href="/dashboard">
                Рассчитать мои расходы
              </Link>
              <a href="#how" className="w-full sm:w-auto bg-white hover:bg-[#DFE1EC] text-[#171A3A] border border-[#DCDFEC] px-8 py-4 rounded-2xl font-bold text-base transition text-center shadow-sm">
                Как это работает
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#DCDFEC]">
              <div>
                <p className="text-2xl font-black font-['Unbounded',sans-serif]">5 сек</p>
                <p className="text-xs text-[#6E7398] mt-0.5">Добавление сервиса</p>
              </div>
              <div>
                <p className="text-2xl font-black font-['Unbounded',sans-serif]">до 30%</p>
                <p className="text-xs text-[#6E7398] mt-0.5">Экономия бюджета</p>
              </div>
              <div>
                <p className="text-2xl font-black font-['Unbounded',sans-serif]">100%</p>
                <p className="text-xs text-[#6E7398] mt-0.5">Контроль списаний</p>
              </div>
            </div>
          </div>

          {/* ИНТЕРАКТИВНЫЙ ЧЕК С НАСТОЯЩИМ ТРЕУГОЛЬНЫМ НИЗОМ */}
          <div className="w-full max-w-[440px] mx-auto justify-self-end">
            <div className="relative bg-[#FCFCFA] text-[#171A3A] p-6 sm:p-8 rounded-t-md shadow-2xl font-mono text-sm border border-[#C9CBD8]">
              {/* Треугольный отрывной низ чека с помощью маски SVG */}
              <div
                className="absolute left-0 right-0 -bottom-3.5 h-4 bg-[#FCFCFA]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='8' viewBox='0 0 16 8'%3E%3Cpath d='M0 0l8 8 8-8z' fill='%23FCFCFA'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'repeat-x',
                  backgroundSize: '16px 8px'
                }}
              />

              {/* Шапка чека */}
              <div className="flex justify-between items-baseline border-b-2 border-dashed border-[#C9CBD8] pb-4 mb-4">
                <b className="font-black text-base font-['Unbounded',sans-serif] tracking-wide">SUBSCOPE</b>
                <span className="text-xs text-[#65698A] font-sans">Чек ваших подписок</span>
              </div>
              <p className="text-xs text-[#65698A] font-sans mb-5 leading-relaxed">
                Отметьте сервисы, за которые платите, и те, которыми пользуетесь редко.
              </p>

              {/* Список сервисов */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
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
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-[#EAEBF2] border border-[#DCDFEC]">
                  <div className="w-6 h-6 rounded-full bg-[#FF5A1F]/20 text-[#FF5A1F] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    0{i+1}
                  </div>
                  <p className="font-semibold text-[#171A3A] text-sm sm:text-base">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Секция: Как это работает (с живым примером данных) */}
        <section id="how" className="py-24 max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-black font-['Unbounded',sans-serif]">Как это работает</h2>
            <p className="text-[#4B5079]">Три простых шага к полному порядку в ваших финансах</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-[#DCDFEC] rounded-3xl p-8 space-y-4 shadow-sm hover:shadow-md transition relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-[#171A3A] text-white flex items-center justify-center font-bold text-lg font-['Unbounded',sans-serif]">1</div>
              <h3 className="text-xl font-bold">Добавьте подписки</h3>
              <p className="text-[#4B5079] text-sm leading-relaxed">Выберите готовые сервисы из каталога или настройте индивидуальные параметры списания.</p>

              {/* Пример данных прямо в карточке */}
              <div className="mt-4 pt-4 border-t border-[#DCDFEC] space-y-2 text-xs font-mono">
                <div className="flex justify-between bg-[#EAEBF2] p-2 rounded-lg">
                  <span>ChatGPT Plus</span>
                  <span className="font-bold">2 499 ₽</span>
                </div>
                <div className="flex justify-between bg-[#EAEBF2] p-2 rounded-lg">
                  <span>Яндекс Плюс</span>
                  <span className="font-bold">399 ₽</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#DCDFEC] rounded-3xl p-8 space-y-4 shadow-sm hover:shadow-md transition relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-[#FF5A1F] text-[#171A3A] flex items-center justify-center font-bold text-lg font-['Unbounded',sans-serif]">2</div>
              <h3 className="text-xl font-bold">Получите анализ</h3>
              <p className="text-[#4B5079] text-sm leading-relaxed">Система наглядно покажет расходы за месяц, год и распределение бюджета по категориям.</p>

              {/* Пример аналитики в карточке */}
              <div className="mt-4 pt-4 border-t border-[#DCDFEC] space-y-2 text-xs">
                <div className="flex justify-between font-semibold">
                  <span>Всего в месяц:</span>
                  <span className="text-[#FF5A1F] font-bold">2 898 ₽</span>
                </div>
                <div className="w-full bg-[#EAEBF2] h-2 rounded-full overflow-hidden flex">
                  <div className="bg-[#171A3A] w-[75%]" />
                  <div className="bg-[#FF5A1F] w-[25%]" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#DCDFEC] rounded-3xl p-8 space-y-4 shadow-sm hover:shadow-md transition relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-[#0B7F58] text-white flex items-center justify-center font-bold text-lg font-['Unbounded',sans-serif]">3</div>
              <h3 className="text-xl font-bold">Сокращайте траты</h3>
              <p className="text-[#4B5079] text-sm leading-relaxed">Используйте умные рекомендации, чтобы вовремя отменять ненужные подписки и переходить на годовые тарифы.</p>

              {/* Пример экономии в карточке */}
              <div className="mt-4 pt-4 border-t border-[#DCDFEC] text-xs bg-[#DDF3E9] text-[#0B7F58] p-3 rounded-xl font-semibold">
                💡 Экономия с годовым планом: до 20% бюджета ежемесячно.
              </div>
            </div>
          </div>
        </section>

        {/* СЕКЦИЯ УМНЫХ РЕКОМЕНДАЦИЙ (ПЕРЕОСМЫСЛЕННАЯ С ТАБАМИ) */}
        <section id="recs" className="py-24 bg-white border-y border-[#DCDFEC]">
          <div className="max-w-7xl mx-auto px-6 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl font-black font-['Unbounded',sans-serif]">Умные рекомендации</h2>
              <p className="text-[#4B5079]">Интерактивный блок подскажет, где можно сэкономить прямо сейчас</p>
            </div>

            {/* Переключатель вкладок рекомендаций */}
            <div className="flex justify-center">
              <div className="inline-flex p-1.5 bg-[#EAEBF2] border border-[#DCDFEC] rounded-full max-w-md w-full">
                <button
                  onClick={() => setActiveRecTab('unused')}
                  className={`flex-1 py-2.5 px-4 rounded-full font-bold text-xs sm:text-sm transition ${activeRecTab === 'unused' ? 'bg-[#171A3A] text-white shadow-md' : 'text-[#4B5079] hover:text-[#171A3A]'}`}
                >
                  Неиспользуемые
                </button>
                <button
                  onClick={() => setActiveRecTab('tariff')}
                  className={`flex-1 py-2.5 px-4 rounded-full font-bold text-xs sm:text-sm transition ${activeRecTab === 'tariff' ? 'bg-[#171A3A] text-white shadow-md' : 'text-[#4B5079] hover:text-[#171A3A]'}`}
                >
                  Смена тарифа
                </button>
                <button
                  onClick={() => setActiveRecTab('annual')}
                  className={`flex-1 py-2.5 px-4 rounded-full font-bold text-xs sm:text-sm transition ${activeRecTab === 'annual' ? 'bg-[#171A3A] text-white shadow-md' : 'text-[#4B5079] hover:text-[#171A3A]'}`}
                >
                  Годовая оплата
                </button>
              </div>
            </div>

            {/* Контент табов рекомендаций */}
            <div className="max-w-3xl mx-auto bg-[#EAEBF2] border border-[#DCDFEC] rounded-3xl p-8 sm:p-10 shadow-sm transition-all duration-300">
              {activeRecTab === 'unused' && (
                <div className="space-y-4">
                  <span className="inline-block bg-[#FFF0D9] text-[#9A5B00] text-xs font-bold px-3 py-1 rounded-full">
                    Внимание: редкое использование
                  </span>
                  <h3 className="text-2xl font-black font-['Unbounded',sans-serif]">Netflix — 699 ₽ / месяц</h3>
                  <p className="text-[#4B5079] leading-relaxed">
                    Вы указали, что открываете этот сервис крайне редко. Отмена подписки сэкономит вам{' '}
                    <strong className="text-[#0B7F58]">8 388 ₽ в год</strong> без потери важного функционала.
                  </p>
                  <div className="pt-2">
                    <Link className="inline-flex items-center justify-center bg-[#171A3A] text-white font-bold px-6 py-3 rounded-full text-sm shadow-md hover:bg-[#2A2F5B] transition" href="/dashboard">
                      Рассмотреть отмену →
                    </Link>
                  </div>
                </div>
              )}

              {activeRecTab === 'tariff' && (
                <div className="space-y-4">
                  <span className="inline-block bg-[#DDF3E9] text-[#0B7F58] text-xs font-bold px-3 py-1 rounded-full">
                    Доступен более дешевый план
                  </span>
                  <h3 className="text-2xl font-black font-['Unbounded',sans-serif]">Оптимизация тарифа у провайдера</h3>
                  <p className="text-[#4B5079] leading-relaxed">
                    Для одного из ваших сервисов доступен базовый тариф с меньшим набором функций, который дешевле на{' '}
                    <strong className="text-[#0B7F58]">200 ₽ в месяц</strong>.
                  </p>
                  <div className="pt-2">
                    <Link className="inline-flex items-center justify-center bg-[#171A3A] text-white font-bold px-6 py-3 rounded-full text-sm shadow-md hover:bg-[#2A2F5B] transition" href="/dashboard">
                      Посмотреть варианты →
                    </Link>
                  </div>
                </div>
              )}

              {activeRecTab === 'annual' && (
                <div className="space-y-4">
                  <span className="inline-block bg-[#DDF3E9] text-[#0B7F58] text-xs font-bold px-3 py-1 rounded-full">
                    Выгода при оплате за год
                  </span>
                  <h3 className="text-2xl font-black font-['Unbounded',sans-serif]">Переход на годовые подписки</h3>
                  <p className="text-[#4B5079] leading-relaxed">
                    У 3 ваших сервисов есть годовые планы со скидкой до 20%. Оплата сразу вернет вам до{' '}
                    <strong className="text-[#0B7F58]">4 500 ₽</strong> чистой экономии.
                  </p>
                  <div className="pt-2">
                    <Link className="inline-flex items-center justify-center bg-[#171A3A] text-white font-bold px-6 py-3 rounded-full text-sm shadow-md hover:bg-[#2A2F5B] transition" href="/dashboard">
                      Применить рекомендации →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Секция: ТАРИФЫ (С ПЕРЕКЛЮЧАТЕЛЕМ МЕСЯЦ / ГОД) */}
        <section id="pricing" className="py-24 max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-black font-['Unbounded',sans-serif]">Тарифы</h2>
            <p className="text-[#4B5079]">Выберите подходящий план. При оплате за год действует специальная скидка.</p>

            {/* Переключатель месяца / года для тарифов */}
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
                <h3 className="text-xl font-black font-['Unbounded',sans-serif]">PRO</h3>
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
                <h3 className="text-xl font-black font-['Unbounded',sans-serif]">PRO+</h3>
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
        </section>
      </main>

      {/* ФУТЕР (РАСШИРЕННЫЙ, ИНТЕРЕСНЫЙ И ИНФОРМАТИВНЫЙ) */}
      <footer className="bg-white border-t border-[#DCDFEC] py-16 text-sm text-[#4B5079]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#171A3A] flex items-center justify-center text-white font-bold text-sm">S</div>
              <span className="font-black text-lg tracking-wider text-[#171A3A] font-['Unbounded',sans-serif]">SUBSCOPE</span>
            </div>
            <p className="text-xs text-[#6E7398] leading-relaxed">
              Интеллектуальная платформа для контроля регулярных подписок, анализа трат и предотвращения ненужных автопродлений.
            </p>
          </div>

          <div>
            <p className="font-bold text-[#171A3A] mb-4">Продукт</p>
            <ul className="space-y-2 text-xs">
              <li><Link href="/dashboard" className="hover:text-[#FF5A1F] transition">Личный кабинет</Link></li>
              <li><Link href="/pricing" className="hover:text-[#FF5A1F] transition">Тарифы и цены</Link></li>
              <li><Link href="/support" className="hover:text-[#FF5A1F] transition">Служба поддержки</Link></li>
              <li><Link href="/login" className="hover:text-[#FF5A1F] transition">Вход в систему</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-[#171A3A] mb-4">Сколько подписок?</p>
            <div className="bg-[#EAEBF2] p-4 rounded-2xl space-y-2">
              <p className="text-xs font-semibold text-[#171A3A]">В среднем у пользователя:</p>
              <p className="text-2xl font-black text-[#FF5A1F] font-['Unbounded',sans-serif]">6–9 шт</p>
              <p className="text-[11px] text-[#6E7398]">Около 40% из них списывают деньги впустую.</p>
            </div>
          </div>

          <div>
            <p className="font-bold text-[#171A3A] mb-4">Безопасность</p>
            <p className="text-xs text-[#6E7398] leading-relaxed">
              Мы не запрашиваем данные банковских карт и пароли от сторонних сервисов. Все расчеты и списки подписок хранятся в защищенной базе данных Supabase.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-[#DCDFEC] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#6E7398]">
          <p>© 2026 SUBSCOPE. Все права защищены.</p>
          <p>Рекомендации носят информационный характер.</p>
        </div>
      </footer>
    </div>
  );
}
