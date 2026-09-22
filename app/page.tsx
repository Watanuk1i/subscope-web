'use client';

import { useState } from 'react';
import Link from 'next/link';

const CATALOG_ITEMS = [
  { id: 'netflix', name: 'Netflix', price: 699 },
  { id: 'spotify', name: 'Spotify', price: 299 },
  { id: 'youtube', name: 'YouTube Premium', price: 399 },
  { id: 'yandex', name: 'Яндекс Плюс', price: 399 },
  { id: 'chatgpt', name: 'ChatGPT', price: 2499 },
  { id: 'google', name: 'Google One', price: 299 },
];

export default function SubscopeLanding() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    netflix: true,
    spotify: true,
    chatgpt: true,
    yandex: true,
  });
  const [rareItems, setRareItems] = useState<Record<string, boolean>>({
    netflix: true,
  });

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
    <div className="min-h-screen bg-[#EDEEF5] dark:bg-[#0E1024] text-[#171A3A] dark:text-[#EEF0FF] font-sans selection:bg-[#3F4DE8] selection:text-white">
      {/* Навигация */}
      <header className="sticky top-0 z-20 bg-[#EDEEF5]/85 dark:bg-[#0E1024]/85 backdrop-blur-md border-b border-[#DCDFEC] dark:border-[#2B3060]">
        <div className="max-w-[1160px] mx-auto px-6 min-h-[64px] flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5 font-bold tracking-wide text-base">
            <div className="w-7 h-7 rounded-full bg-[#171A3A] dark:bg-[#EEF0FF] flex items-center justify-center text-white dark:text-[#171A3A] text-xs font-extrabold">S</div>
            SUBSCOPE
          </a>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-[#4B5079] dark:text-[#B5BAE0]">
            <a href="#how" className="hover:text-[#171A3A] dark:hover:text-white transition">Как это работает</a>
            <a href="#pricing" className="hover:text-[#171A3A] dark:hover:text-white transition">Тарифы</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link className="inline-flex items-center justify-center min-h-[36px] px-5 rounded-full bg-[#171A3A] dark:bg-[#EEF0FF] text-white dark:text-[#171A3A] text-sm font-semibold hover:opacity-90 transition" href="/dashboard">
              Личный кабинет
            </Link>
          </div>
        </div>
      </header>

      {/* Главный блок (Hero) */}
      <main id="top">
        <section className="py-12 md:py-20 max-w-[1160px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 items-start">
          <div className="space-y-6">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1]">
              Контролируйте подписки. Сокращайте лишние расходы.
            </h1>
            <p className="text-lg text-[#4B5079] dark:text-[#B5BAE0] max-w-[54ch] leading-relaxed">
              SUBSCOPE показывает, сколько вы реально тратите на подписки, и помогает найти способы сохранить больше денег каждый месяц.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link className="inline-flex items-center justify-center min-h-[52px] px-8 rounded-full bg-[#FF5A1F] text-[#171A3A] font-bold text-base hover:opacity-95 transition shadow-lg shadow-[#FF5A1F]/20" href="/dashboard">
                Рассчитать мои расходы
              </Link>
            </div>
            <p className="text-sm text-[#6E7398] dark:text-[#8D93BE]">Бесплатно до 5 подписок. Банковская карта не нужна.</p>
          </div>

          {/* Интерактивный чек */}
          <div className="w-full justify-self-end">
            <div className="relative bg-[#FCFCFA] text-[#171A3A] p-6 rounded-t-sm shadow-2xl font-mono text-sm border-b-8 border-[#FCFCFA]">
              <div className="flex justify-between items-baseline border-b-2 border-dashed border-[#C9CBD8] pb-3 mb-3">
                <b className="font-bold text-base">SUBSCOPE</b>
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

        {/* Секция: Как это работает */}
        <section id="how" className="py-20 bg-white dark:bg-[#171A38] border-y border-[#DCDFEC] dark:border-[#2B3060]">
          <div className="max-w-[1160px] mx-auto px-6 space-y-12">
            <h2 className="text-2xl md:text-3xl font-bold">Как это работает</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="text-4xl font-bold text-[#FF5A1F]">01</div>
                <h3 className="text-lg font-semibold">Добавьте подписки</h3>
                <p className="text-[#4B5079] dark:text-[#B5BAE0] text-sm">Выберите сервис из каталога или укажите вручную: стоимость, период и дату списания.</p>
              </div>
              <div className="space-y-4">
                <div className="text-4xl font-bold text-[#FF5A1F]">02</div>
                <h3 className="text-lg font-semibold">Получите анализ</h3>
                <p className="text-[#4B5079] dark:text-[#B5BAE0] text-sm">Узнайте точную сумму трат за месяц и год, а также структуру расходов по категориям.</p>
              </div>
              <div className="space-y-4">
                <div className="text-4xl font-bold text-[#FF5A1F]">03</div>
                <h3 className="text-lg font-semibold">Сокращайте расходы</h3>
                <p className="text-[#4B5079] dark:text-[#B5BAE0] text-sm">Система подскажет, где дублируются подписки или выгоднее перейти на годовой тариф.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Футер */}
      <footer className="py-12 max-w-[1160px] mx-auto px-6 text-[#6E7398] dark:text-[#8D93BE] text-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <p>SUBSCOPE. Рекомендации носят информационный характер.</p>
        <Link className="text-[#3F4DE8] dark:text-[#8E98FF] font-semibold hover:underline" href="/dashboard">Открыть личный кабинет →</Link>
      </footer>
    </div>
  );
}
