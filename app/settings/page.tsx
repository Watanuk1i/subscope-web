'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'subscope-settings';

export default function SettingsPage() {
  const [name, setName] = useState('Владелец подписок');
  const [email, setEmail] = useState('user@subscope.app');
  const [currency, setCurrency] = useState('RUB');
  const [notifyDays, setNotifyDays] = useState('3');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed.name) setName(parsed.name);
      if (parsed.email) setEmail(parsed.email);
      if (parsed.currency) setCurrency(parsed.currency);
      if (parsed.notifyDays) setNotifyDays(parsed.notifyDays);
    } catch {
      // повреждённые настройки просто игнорируем
    }
  }, []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ name, email, currency, notifyDays }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="min-h-screen bg-[#EAEBF2] text-[#171A3A] p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Шапка */}
        <div className="flex justify-between items-center bg-white p-6 sm:p-8 rounded-3xl border border-[#DCDFEC] shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/dashboard" className="text-xs font-bold text-[#6E7398] hover:text-[#FF5A1F] transition">
                ← Назад в кабинет
              </Link>
              <span className="text-xs text-[#DCDFEC]">/</span>
              <span className="text-xs font-bold text-[#FF5A1F]">Настройки</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-['Unbounded',sans-serif]">Настройки аккаунта</h1>
            <p className="text-sm text-[#4B5079] mt-1">Управление профилем, валютой и уведомлениями</p>
          </div>
        </div>

        {saved && (
          <div className="bg-[#DDF3E9] border border-[#A9DCC5] text-[#0B7F58] px-6 py-4 rounded-2xl font-bold text-sm">
            ✓ Изменения успешно сохранены!
          </div>
        )}

        {/* Форма настроек */}
        <form onSubmit={handleSave} className="bg-white rounded-3xl border border-[#DCDFEC] shadow-sm p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold font-['Unbounded',sans-serif]">Личные данные</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#4B5079] mb-1">Имя пользователя</label>
              <input
                type="text"
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-[#DCDFEC] text-sm focus:outline-none focus:border-[#FF5A1F] bg-[#EAEBF2]/50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#DCDFEC]">
            <div>
              <label className="block text-xs font-bold text-[#4B5079] mb-1">Основная валюта</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-[#DCDFEC] text-sm focus:outline-none focus:border-[#FF5A1F] bg-[#EAEBF2]/50"
              >
                <option value="RUB">Российский рубль (₽)</option>
                <option value="USD">Доллар США ($)</option>
                <option value="EUR">Евро (€)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4B5079] mb-1">Напоминать о списании</label>
              <select
                value={notifyDays}
                onChange={(e) => setNotifyDays(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-[#DCDFEC] text-sm focus:outline-none focus:border-[#FF5A1F] bg-[#EAEBF2]/50"
              >
                <option value="1">За 1 день до платежа</option>
                <option value="3">За 3 дня до платежа</option>
                <option value="7">За 7 дней до платежа</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 items-start sm:items-center">
            <button
              type="submit"
              className="bg-[#FF5A1F] hover:bg-[#E54D15] text-[#171A3A] px-8 py-3.5 rounded-2xl text-sm font-bold transition shadow-md"
            >
              Сохранить изменения
            </button>
            <p className="text-[11px] text-[#6E7398]">Настройки хранятся локально в вашем браузере.</p>
          </div>
        </form>

      </div>
    </div>
  );
}
