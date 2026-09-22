'use client';

import { useEffect } from 'react';

export default function SubscopeApp() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#EDEEF5] dark:bg-[#0E1024] text-[#171A3A] dark:text-[#EEF0FF] font-['Onest',sans-serif] selection:bg-[#3F4DE8] selection:text-white">
      {/* Шапка лендинга */}
      <header className="sticky top-0 z-20 bg-[#EDEEF5]/85 dark:bg-[#0E1024]/85 backdrop-blur-md border-b border-[#DCDFEC] dark:border-[#2B3060]">
        <div className="max-w-[1160px] mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5 font-bold tracking-wide text-base">
            <div className="w-7 h-7 rounded-full bg-[#171A3A] dark:bg-[#EEF0FF] flex items-center justify-center text-white dark:text-[#171A3A] font-extrabold text-xs">S</div>
            SUBSCOPE
          </a>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-[#4B5079] dark:text-[#B5BAE0]">
            <a href="#how" className="hover:text-[#171A3A] dark:hover:text-white transition">Как это работает</a>
            <a href="#recs" className="hover:text-[#171A3A] dark:hover:text-white transition">Рекомендации</a>
            <a href="#pricing" className="hover:text-[#171A3A] dark:hover:text-white transition">Тарифы</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="/dashboard" className="inline-flex items-center justify-center min-h-[36px] px-4 rounded-full bg-[#171A3A] dark:bg-[#EEF0FF] text-white dark:text-[#171A3A] text-sm font-semibold hover:opacity-90 transition">
              Личный кабинет
            </a>
          </div>
        </div>
      </header>

      {/* Основной блок лендинга */}
      <main id="top">
        <section className="py-12 md:py-20 max-w-[1160px] mx-auto px-6 grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1] font-['Unbounded',sans-serif]">
              Контролируйте подписки. Сокращайте лишние расходы.
            </h1>
            <p className="text-lg text-[#4B5079] dark:text-[#B5BAE0] max-w-[54ch] leading-relaxed">
              SUBSCOPE показывает, сколько вы реально тратите на подписки, и помогает найти способы сохранить больше денег каждый месяц.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="/dashboard" className="inline-flex items-center justify-center min-h-[52px] px-7 rounded-full bg-[#FF5A1F] text-[#171A3A] font-bold text-base hover:opacity-95 transition shadow-lg shadow-[#FF5A1F]/20">
                Рассчитать мои расходы
              </a>
            </div>
            <p className="text-sm text-[#6E7398] dark:text-[#8D93BE]">Бесплатно до 5 подписок. Банковская карта не нужна.</p>
          </div>

          <div className="justify-self-end w-full max-w-[420px]">
            <div className="bg-[#FCFCFA] text-[#171A3A] p-6 rounded-t-sm shadow-xl font-mono text-sm border-b-2 border-dashed border-[#C9CBD8] space-y-4">
              <div className="flex justify-between items-baseline border-b border-dashed border-[#C9CBD8] pb-3"> <b className="font-bold font-sans text-base">SUBSCOPE</b>
                <span className="text-xs text-[#65698A]">Чек ваших подписок</span>
              </div>
              <p className="text-xs text-[#65698A] font-sans">Пример быстрого чека регулярных трат.</p>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-1">
                  <span>Netflix</span>
                  <span className="font-bold">699 ₽</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>Spotify</span>
                  <span className="font-bold">299 ₽</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>ChatGPT</span>
                  <span className="font-bold">2 499 ₽</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span>Яндекс Плюс</span>
                  <span className="font-bold">399 ₽</span>
                </div>
              </div>
              <div className="border-t border-dashed border-[#C9CBD8] pt-3 space-y-1">
                <div className="flex justify-between font-bold text-sm">
                  <span>В месяц</span>
                  <span>3 896 ₽</span>
                </div>
                <div className="flex justify-between text-xs text-[#65698A]">
                  <span>В год</span>
                  <span>46 752 ₽</span>
                </div>
              </div>
              <a href="/dashboard" className="w-full mt-2 inline-flex items-center justify-center min-h-[44px] bg-[#FF5A1F] text-[#171A3A] font-bold rounded-full text-sm font-sans hover:opacity-95 transition">
                Перейти к управлению
              </a>
            </div>
          </div>
        </section>

        {/* Секция «Как это работает» */}
        <section className="py-16 md:py-24 bg-white dark:bg-[#171A38] border-y border-[#DCDFEC] dark:border-[#2B3060]" id="how">
          <div className="max-w-[1160px] mx-auto px-6 space-y-12">
            <h2 className="text-2xl md:text-3xl font-bold font-['Unbounded',sans-serif]">Как это работает</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="text-4xl font-bold font-['Unbounded',sans-serif] text-[#FF5A1F]">01</div>
                <h3 className="text-lg font-semibold">Добавьте подписки</h3>
                <p className="text-[#4B5079] dark:text-[#B5BAE0] text-sm">Выберите сервис из каталога или укажите вручную: стоимость, период и дату списания.</p>
              </div>
              <div className="space-y-4">
                <div className="text-4xl font-bold font-['Unbounded',sans-serif] text-[#FF5A1F]">02</div>
                <h3 className="text-lg font-semibold">Получите анализ</h3>
                <p className="text-[#4B5079] dark:text-[#B5BAE0] text-sm">Узнайте точную сумму трат за месяц и год, а также структуру расходов по категориям.</p>
              </div>
              <div className="space-y-4">
                <div className="text-4xl font-bold font-['Unbounded',sans-serif] text-[#FF5A1F]">03</div>
                <h3 className="text-lg font-semibold">Сокращайте расходы</h3>
                <p className="text-[#4B5079] dark:text-[#B5BAE0] text-sm">Система подскажет, где дублируются подписки или выгоднее перейти на годовой тариф.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Футер */}
      <footer className="py-10 max-w-[1160px] mx-auto px-6 text-[#6E7398] dark:text-[#8D93BE] text-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <p>SUBSCOPE. Контроль подписок и аналитика расходов.</p>
        <a href="/dashboard" className="text-[#3F4DE8] dark:text-[#8D98FF] font-semibold hover:underline">Открыть личный кабинет →</a>
      </footer>
    </div>
  );
}
