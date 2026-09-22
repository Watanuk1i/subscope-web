'use client';

import { Suspense, useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CONFIG, type PlanId } from '@/lib/config';
import { Icon, Logo, type IconName } from '@/components/Icons';
import { PricingToggle } from '@/components/Pricing';
import { useAppStore, type Billing } from '@/components/AppStore';
import { useToast } from '@/components/Toast';

const METHODS: { id: string; label: string; hint: string; icon: IconName }[] = [
  { id: 'card', label: 'Банковская карта', hint: 'Visa, Mastercard, Мир', icon: 'card' },
  { id: 'sbp', label: 'СБП', hint: 'QR-код или выбор банка', icon: 'spark' },
];

function CheckoutInner() {
  const router = useRouter();
  const params = useSearchParams();
  const toast = useToast();
  const { plan, setPlan, money, settings } = useAppStore();

  const rawPlan = params.get('plan');
  const planId: PlanId = rawPlan === 'pro' || rawPlan === 'pro_plus' ? rawPlan : 'free';
  const [billing, setBilling] = useState<Billing>(
    params.get('billing') === 'year' ? 'year' : 'month',
  );
  const [email, setEmail] = useState(settings.email);
  const [method, setMethod] = useState('card');
  const [step, setStep] = useState<'form' | 'processing' | 'done'>('form');
  const [order, setOrder] = useState('');

  useEffect(() => {
    if (planId === 'free') router.replace('/pricing');
  }, [planId, router]);

  if (planId === 'free') return null;

  const p = CONFIG.plans[planId];
  const price = billing === 'month' ? p.price.month : p.price.year;

  function pay(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      toast.warn('Укажите почту — на неё придёт чек об оплате');
      return;
    }
    setStep('processing');
    // Точка интеграции платёжного провайдера (ЮKassa, CloudPayments и т.п.):
    // вместо таймера здесь будет серверный вызов создания платежа.
    window.setTimeout(() => {
      setOrder(`SUB-${String(Date.now()).slice(-6)}`);
      setPlan(planId);
      setStep('done');
      toast.ok(`Тариф ${p.name} активирован`);
    }, 1400);
  }

  if (step === 'done') {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-10">
        <div className="rounded-3xl border border-save-line bg-white p-8 text-center shadow-pop">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-save-bg text-save">
            <Icon name="check" size={26} />
          </span>
          <h1 className="mt-5 font-display text-2xl font-black text-ink">
            Тариф {p.name} активирован
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-body">
            Заказ <span className="num font-mono font-bold text-ink">{order}</span> на{' '}
            <span className="num font-bold text-ink">{money(price)}</span> ·{' '}
            {billing === 'month' ? 'оплата за месяц' : 'оплата за год'}. Чек отправлен на{' '}
            {email.trim()}.
          </p>
          <p className="mt-4 rounded-2xl bg-warn-bg px-4 py-3 text-[11px] leading-relaxed text-warn">
            Это демонстрационная оплата: провайдер ещё не подключён, деньги не списывались.
            Тариф активирован в этом браузере, чтобы вы могли посмотреть возможности.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/dashboard"
              className="press flex-1 rounded-2xl bg-accent py-3 text-sm font-bold text-white transition hover:bg-accent-deep"
            >
              В личный кабинет
            </Link>
            <Link
              href="/settings"
              className="press flex-1 rounded-2xl border border-line py-3 text-sm font-bold text-body transition hover:bg-bg"
            >
              Настройки
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/pricing" className="inline-flex items-center gap-2 text-xs font-bold text-mute transition hover:text-accent">
        ← Вернуться к тарифам
      </Link>

      <h1 className="mt-4 font-display text-2xl font-black text-ink sm:text-3xl">Оплата тарифа</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-body">
        Вы платите только за тариф SUBSCOPE. Доступ к вашим картам, банку и счетам сервис не
        запрашивает — данные для чека вносите вы сами.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        {/* форма оплаты */}
        <form
          onSubmit={pay}
          className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8"
        >
          <h2 className="font-display text-lg font-bold text-ink">Данные для оплаты</h2>

          <label className="mt-5 block text-xs font-bold text-body" htmlFor="pay-email">
            Электронная почта для чека
          </label>
          <input
            id="pay-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1.5 w-full rounded-2xl border border-line bg-bg/60 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
            required
          />

          <p className="mt-5 text-xs font-bold text-body">Способ оплаты</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                aria-pressed={method === m.id}
                className={`press flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                  method === m.id
                    ? 'border-accent bg-accent-soft/60 shadow-sm'
                    : 'border-line bg-bg hover:border-ink/30'
                }`}
              >
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-xl ${
                    method === m.id ? 'bg-accent text-white' : 'bg-white text-ink'
                  }`}
                >
                  <Icon name={m.icon} size={17} />
                </span>
                <span>
                  <span className="block text-sm font-bold text-ink">{m.label}</span>
                  <span className="block text-[11px] text-mute">{m.hint}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-2xl bg-bg p-4 text-[11px] leading-relaxed text-body">
            Кнопка «Оплатить» в демо-режиме не списывает деньги: платёжный провайдер ещё
            подключается. Карта вводится на стороне провайдера — SUBSCOPE не видит и не хранит
            её данные.
          </div>

          <button
            type="submit"
            disabled={step === 'processing'}
            className="press mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-accent py-3.5 text-sm font-bold text-white shadow-lift transition hover:bg-accent-deep disabled:opacity-70"
          >
            {step === 'processing' ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Проводим оплату…
              </>
            ) : (
              <>
                <Icon name="lock" size={15} /> Оплатить {money(price)}
              </>
            )}
          </button>
          <p className="mt-3 text-center text-[11px] text-mute">
            Отмена в любой момент · продление не включается автоматически
          </p>
        </form>

        {/* заказ */}
        <aside className="h-fit rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-ink">Ваш заказ</h2>
            <span className="rounded-full bg-ink px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
              {p.name}
            </span>
          </div>

          <div className="mt-4">
            <PricingToggle billing={billing} onChange={setBilling} />
          </div>

          <ul className="mt-5 space-y-2 text-xs text-body">
            {p.features.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-save/15 text-save">
                  <Icon name="check" size={10} />
                </span>
                {f}
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-body">
                Тариф {p.name} · {billing === 'month' ? 'за месяц' : 'за год'}
              </dt>
              <dd className="num font-bold text-ink">{money(price)}</dd>
            </div>
            {billing === 'year' && (
              <div className="flex justify-between text-xs">
                <dt className="text-mute">Выгода против помесячной оплаты</dt>
                <dd className="num font-bold text-save">
                  −{money(p.price.month * 12 - p.price.year)}
                </dd>
              </div>
            )}
            <div className="flex justify-between border-t border-line pt-3 text-base">
              <dt className="font-bold text-ink">Итого</dt>
              <dd className="num font-display font-black text-ink">{money(price)}</dd>
            </div>
          </dl>

          {billing === 'month' && p.price.month > 0 && (
            <p className="mt-3 text-[11px] text-mute">
              При оплате за год — {money(p.price.year)} вместо{' '}
              {money(p.price.month * 12)}: экономия{' '}
              {money(p.price.month * 12 - p.price.year)} в год.
            </p>
          )}

          <p className="mt-4 flex items-start gap-2 rounded-2xl bg-save-bg px-4 py-3 text-[11px] leading-relaxed text-save">
            <Icon name="savings" size={15} className="mt-0.5 shrink-0" />
            Средняя найденная экономия — несколько сотен рублей в месяц, тариф окупается первой
            отменённой лишней подпиской.
          </p>
        </aside>
      </div>

      <p className="mt-8 text-center text-xs text-mute">
        Текущий тариф: {CONFIG.plans[plan].name} · после оплаты он сменится на {p.name} в этом
        браузере.
      </p>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-line bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="SUBSCOPE — на главную">
            <Logo size={32} />
            <span className="font-display text-sm font-black tracking-[0.16em] text-ink">
              SUBSCOPE
            </span>
          </Link>
          <span className="text-xs font-bold text-mute">/ оплата</span>
        </div>
      </header>
      <Suspense fallback={null}>
        <CheckoutInner />
      </Suspense>
    </div>
  );
}
