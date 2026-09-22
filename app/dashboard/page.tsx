'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Subscription {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  period: 'week' | 'month' | 'year';
  status: 'active' | 'paused' | 'cancelled';
  next_payment?: string | null;
}

function toMonthly(price: number, period: Subscription['period']) {
  if (period === 'year') return price / 12;
  if (period === 'week') return price * 4.33;
  return price;
}

function paymentDay(sub: Subscription) {
  return sub.next_payment ? new Date(sub.next_payment).getUTCDate() : 1;
}

// Следующая дата выбранного дня месяца (с учётом коротких месяцев)
function nextPaymentDate(day: number) {
  const now = new Date();
  const build = (year: number, month: number) => {
    const last = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    return new Date(Date.UTC(year, month, Math.min(day, last), 12));
  };
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const date = build(now.getFullYear(), now.getMonth());
  return (date.getTime() < today ? build(now.getFullYear(), now.getMonth() + 1) : date)
    .toISOString()
    .split('T')[0];
}

const PERIOD_LABEL: Record<Subscription['period'], string> = {
  week: 'Раз в неделю',
  month: 'Раз в месяц',
  year: 'Раз в год',
};

export default function DashboardFullPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [activeTab, setActiveTab] = useState<'subs' | 'calendar' | 'recs'>('subs');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Сервисы');
  const [price, setPrice] = useState('');
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [paymentDayInput, setPaymentDayInput] = useState('15');

  async function fetchSubs() {
    setLoading(true);
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setNotice('Не удалось загрузить подписки: ' + error.message);
    } else if (data) {
      setSubs(data as Subscription[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchSubs();
  }, []);

  async function handleAddSub(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !price) return;

    const day = Math.min(Math.max(parseInt(paymentDayInput) || 1, 1), 31);
    const { error } = await supabase.from('subscriptions').insert([
      {
        name,
        category,
        price: parseFloat(price),
        currency: 'RUB',
        period,
        status: 'active',
        next_payment: nextPaymentDate(day),
      },
    ]);

    if (error) {
      setNotice('Ошибка при добавлении: ' + error.message);
      return;
    }
    setName('');
    setPrice('');
    setNotice('');
    setIsModalOpen(false);
    fetchSubs();
  }

  async function toggleStatus(sub: Subscription) {
    const newStatus = sub.status === 'active' ? 'paused' : 'active';
    const { data, error } = await supabase
      .from('subscriptions')
      .update({ status: newStatus })
      .eq('id', sub.id)
      .select();

    if (error) {
      setNotice('Ошибка при смене статуса: ' + error.message);
    } else if (!data || data.length === 0) {
      setNotice('Статус не сохранён: база не разрешает UPDATE для анонимных пользователей (RLS).');
    } else {
      setNotice('');
      fetchSubs();
    }
  }

  async function handleDelete(id: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      setNotice('Ошибка при удалении: ' + error.message);
    } else if (!data || data.length === 0) {
      setNotice('Запись не удалена: база не разрешает DELETE для анонимных пользователей (RLS).');
    } else {
      setNotice('');
      fetchSubs();
    }
  }

  const activeSubs = useMemo(() => subs.filter(s => s.status === 'active'), [subs]);

  const totalMonthly = activeSubs.reduce((acc, sub) => acc + toMonthly(sub.price, sub.period), 0);
  const totalYearly = totalMonthly * 12;
  const annualPlanSavings = Math.round(totalMonthly * 12 * 0.2);

  const categoryStats = useMemo(() => {
    const map: Record<string, number> = {};
    activeSubs.forEach(sub => {
      const cat = sub.category || 'Другое';
      map[cat] = (map[cat] || 0) + toMonthly(sub.price, sub.period);
    });
    return Object.entries(map)
      .map(([cat, amount]) => ({
        category: cat,
        amount: Math.round(amount),
        percent: totalMonthly > 0 ? Math.round((amount / totalMonthly) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [activeSubs, totalMonthly]);

  // Категории, где активно больше одного сервиса — кандидаты на дубли
  const duplicateCategories = categoryStats.filter(stat => {
    const count = activeSubs.filter(s => (s.category || 'Другое') === stat.category).length;
    return count > 1;
  });

  const monthlyOnlyTotal = activeSubs
    .filter(s => s.period === 'month')
    .reduce((acc, s) => acc + s.price, 0);

  const calendarDays = useMemo(() => {
    const map: Record<number, Subscription[]> = {};
    activeSubs.forEach(sub => {
      const day = paymentDay(sub);
      (map[day] ||= []).push(sub);
    });
    return Object.entries(map)
      .map(([day, items]) => ({
        day: Number(day),
        items,
        total: items.reduce((acc, s) => acc + toMonthly(s.price, s.period), 0),
      }))
      .sort((a, b) => a.day - b.day);
  }, [activeSubs]);

  const filteredSubs = subs.filter(sub => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      sub.name.toLowerCase().includes(q) || (sub.category || '').toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#EAEBF2] text-[#171A3A] p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Шапка кабинета */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#DCDFEC] shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/" className="text-xs font-bold text-[#6E7398] hover:text-[#FF5A1F] transition">
                ← На главную страницу
              </Link>
              <span className="text-xs text-[#DCDFEC]">/</span>
              <span className="text-xs font-bold text-[#FF5A1F]">Личный кабинет</span>
              <span className="text-xs text-[#DCDFEC]">/</span>
              <Link href="/settings" className="text-xs font-bold text-[#6E7398] hover:text-[#FF5A1F] transition">
                Настройки
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-['Unbounded',sans-serif]">Управление подписками</h1>
            <p className="text-sm text-[#4B5079] mt-1">Аналитика трат, календарь списаний и сценарии экономии</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#FF5A1F] hover:bg-[#E54D15] text-[#171A3A] px-6 py-3.5 rounded-full text-sm font-bold transition shadow-lg shadow-[#FF5A1F]/20 active:scale-95 whitespace-nowrap"
          >
            + Добавить подписку
          </button>
        </div>

        {notice && (
          <div className="bg-[#FFF0D9] border border-[#F0C896] text-[#9A5B00] px-6 py-4 rounded-2xl text-xs sm:text-sm font-semibold flex justify-between gap-4">
            <span>{notice}</span>
            <button onClick={() => setNotice('')} className="shrink-0 font-bold">✕</button>
          </div>
        )}

        {/* Карточки аналитики */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DCDFEC] shadow-sm space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6E7398]">Расходы за месяц</p>
            <p className="text-3xl sm:text-4xl font-black font-['Unbounded',sans-serif] text-[#171A3A]">
              {loading ? '...' : `${Math.round(totalMonthly)} ₽`}
            </p>
            <p className="text-xs text-[#6E7398]">Прогноз за год: ~{Math.round(totalYearly)} ₽</p>
          </div>
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DCDFEC] shadow-sm space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6E7398]">Активные сервисы</p>
            <p className="text-3xl sm:text-4xl font-black font-['Unbounded',sans-serif] text-[#171A3A]">
              {loading ? '...' : activeSubs.length}
            </p>
            <p className="text-xs text-[#6E7398]">Всего записей в базе: {subs.length}</p>
          </div>
          <div className="bg-[#DDF3E9] p-6 sm:p-8 rounded-3xl border border-[#A9DCC5] shadow-sm space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#0B7F58]">Возможная экономия</p>
            <p className="text-3xl sm:text-4xl font-black font-['Unbounded',sans-serif] text-[#0B7F58]">
              {loading ? '...' : `${annualPlanSavings} ₽`}/год
            </p>
            <p className="text-xs text-[#0B7F58]/80">При переходе на годовые тарифы</p>
          </div>
        </div>

        {/* Переключатель вкладок */}
        <div className="flex flex-wrap bg-white p-1.5 rounded-2xl border border-[#DCDFEC] max-w-xl shadow-sm">
          <button
            onClick={() => setActiveTab('subs')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition ${activeTab === 'subs' ? 'bg-[#171A3A] text-white shadow-md' : 'text-[#4B5079] hover:text-[#171A3A]'}`}
          >
            📋 Ваши подписки
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition ${activeTab === 'calendar' ? 'bg-[#171A3A] text-white shadow-md' : 'text-[#4B5079] hover:text-[#171A3A]'}`}
          >
            📅 Календарь
          </button>
          <button
            onClick={() => setActiveTab('recs')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition ${activeTab === 'recs' ? 'bg-[#171A3A] text-white shadow-md' : 'text-[#4B5079] hover:text-[#171A3A]'}`}
          >
            💡 Сценарии экономии
          </button>
        </div>

        {/* ВКЛАДКА 1: СПИСОК И АНАЛИТИКА */}
        {activeTab === 'subs' && (
          <div className="space-y-8">
            {!loading && categoryStats.length > 0 && (
              <div className="bg-white rounded-3xl border border-[#DCDFEC] shadow-sm p-6 sm:p-8 space-y-6">
                <h2 className="text-xl font-bold font-['Unbounded',sans-serif]">Структура расходов по категориям</h2>
                <div className="space-y-4">
                  {categoryStats.map((stat) => (
                    <div key={stat.category} className="space-y-1.5">
                      <div className="flex justify-between text-xs sm:text-sm font-semibold">
                        <span className="text-[#171A3A]">{stat.category}</span>
                        <span className="text-[#6E7398]">{stat.amount} ₽ / мес ({stat.percent}%)</span>
                      </div>
                      <div className="w-full bg-[#EAEBF2] h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-[#171A3A] h-full rounded-full transition-all duration-500"
                          style={{ width: `${stat.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl border border-[#DCDFEC] shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-bold font-['Unbounded',sans-serif]">Список подписок</h2>

                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Поиск по названию..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-[#DCDFEC] text-xs bg-[#EAEBF2] focus:outline-none focus:border-[#FF5A1F] w-full sm:w-60"
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-[#DCDFEC] text-xs bg-[#EAEBF2] focus:outline-none focus:border-[#FF5A1F]"
                  >
                    <option value="all">Все статусы</option>
                    <option value="active">Активные</option>
                    <option value="paused">На паузе</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-16 text-[#6E7398] font-medium">Загрузка данных из Supabase...</div>
              ) : filteredSubs.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <p className="text-[#4B5079]">
                    {subs.length === 0 ? 'В базе пока нет подписок.' : 'Подписок по вашему запросу не найдено.'}
                  </p>
                  {subs.length > 0 && (
                    <button
                      onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                      className="text-xs font-bold text-[#FF5A1F] hover:underline"
                    >
                      Сбросить фильтры
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredSubs.map((sub) => (
                    <div key={sub.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#EAEBF2]/60 border border-[#DCDFEC] hover:border-[#171A3A] transition gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-[#171A3A] text-white font-bold flex items-center justify-center text-base shrink-0 shadow-sm">
                          {sub.name[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-[#171A3A] truncate text-base">{sub.name}</p>
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${sub.status === 'active' ? 'bg-[#DDF3E9] text-[#0B7F58]' : 'bg-[#FFF0D9] text-[#9A5B00]'}`}>
                              {sub.status === 'active' ? 'Активна' : 'На паузе'}
                            </span>
                          </div>
                          <p className="text-xs text-[#6E7398] mt-0.5">
                            Категория: <strong className="text-[#4B5079]">{sub.category || 'Другое'}</strong> • {PERIOD_LABEL[sub.period]} • списание {paymentDay(sub)}-го числа
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#DCDFEC]">
                        <p className="font-black font-['Unbounded',sans-serif] text-[#171A3A] text-lg">
                          {sub.price} <span className="text-xs font-normal text-[#6E7398]">({sub.currency})</span>
                        </p>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleStatus(sub)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${sub.status === 'active' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'}`}
                            title="Изменить статус"
                          >
                            {sub.status === 'active' ? 'На паузу' : 'Возобновить'}
                          </button>
                          <button
                            onClick={() => handleDelete(sub.id)}
                            className="w-9 h-9 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center font-bold text-xs transition"
                            title="Удалить подписку"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ВКЛАДКА 2: КАЛЕНДАРЬ */}
        {activeTab === 'calendar' && (
          <div className="bg-white rounded-3xl border border-[#DCDFEC] shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold font-['Unbounded',sans-serif]">Календарь плановых списаний</h2>
              <p className="text-xs text-[#6E7398] mt-1">
                Дни месяца, в которые сервисы продлеваются автоматически
              </p>
            </div>

            {calendarDays.length === 0 ? (
              <p className="text-center py-12 text-[#6E7398] text-sm">
                Нет активных подписок — добавьте первую, и здесь появится график списаний.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {calendarDays.map(({ day, items, total }) => (
                  <div key={day} className="p-5 rounded-2xl bg-[#EAEBF2]/60 border border-[#DCDFEC] space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-[#171A3A]">📅 {day}-е число</span>
                      <span className="text-xs font-extrabold text-[#FF5A1F]">~{Math.round(total)} ₽/мес</span>
                    </div>
                    <div className="space-y-1.5 pt-1">
                      {items.map(s => (
                        <div key={s.id} className="flex justify-between gap-2 text-xs bg-white p-2.5 rounded-xl border border-[#DCDFEC]">
                          <span className="font-semibold text-[#171A3A] truncate">{s.name}</span>
                          <span className="font-bold text-[#4B5079] whitespace-nowrap">{s.price} ₽</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ВКЛАДКА 3: СЦЕНАРИИ ЭКОНОМИИ */}
        {activeTab === 'recs' && (
          <div className="bg-white rounded-3xl border border-[#DCDFEC] shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold font-['Unbounded',sans-serif]">Персональные сценарии экономии</h2>
              <p className="text-xs text-[#6E7398] mt-1">Расчёты на основе ваших активных подписок в базе</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-[#EAEBF2]/60 border border-[#DCDFEC] space-y-3">
                <span className="inline-block bg-[#DDF3E9] text-[#0B7F58] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
                  Годовая оптимизация
                </span>
                <h3 className="text-lg font-bold">Перевод monthly-платежей на год</h3>
                <p className="text-xs text-[#4B5079] leading-relaxed">
                  Ежемесячно вы платите <strong>{Math.round(monthlyOnlyTotal)} ₽</strong> по подпискам с помесячным
                  списанием. Годовые тарифы обычно дешевле на 15–25%, то есть до{' '}
                  <strong className="text-[#0B7F58]">{Math.round(monthlyOnlyTotal * 12 * 0.2)} ₽</strong> в год.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#EAEBF2]/60 border border-[#DCDFEC] space-y-3">
                <span className="inline-block bg-[#FFF0D9] text-[#9A5B00] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
                  Контроль дублей
                </span>
                <h3 className="text-lg font-bold">Пересекающиеся категории</h3>
                {duplicateCategories.length === 0 ? (
                  <p className="text-xs text-[#4B5079] leading-relaxed">
                    Дублей не найдено: в каждой категории у вас не больше одного активного сервиса.
                  </p>
                ) : (
                  <ul className="text-xs text-[#4B5079] leading-relaxed space-y-1">
                    {duplicateCategories.map(stat => (
                      <li key={stat.category}>
                        • <strong className="text-[#171A3A]">{stat.category}</strong> — {stat.amount} ₽/мес.
                        Проверьте, все ли сервисы здесь вам нужны.
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="p-6 rounded-2xl bg-[#171A3A] text-white border border-[#171A3A] space-y-3 md:col-span-2">
                <span className="inline-block bg-[#FF5A1F] text-[#171A3A] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
                  Пауза вместо отмены
                </span>
                <h3 className="text-lg font-bold">Сервисы «на паузе» не списывают деньги</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Если подписка нужна раз в несколько месяцев, поставьте её на паузу во вкладке «Ваши подписки» —
                  она перестанет учитываться в расходах, а запись останется в базе. Сейчас на паузе:{' '}
                  <strong className="text-white">{subs.filter(s => s.status === 'paused').length}</strong> из {subs.length}.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Модальное окно */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-[#DCDFEC] space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold font-['Unbounded',sans-serif]">Новая подписка</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-[#6E7398] hover:text-[#171A3A] font-bold text-lg">✕</button>
              </div>

              <form onSubmit={handleAddSub} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#4B5079] mb-1">Название сервиса</label>
                  <input
                    type="text"
                    placeholder="например, Яндекс Плюс, Netflix"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-[#DCDFEC] text-sm focus:outline-none focus:border-[#FF5A1F] bg-[#EAEBF2]/50"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#4B5079] mb-1">Цена (₽)</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="299"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-[#DCDFEC] text-sm focus:outline-none focus:border-[#FF5A1F] bg-[#EAEBF2]/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#4B5079] mb-1">День списания</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      placeholder="15"
                      value={paymentDayInput}
                      onChange={(e) => setPaymentDayInput(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-[#DCDFEC] text-sm focus:outline-none focus:border-[#FF5A1F] bg-[#EAEBF2]/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4B5079] mb-1">Период списания</label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as 'week' | 'month' | 'year')}
                    className="w-full px-4 py-3 rounded-2xl border border-[#DCDFEC] text-sm focus:outline-none focus:border-[#FF5A1F] bg-[#EAEBF2]/50"
                  >
                    <option value="month">Раз в месяц</option>
                    <option value="year">Раз в год</option>
                    <option value="week">Раз в неделю</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4B5079] mb-1">Категория</label>
                  <input
                    type="text"
                    placeholder="Кино, Музыка, Софт, ИИ"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-[#DCDFEC] text-sm focus:outline-none focus:border-[#FF5A1F] bg-[#EAEBF2]/50"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 rounded-2xl border border-[#DCDFEC] text-sm font-bold text-[#4B5079] hover:bg-[#EAEBF2] transition"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-2xl bg-[#FF5A1F] text-[#171A3A] text-sm font-bold hover:bg-[#E54D15] transition shadow-md"
                  >
                    Сохранить в базу
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
