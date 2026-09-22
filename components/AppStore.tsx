'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CONFIG, type PlanId } from '@/lib/config';
import { fmt } from '@/lib/finance';

export type Billing = 'month' | 'year';

export interface Settings {
  name: string;
  email: string;
  currency: string;
  lang: 'ru' | 'en';
  notifyEnabled: boolean;
  notifyDays: number;
  billing: Billing;
}

export const DEFAULT_SETTINGS: Settings = {
  name: '',
  email: '',
  currency: 'RUB',
  lang: 'ru',
  notifyEnabled: true,
  notifyDays: 3,
  billing: 'month',
};

const SETTINGS_KEY = 'subscope-settings';
const PLAN_KEY = 'subscope-plan';

export function readSettings(): Settings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return { ...DEFAULT_SETTINGS, ...parsed, billing: parsed.billing ?? 'month' };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function readPlan(): PlanId {
  if (typeof window === 'undefined') return 'free';
  const raw = window.localStorage.getItem(PLAN_KEY);
  return raw === 'pro' || raw === 'pro_plus' ? raw : 'free';
}

interface AppStore {
  ready: boolean;
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  plan: PlanId;
  setPlan: (plan: PlanId) => void;
  limit: number;
  symbol: string;
  money: (amount: number, decimals?: number) => string;
}

const Ctx = createContext<AppStore | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [plan, setPlanState] = useState<PlanId>('free');

  useEffect(() => {
    setSettings(readSettings());
    setPlanState(readPlan());
    setReady(true);
  }, []);

  const persist = useCallback((next: Settings, nextPlan: PlanId) => {
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      window.localStorage.setItem(PLAN_KEY, nextPlan);
    } catch {
      /* приватный режим браузера — работаем без сохранения */
    }
  }, []);

  const updateSettings = useCallback(
    (patch: Partial<Settings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...patch };
        persist(next, plan);
        return next;
      });
    },
    [persist, plan],
  );

  const setPlan = useCallback(
    (next: PlanId) => {
      setPlanState(next);
      persist(settings, next);
    },
    [persist, settings],
  );

  const value = useMemo<AppStore>(() => {
    const currency = CONFIG.currencies[settings.currency] ? settings.currency : 'RUB';
    return {
      ready,
      settings,
      updateSettings,
      plan,
      setPlan,
      limit: CONFIG.plans[plan].limit,
      symbol: CONFIG.currencies[currency].symbol,
      money: (amount: number, decimals = 0) => fmt(amount, currency, decimals),
    };
  }, [ready, settings, updateSettings, plan, setPlan]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppStore(): AppStore {
  const ctx = useContext(Ctx);
  if (!ctx) {
    return {
      ready: true,
      settings: DEFAULT_SETTINGS,
      updateSettings: () => {},
      plan: 'free',
      setPlan: () => {},
      limit: CONFIG.plans.free.limit,
      symbol: '₽',
      money: (amount: number, decimals = 0) => fmt(amount, 'RUB', decimals),
    };
  }
  return ctx;
}
