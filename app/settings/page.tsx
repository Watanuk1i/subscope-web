'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CONFIG } from '@/lib/config';
import { supabase } from '@/lib/supabase';
import { Icon, Logo, type IconName } from '@/components/Icons';
import { useAppStore } from '@/components/AppStore';
import { useToast } from '@/components/Toast';

type Section = 'profile' | 'general' | 'notify' | 'security' | 'plan' | 'account';

const SECTIONS: { id: Section; label: string; icon: IconName }[] = [
  { id: 'profile', label: 'Профиль', icon: 'user' },
  { id: 'general', label: 'Общие', icon: 'globe' },
  { id: 'notify', label: 'Уведомления', icon: 'bell' },
  { id: 'security', label: 'Безопасность', icon: 'shield' },
  { id: 'plan', label: 'Тариф и платежи', icon: 'card' },
  { id: 'account', label: 'Аккаунт', icon: 'logout' },
];

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-body">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  'w-full rounded-2xl border border-line bg-bg/60 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent';

export default function SettingsPage() {
  const { settings, updateSettings, plan, setPlan } = useAppStore();
  const toast = useToast();
  const router = useRouter();
  const [section, setSection] = useState<Section>('profile');
  const [name, setName] = useState(settings.name);
  const [email, setEmail] = useState(settings.email);

  function saveProfile(e: FormEvent) {
    e.preventDefault();
    updateSettings({ name: name.trim(), email: email.trim() });
    toast.ok('Профиль сохранён');
  }

  async function signOut() {
    await supabase.auth.signOut();
    toast.ok('Вы вышли из аккаунта');
    router.push('/');
  }

  function clearLocal() {
    try {
      window.localStorage.removeItem('subscope-settings');
      window.localStorage.removeItem('subscope-plan');
    } catch {
      /* приватный режим */
    }
    setPlan('free');
    updateSettings({ name: '', email: '', currency: 'RUB', lang: 'ru', notifyEnabled: true, notifyDays: 3 });
    setName('');
    setEmail('');
    toast.warn('Локальные настройки сброшены');
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="SUBSCOPE — на главную">
            <Logo size={32} />
            <span className="font-display text-sm font-black tracking-[0.16em] text-ink">
              SUBSCOPE
            </span>
          </Link>
          <span className="text-xs font-bold text-mute">/ настройки</span>
          <Link
            href="/dashboard"
            className="press ml-auto rounded-full border border-line bg-white px-4 py-2.5 text-xs font-bold text-ink transition hover:border-ink/30"
          >
            В кабинет
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSection(s.id)}
              className={`press flex shrink-0 items-center gap-2.5 rounded-2xl px-4 py-3 text-xs font-bold transition ${
                section === s.id ? 'bg-ink text-white shadow-sm' : 'bg-white text-body hover:text-ink'
              }`}
            >
              <Icon name={s.icon} size={16} />
              {s.label}
            </button>
          ))}
        </nav>

        <div className="space-y-6">
          {section === 'profile' && (
            <section className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
              <h1 className="font-display text-xl font-black text-ink">Профиль</h1>
              <p className="mt-1 text-xs text-body">
                Имя показывается в кабинете, почта нужна только для входа через Supabase Auth.
              </p>
              <form onSubmit={saveProfile} className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Имя">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Иван"
                    className={inputCls}
                  />
                </Field>
                <Field label="Электронная почта">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputCls}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="press rounded-2xl bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-deep"
                  >
                    Сохранить профиль
                  </button>
                </div>
              </form>
            </section>
          )}

          {section === 'general' && (
            <section className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
              <h1 className="font-display text-xl font-black text-ink">Общие настройки</h1>
              <p className="mt-1 text-xs text-body">
                Валюта влияет на отображение сумм: пересчёт по ориентировочному курсу.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Валюта отображения">
                  <select
                    value={settings.currency}
                    onChange={(e) => {
                      updateSettings({ currency: e.target.value });
                      toast.ok(`Валюта: ${CONFIG.currencies[e.target.value]?.label ?? e.target.value}`);
                    }}
                    className={inputCls}
                  >
                    {Object.entries(CONFIG.currencies).map(([code, c]) => (
                      <option key={code} value={code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Язык интерфейса">
                  <select
                    value={settings.lang}
                    onChange={(e) => updateSettings({ lang: e.target.value as 'ru' | 'en' })}
                    className={inputCls}
                  >
                    <option value="ru">Русский</option>
                    <option value="en">English (скоро)</option>
                  </select>
                </Field>
              </div>
              <p className="mt-4 rounded-2xl bg-bg px-4 py-3 text-[11px] leading-relaxed text-body">
                Английская локализация появится вместе с мультирегиональными ценами в каталоге
                сервисов.
              </p>
            </section>
          )}

          {section === 'notify' && (
            <section className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
              <h1 className="font-display text-xl font-black text-ink">Уведомления</h1>
              <p className="mt-1 text-xs text-body">
                Напоминания о предстоящих списаниях, чтобы продление не стало сюрпризом.
              </p>

              <div className="mt-6 space-y-4">
                <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-line bg-bg p-4">
                  <span>
                    <span className="block text-sm font-bold text-ink">Напоминать о списаниях</span>
                    <span className="mt-0.5 block text-xs text-body">
                      Показывать ближайшие платежи в кабинете и на главной
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.notifyEnabled}
                    onChange={(e) => updateSettings({ notifyEnabled: e.target.checked })}
                    className="size-5 accent-[#e8552b]"
                  />
                </label>

                <Field label="За сколько дней предупреждать">
                  <select
                    value={settings.notifyDays}
                    onChange={(e) => updateSettings({ notifyDays: Number(e.target.value) })}
                    disabled={!settings.notifyEnabled}
                    className={`${inputCls} disabled:opacity-50`}
                  >
                    {[1, 2, 3, 5, 7].map((d) => (
                      <option key={d} value={d}>
                        За {d} {d === 1 ? 'день' : 'дня'}
                      </option>
                    ))}
                  </select>
                </Field>

                <p className="rounded-2xl bg-warn-bg px-4 py-3 text-[11px] leading-relaxed text-warn">
                  Почтовая рассылка подключится после подтверждения адреса в аккаунте. Пока
                  напоминания живут в интерфейсе.
                </p>
              </div>
            </section>
          )}

          {section === 'security' && (
            <section className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
              <h1 className="font-display text-xl font-black text-ink">Безопасность</h1>
              <ul className="mt-5 space-y-3">
                {[
                  {
                    icon: 'lock' as IconName,
                    t: 'Пароль хранит Supabase Auth',
                    d: 'Мы не видим и не храним пароли: проверка происходит на стороне провайдера.',
                  },
                  {
                    icon: 'shield' as IconName,
                    t: 'Только HTTPS и защищённые заголовки',
                    d: 'HSTS, nosniff и запрет встраивания во фреймы включены на сервере.',
                  },
                  {
                    icon: 'card' as IconName,
                    t: 'Нет платёжных данных',
                    d: 'Номера карт и CVV в приложении не вводятся и не хранятся.',
                  },
                ].map((f) => (
                  <li key={f.t} className="flex gap-3 rounded-2xl border border-line bg-bg p-4">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-save-bg text-save">
                      <Icon name={f.icon} size={17} />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-ink">{f.t}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-body">{f.d}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={signOut}
                className="press mt-6 inline-flex items-center gap-2 rounded-2xl border border-line px-5 py-3 text-sm font-bold text-ink transition hover:border-ink/30"
              >
                <Icon name="logout" size={16} /> Выйти из аккаунта
              </button>
            </section>
          )}

          {section === 'plan' && (
            <section className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
              <h1 className="font-display text-xl font-black text-ink">Тариф и платежи</h1>
              <p className="mt-1 text-xs text-body">
                Текущий тариф: <span className="font-bold text-ink">{CONFIG.plans[plan].name}</span>.
                Переключение происходит мгновенно и хранится в этом браузере.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {(['free', 'pro', 'pro_plus'] as const).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setPlan(id);
                      toast.ok(`Тариф ${CONFIG.plans[id].name} активирован`);
                    }}
                    className={`press rounded-2xl border p-4 text-left transition ${
                      plan === id
                        ? 'border-transparent bg-ink text-white shadow-pop'
                        : 'border-line bg-bg hover:border-ink/30'
                    }`}
                  >
                    <p className="font-display text-sm font-black">{CONFIG.plans[id].name}</p>
                    <p className={`mt-1 text-[11px] ${plan === id ? 'text-white/70' : 'text-body'}`}>
                      {CONFIG.plans[id].price.month === 0
                        ? 'бесплатно'
                        : `${CONFIG.plans[id].price.month} ₽ / мес`}
                    </p>
                    {plan === id && (
                      <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold">
                        <Icon name="check" size={11} /> активен
                      </p>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-bg p-4">
                <p className="flex items-center gap-2 text-xs font-bold text-ink">
                  <Icon name="card" size={15} className="text-accent" /> Платёжные данные
                </p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-body">
                  Демо-режим: оплата не подключена, карта не требуется. Когда появится приём
                  платежей, данные карты будет хранить платёжный провайдер, а не SUBSCOPE.
                </p>
              </div>

              <Link
                href="/pricing"
                className="press mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-xs font-bold text-white transition hover:bg-accent-deep"
              >
                Сравнить тарифы подробно <Icon name="arrow-right" size={14} />
              </Link>
            </section>
          )}

          {section === 'account' && (
            <section className="rounded-3xl border border-danger/25 bg-white p-6 shadow-card sm:p-8">
              <h1 className="font-display text-xl font-black text-danger">Управление аккаунтом</h1>
              <p className="mt-1 text-xs text-body">
                Действия из этой зоны необратимы для локальных настроек этого браузера.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex flex-col gap-3 rounded-2xl border border-line bg-bg p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-ink">Сбросить локальные настройки</p>
                    <p className="mt-0.5 text-xs text-body">
                      Тариф, валюта и уведомления вернутся к значениям по умолчанию
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearLocal}
                    className="press shrink-0 rounded-2xl border border-line bg-white px-4 py-2.5 text-xs font-bold text-ink transition hover:border-ink/30"
                  >
                    Сбросить
                  </button>
                </div>

                <div className="flex flex-col gap-3 rounded-2xl border border-danger/25 bg-danger-bg p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-danger">Удалить аккаунт</p>
                    <p className="mt-0.5 text-xs text-danger/80">
                      Записи в базе удаляются вместе с аккаунтом в Supabase. Напишите нам на
                      странице поддержки — удалим данные вручную в течение суток.
                    </p>
                  </div>
                  <Link
                    href="/support"
                    className="press shrink-0 rounded-2xl bg-danger px-4 py-2.5 text-xs font-bold text-white transition hover:brightness-110"
                  >
                    Запросить удаление
                  </Link>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
