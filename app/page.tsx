'use client';

import { useState } from 'react';
import Link from 'next/link';

const CATALOG_ITEMS = [
  { id: 'netflix', name: 'Netflix', price: 699, rare: true },
  { id: 'spotify', name: 'Spotify', price: 299, rare: false },
  { id: 'youtube', name: 'YouTube Premium', price: 399, rare: false },
  { id: 'yandex', name: 'Яндекс Плюс', price: 399, rare: false },
  { id: 'chatgpt', name: 'ChatGPT', price: 2499, rare: false },
  { id: 'google', name: 'Google One', price: 299, rare: false },
];

export default function SubscopeLanding() {
  // Состояние интерактивного чека
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    netflix: true,
    spotify: true,
    chatgpt: true,
    yandex: true,
  });
  const [rareItems, setRareItems] = useState<Record<string, boolean>>({
    netflix: true,
  });

  // Состояние переключения тарифов на лендинге (месяц / год)
  const [billingPeriod, setBillingPeriod] = useState<'month' | 'year'>('month');

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleRare = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setRareItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totalMonthly = CATALOG_ITEMS.reduce((acc, item) => {
    if (checkedItems[item.id]) return acc + item.price;
    return acc;
  }, 0);

  const rareMonthly = CATALOG_ITEMS.reduce((acc, item) => {
    if (checkedItems[item.id] && rareItems[item.id]) return acc + item.price;
    return acc;
  }, 0);

  return (
    <div className="min-h-screen bg-[#EDEEF5] dark:bg-[#0E1024] text-[#171A3A] dark:text-[#EEF0FF] font-sans selection:bg-[#3F4DE8] selection:text-white scroll-smooth">
      {/* Шапка / Навигация */}
      <header className="sticky top-0 z-20 bg-[#EDEEF5]/88 dark:bg-[#0E1024]/88 backdrop-blur-md border-b border-[#DCDFEC] dark:border-[#2B3060]">
        <div className="max-w-[1160px] mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5 font-bold tracking-wide text-base font-['Unbounded',sans-serif]">
            <div className="w-7 h-7 rounded-full bg-[#171A3A] dark:bg-[#EEF0FF] flex items-center justify-center text-white dark:text-[#171A3A] text-xs font-extrabold">S</div>
            SUBSCOPE
          </a>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-[#4B5079] dark:text-[#B5BAE0]">
            <a href="#how" className="hover:text-[#171A3A] dark:hover:text-white transition">Как это работает</a>
            <a href="#recs" className="hover:text-[#171A3A] dark:hover:text-white transition">Рекомендации</a>
            <a href="#pricing" className="hover:text-[#171A3A] dark:hover:text-white transition">Тарифы</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link className="inline-flex items-center justify-center min-h-[36px] px-5 rounded-full bg-[#171A3A] dark:bg-[#EEF0FF] text-white dark:text-[#171A3A] text-sm font-semibold hover:opacity-90 transition shadow-sm" href="/dashboard">
              Личный кабинет
            </Link>
          </div>
        </div>
      </header>

      {/* Главный блок (Hero) + Интерактивный чек */}
      <main id="top">
        <section className="py-12 md:py-20 max-w-[1160px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 items-start">
          <div className="space-y-6">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1] font-['Unbounded',sans-serif]">
              Контролируйте подписки. Сокращайте лишние расходы.
            </h1>
            <p className="text-lg text-[#4B5079] dark:text-[#B5BAE0] max-w-[54ch] leading-relaxed">
              SUBSCOPE показывает, сколько вы реально тратите на подписки, и помогает найти способы сохранить больше денег каждый месяц.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link className="inline-flex items-center justify-center min-h-[52px] px-8 rounded-full bg-[#FF5A1F] text-[#171A3A] font-bold text-base hover:opacity-95 transition shadow-lg shadow-[#FF5A1F]/20" href="/dashboard">
                Рассчитать мои расходы
              </Link>
              <Link className="inline-flex items-center justify-center min-h-[52px] px-8 rounded-full border-2 border-[#C6CADF] dark:border-[#3B4180] text-[#171A3A] dark:text-[#EEF0FF] font-bold text-base hover:bg-white/50 dark:hover:bg-white/5 transition" href="/dashboard">
                Посмотреть демо
              </Link>
            </div>
            <p className="text-sm text-[#6E7398] dark:text-[#8D93BE]">Бесплатно до 5 подписок. Банковская карта не нужна.</p>
          </div>

          {/* Интерактивный чек */}
          <div className="w-full justify-self-end">
            <div className="relative bg-[#FCFCFA] text-[#171A3A] p-6 rounded-t-sm shadow-2xl font-mono text-sm border-b-8 border-[#FCFCFA]">
              <div className="flex justify-between items-baseline border-b-2 border-dashed border-[#C9CBD8] pb-3 mb-3">
                <b className="font-bold font-['Unbounded',sans-serif] text-base">SUBSCOPE</b>
                <span className="text-xs text-[#65698A]">Чек ваших подписок</span>
              </div>
              <p className="text-xs text-[#65698A] font-sans mb-4">Отметьте сервисы, за которые платите, и те, которыми пользуетесь редко.</p>

              <div className="space-y-3">
                {CATALOG_ITEMS.map(item => {
                  const isOn = !!checkedItems[item.id];
                  const isRare = !!rareItems[item.id];
                  return (
                    <div key={item.id} className={`flex items-center gap-3 py-1.5 ${!isOn ? 'opacity-50' : ''}`}>
                      <label className="flex items-center gap-2.5 cursor-pointer flex-1 select-none">
                        <input
                          type="checkbox"
                          checked={isOn}
                          onChange={() => toggleCheck(item.id)}
                          className="w-4 h-4 accent-[#171A3A]"
                        />
                        <span className="truncate">{item.name}</span>
                      </label>
                      <div className="border-b border-dotted border-[#C9CBD8] flex-1 mx-2" />
                      <span className="font-bold whitespace-nowrap">{item.price} ₽</span>
                      <button
                        type="button"
                        onClick={(e) => toggleRare(item.id, e)}
                        className={`px-2 py-0.5 text-xs rounded border transition ${isRare ? 'bg-[#FFE3D6] border-[#FF5A1F] text-[#8A2B05] font-semibold' : 'border-[#C9CBD8] text-[#65698A]'}`}
                      >
                        редко
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="border-t-2 border-dashed border-[#C9CBD8] mt-5 pt-4 space-y-2 text-xs font-sans">
                <div className="flex justify-between text-sm font-bold font-mono">
                  <span>В месяц</span>
                  <span>{totalMonthly} ₽</span>
                </div>
                <div className="flex justify-between font-mono text-[#65698A]">
                  <span>В год</span>
                  <span>{totalMonthly * 12} ₽</span>
                </div>
                <div className="flex justify-between text-[#0B7F58] font-mono">
                  <span>Редко используете</span>
                  <span>{rareMonthly} ₽/мес</span>
                </div>
                <div className="flex justify-between text-[#0B7F58] font-mono font-bold">
                  <span>Можно вернуть за год</span>
                  <span>{rareMonthly * 12} ₽</span>
                </div>
              </div>

              <Link className="w-full mt-5 inline-flex items-center justify-center min-h-[44px] bg-[#FF5A1F] text-[#171A3A] font-bold rounded-full text-sm font-sans hover:opacity-95 transition shadow-sm" href="/dashboard">
                Найти возможности для экономии
              </Link>
            </div>
          </div>
        </section>

        {/* Секция: Деньги уходят незаметно */}
        <section className="py-16 md:py-24 bg-white dark:bg-[#171A38] border-y border-[#DCDFEC] dark:border-[#2B3060]">
          <div className="max-w-[1160px] mx-auto px-6 grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold font-['Unbounded',sans-serif]">Деньги уходят незаметно</h2>
              <p className="text-[#4B5079] dark:text-[#B5BAE0] mt-4 text-base md:text-lg">Подписки оформляются за минуту, а вспоминать о них приходится месяцами. Обычно из виду пропадает пять вещей.</p>
            </div>
            <ul className="space-y-6">
              <li className="border-t border-[#DCDFEC] dark:border-[#2B3060] pt-4">
                <b className="text-lg font-semibold block">Какие подписки у вас активны</b>
                <span className="text-[#4B5079] dark:text-[#B5BAE0] text-sm">Пробный период, семейный доступ и старая карта живут в разных местах.</span>
              </li>
              <li className="border-t border-[#DCDFEC] dark:border-[#2B3060] pt-4">
                <b className="text-lg font-semibold block">Сколько вы платите</b>
                <span className="text-[#4B5079] dark:text-[#B5BAE0] text-sm">Небольшие суммы по отдельности складываются в заметный годовой расход.</span>
              </li>
              <li className="border-t border-[#DCDFEC] dark:border-[#2B3060] pt-4">
                <b className="text-lg font-semibold block">Когда списываются деньги</b>
                <span className="text-[#4B5079] dark:text-[#B5BAE0] text-sm">Дата списания вспоминается уже после уведомления из банка.</span>
              </li>
              <li className="border-t border-[#DCDFEC] dark:border-[#2B3060] pt-4">
                <b className="text-lg font-semibold block">Какие сервисы вы перестали использовать</b>
                <span className="text-[#4B5079] dark:text-[#B5BAE0] text-sm">Подписка осталась, а привычка пользоваться ей — нет.</span>
              </li>
              <li className="border-t border-[#DCDFEC] dark:border-[#2B3060] pt-4">
                <b className="text-lg font-semibold block">Какие тарифы стали дороже</b>
                <span className="text-[#4B5079] dark:text-[#B5BAE0] text-sm">Цена выросла, а письмо об этом осталось непрочитанным.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Секция: Как это работает */}
        <section id="how" className="py-20 max-w-[1160px] mx-auto px-6 space-y-12">
          <h2 className="text-2xl md:text-3xl font-bold font-['Unbounded',sans-serif]">Как это работает</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="text-4xl font-bold font-['Unbounded',sans-serif] text-[#FF5A1F]">01</div>
              <h3 className="text-lg font-semibold">Добавьте подписки</h3>
              <p className="text-[#4B5079] dark:text-[#B5BAE0] text-sm">Выберите сервис из каталога или введите вручную: цена, период оплаты, дата следующего списания.</p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl font-bold font-['Unbounded',sans-serif] text-[#FF5A1F]">02</div>
              <h3 className="text-lg font-semibold">Получите анализ расходов</h3>
              <p className="text-[#4B5079] dark:text-[#B5BAE0] text-sm">Сколько уходит в месяц и в год, по каким категориям и когда ближайшие списания.</p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl font-bold font-['Unbounded',sans-serif] text-[#FF5A1F]">03</div>
              <h3 className="text-lg font-semibold">Найдите возможности для экономии</h3>
              <p className="text-[#4B5079] dark:text-[#B5BAE0] text-sm">Рекомендации с суммой в рублях: что отменить, где сменить тариф, где выгоднее платить за год.</p>
            </div>
          </div>
        </section>

        {/* Секция: Умные рекомендации */}
        <section id="recs" className="py-20 bg-white dark:bg-[#171A38] border-y border-[#DCDFEC] dark:border-[#2B3060]">
          <div className="max-w-[1160px] mx-auto px-6 space-y-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-['Unbounded',sans-serif]">Умные рекомендации</h2>
              <p className="text-[#4B5079] dark:text-[#B5BAE0] mt-2">Не просто цифры, а конкретные шаги: что сделать и сколько это вернёт.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 border border-[#C6CADF] dark:border-[#3B4180] rounded-2xl overflow-hidden bg-[#EDEEF5] dark:bg-[#171A38]">
              <div className="p-8 border-b md:border-r border-[#C6CADF] dark:border-[#3B4180] space-y-3">
                <h3 className="text-lg font-semibold">Можно сэкономить</h3>
                <p className="text-sm text-[#4B5079] dark:text-[#B5BAE0]">Годовая оплата обычно выгоднее помесячной. Покажем, у каких сервисов это имеет смысл.</p>
                <span className="inline-block pt-2 font-bold text-[#0B7F58] dark:text-[#3ED9A2]">до 425 ₽ в месяц</span>
              </div>
              <div className="p-8 border-b border-[#C6CADF] dark:border-[#3B4180] space-y-3">
                <h3 className="text-lg font-semibold">Неиспользуемая подписка</h3>
                <p className="text-sm text-[#4B5079] dark:text-[#B5BAE0]">Netflix за 699 ₽ в месяц, а вы открывали его редко. Рассмотрите отмену.</p>
                <span className="inline-block pt-2 font-bold text-[#0B7F58] dark:text-[#3ED9A2]">699 ₽ в месяц</span>
              </div>
              <div className="p-8 border-b md:border-b-0 md:border-r border-[#C6CADF] dark:border-[#3B4180] space-y-3">
                <h3 className="text-lg font-semibold">Есть более выгодный тариф</h3>
                <p className="text-sm text-[#4B5079] dark:text-[#B5BAE0]">Часть функций вам не нужна, а тариф с меньшим набором стоит заметно дешевле.</p>
                <span className="inline-block pt-2 font-bold text-[#0B7F58] dark:text-[#3ED9A2]">200 ₽ в месяц</span>
              </div>
              <div className="p-8 space-y-3">
                <h3 className="text-lg font-semibold">Несколько похожих сервисов</h3>
                <p className="text-sm text-[#4B5079] dark:text-[#B5BAE0]">Две музыкальные подписки сразу: оставьте ту, которой пользуетесь чаще.</p>
                <span className="inline-block pt-2 font-bold text-[#0B7F58] dark:text-[#3ED9A2]">299 ₽ в месяц</span>
              </div>
            </div>
          </div>
        </section>

        {/* Секция: Тарифы */}
        <section id="pricing" className="py-20 max-w-[1160px] mx-auto px-6 space-y-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-['Unbounded',sans-serif]">Тарифы</h2>
            <p className="text-[#4B5079] dark:text-[#B5BAE0] mt-2">Начните бесплатно. Платные тарифы открывают рекомендации по экономии, календарь списаний и прогноз.</p>
          </div>

          {/* Переключатель месяца / года */}
          <div className="inline-flex p-1 border border-[#C6CADF] dark:border-[#3B4180] rounded-full bg-white dark:bg-[#171A38]">
            <button
              type="button"
              onClick={() => setBillingPeriod('month')}
              className={`px-5 py-2 rounded-full font-semibold text-sm transition ${billingPeriod === 'month' ? 'bg-[#171A3A] dark:bg-[#EEF0FF] text-white dark:text-[#171A3A]' : 'text-[#4B5079] dark:text-[#B5BAE0]'}`}
            >
              Помесячно
            </button>
            <button
              type="button"
              onClick={() => setBillingPeriod('year')}
              className={`px-5 py-2 rounded-full font-semibold text-sm transition ${billingPeriod === 'year' ? 'bg-[#171A3A] dark:bg-[#EEF0FF] text-white dark:text-[#171A3A]' : 'text-[#4B5079] dark:text-[#B5BAE0]'}`}
            >
              За год
            </button>
          </div>

          {/* Карточки тарифов */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* FREE */}
            <div className="bg-white dark:bg-[#171A38] border border-[#DCDFEC] dark:border-[#2B3060] rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold font-['Unbounded',sans-serif]">FREE</h3>
                <p className="text-[#4B5079] dark:text-[#B5BAE0] text-sm mt-1">Чтобы навести порядок</p>
                <div className="text-3xl font-bold font-['Unbounded',sans-serif] mt-6">0 ₽</div>
                <p className="text-xs text-[#6E7398] mt-1">Навсегда</p>
                <ul className="mt-6 space-y-3 text-sm">
                  <li className="flex items-center gap-2">✓ До 5 подписок</li>
                  <li className="flex items-center gap-2">✓ Базовая статистика</li>
                  <li className="flex items-center gap-2">✓ Месячные и годовые расходы</li>
                </ul>
              </div>
              <Link className="mt-8 w-full min-h-[44px] flex items-center justify-center rounded-full border border-[#C6CADF] dark:border-[#3B4180] font-semibold text-sm hover:border-[#171A3A] dark:hover:border-white transition" href="/dashboard">
                Начать бесплатно
              </Link>
            </div>

            {/* PRO */}
            <div className="bg-[#171A3A] dark:bg-[#EEF0FF] text-white dark:text-[#171A3A] rounded-3xl p-8 flex flex-col justify-between shadow-xl">
              <div>
                <h3 className="text-xl font-bold font-['Unbounded',sans-serif]">PRO</h3>
                <p className="text-white/70 dark:text-[#171A3A]/70 text-sm mt-1">Для тех, кто хочет сэкономить</p>
                <div className="text-3xl font-bold font-['Unbounded',sans-serif] mt-6">
                  {billingPeriod === 'month' ? '399 ₽' : '3 490 ₽'}
                  <span className="text-sm font-normal opacity-80"> / {billingPeriod === 'month' ? 'месяц' : 'год'}</span>
                </div>
                <p className="text-xs opacity-70 mt-1">{billingPeriod === 'year' ? 'экономия около 27%' : 'или 3 490 ₽ в год'}</p>
                <ul className="mt-6 space-y-3 text-sm">
                  <li className="flex items-center gap-2">✓ Неограниченно подписок</li>
                  <li className="flex items-center gap-2">✓ Рекомендации по экономии</li>
                  <li className="flex items-center gap-2">✓ Календарь списаний</li>
                  <li className="flex items-center gap-2">✓ Прогноз расходов</li>
                </ul>
              </div>
              <Link className="mt-8 w-full min-h-[44px] flex items-center justify-center rounded-full bg-[#FF5A1F] text-[#171A3A] font-bold text-sm hover:opacity-95 transition shadow-md" href="/dashboard">
                Выбрать PRO
              </Link>
            </div>

            {/* PRO+ */}
            <div className="bg-white dark:bg-[#171A38] border border-[#DCDFEC] dark:border-[#2B3060] rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold font-['Unbounded',sans-serif]">PRO+</h3>
                <p className="text-[#4B5079] dark:text-[#B5BAE0] text-sm mt-1">Максимум выгоды</p>
                <div className="text-3xl font-bold font-['Unbounded',sans-serif] mt-6">
                  {billingPeriod === 'month' ? '699 ₽' : '5 990 ₽'}
                  <span className="text-sm font-normal text-[#6E7398]"> / {billingPeriod === 'month' ? 'месяц' : 'год'}</span>
                </div>
                <p className="text-xs text-[#6E7398] mt-1">{billingPeriod === 'year' ? 'максимальная скидка' : 'или 5 990 ₽ в год'}</p>
                <ul className="mt-6 space-y-3 text-sm">
                  <li className="flex items-center gap-2">✓ Всё из PRO</li>
                  <li className="flex items-center gap-2">✓ AI-анализ расходов</li>
                  <li className="flex items-center gap-2">✓ Сценарии экономии</li>
                  <li className="flex items-center gap-2">✓ Сравнение тарифов</li>
                </ul>
              </div>
              <Link className="mt-8 w-full min-h-[44px] flex items-center justify-center rounded-full border border-[#C6CADF] dark:border-[#3B4180] font-semibold text-sm hover:border-[#171A3A] dark:hover:border-white transition" href="/dashboard">
                Выбрать PRO+
              </Link>
            </div>
          </div>
        </section>

        {/* Финальный призыв */}
        <section className="py-16 max-w-[1160px] mx-auto px-6">
          <div className="bg-[#171A3A] dark:bg-[#1F2346] text-white rounded-3xl p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <h2 className="text-2xl md:text-4xl font-bold font-['Unbounded',sans-serif] max-w-xl">Узнайте, сколько подписки стоят на самом деле</h2>
            <Link className="inline-flex items-center justify-center min-h-[52px] px-8 rounded-full bg-[#FF5A1F] text-[#171A3A] font-bold text-base hover:opacity-95 transition whitespace-nowrap shadow-lg shadow-[#FF5A1F]/20" href="/dashboard">
              Найти возможности для экономии
            </Link>
          </div>
        </section>
      </main>

      {/* Футер */}
      <footer className="py-12 border-t border-[#DCDFEC] dark:border-[#2B3060] max-w-[1160px] mx-auto px-6 text-[#6E7398] dark:text-[#8D93BE] text-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <p>SUBSCOPE. Рекомендации носят информационный характер, условия проверяйте на сайтах.</p>
        <Link className="text-[#3F4DE8] dark:text-[#8E98FF] font-semibold hover:underline" href="/dashboard">Открыть личный кабинет →</Link>
      </footer>
    </div>
  );
}
