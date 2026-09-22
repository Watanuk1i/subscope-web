'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Subscription {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  period: string;
  status: string;
}

export default function DashboardHome() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Поля формы
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Сервисы');
  const [price, setPrice] = useState('');
  const [period, setPeriod] = useState('month');

  async function fetchSubs() {
    setLoading(true);
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active');

    if (!error && data) {
      setSubs(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchSubs();
  }, []);

  async function handleAddSub(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !price) return;

    const { error } = await supabase.from('subscriptions').insert([
      {
        name,
        category,
        price: parseFloat(price),
        currency: 'RUB',
        period,
        status: 'active',
      },
    ]);

    if (!error) {
      setName('');
      setPrice('');
      setIsModalOpen(false);
      fetchSubs();
    } else {
      alert('Ошибка при добавлении подписки');
    }
  }

  const totalMonthly = subs.reduce((acc, sub) => {
    let monthlyPrice = sub.price;
    if (sub.period === 'year') monthlyPrice = sub.price / 12;
    if (sub.period === 'week') monthlyPrice = sub.price * 4.33;
    return acc + monthlyPrice;
  }, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6 relative">
      {/* Шапка с кнопкой добавления */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Обзор подписок</h1>
          <p className="text-sm text-slate-500">Управляйте своими регулярными расходами</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-indigo-700 transition shadow-sm"
        >
          + Добавить подписку
        </button>
      </div>

      {/* Карточки статистики */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 font-medium mb-1">Расходы за месяц</p>
          <p className="text-3xl font-extrabold text-slate-900">
            {loading ? '...' : `${Math.round(totalMonthly)} ₽`}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 font-medium mb-1">Активных подписок</p>
          <p className="text-3xl font-extrabold text-slate-900">{loading ? '...' : subs.length}</p>
        </div>
        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-sm">
          <p className="text-sm text-indigo-600 font-medium mb-1">Возможная экономия</p>
          <p className="text-3xl font-extrabold text-indigo-900">0 ₽</p>
        </div>
      </div>

      {/* Список подписок */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center py-12 text-slate-400">
          Загрузка подписок...
        </div>
      ) : subs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center py-12">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Подписок пока нет</h2>
          <p className="text-slate-500 mb-6">Добавьте первую подписку с помощью кнопки выше.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Ваши активные подписки</h2>
          <div className="space-y-3">
            {subs.map((sub) => (
              <div key={sub.id} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="font-semibold text-slate-800">{sub.name}</p>
                  <p className="text-xs text-slate-500">{sub.category} • {sub.period}</p>
                </div>
                <p className="font-bold text-slate-900">{sub.price} {sub.currency}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Модальное окно добавления */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Новая подписка</h3>
            <form onSubmit={handleAddSub} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Название сервиса</label>
                <input
                  type="text"
                  placeholder="например, Яндекс Плюс, Netflix"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Цена (₽)</label>
                  <input
                    type="number"
                    placeholder="299"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Период</label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 bg-white"
                  >
                    <option value="month">В месяц</option>
                    <option value="year">В год</option>
                    <option value="week">В неделю</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Категория</label>
                <input
                  type="text"
                  placeholder="Кино, Музыка, Софт"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition shadow-sm"
                >
                  Добавить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
