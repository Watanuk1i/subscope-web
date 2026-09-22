'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { Icon, type IconName } from '@/components/Icons';

type ToastKind = 'ok' | 'warn' | 'error' | 'info';

interface ToastItem {
  id: number;
  text: string;
  kind: ToastKind;
}

interface ToastApi {
  push: (text: string, kind?: ToastKind) => void;
  ok: (text: string) => void;
  warn: (text: string) => void;
  error: (text: string) => void;
}

const Ctx = createContext<ToastApi | null>(null);

const KIND: Record<ToastKind, { icon: IconName; className: string }> = {
  ok: { icon: 'check', className: 'bg-save-bg text-save border-save-line' },
  warn: { icon: 'warn', className: 'bg-warn-bg text-warn border-warn/20' },
  error: { icon: 'warn', className: 'bg-danger-bg text-danger border-danger/20' },
  info: { icon: 'info', className: 'bg-ink text-white border-transparent' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const seq = useRef(0);

  const push = useCallback((text: string, kind: ToastKind = 'info') => {
    const id = ++seq.current;
    setItems((prev) => [...prev.slice(-2), { id, text, kind }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      push,
      ok: (t) => push(t, 'ok'),
      warn: (t) => push(t, 'warn'),
      error: (t) => push(t, 'error'),
    }),
    [push],
  );

  return (
    <Ctx.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:bottom-6"
      >
        {items.map((t) => {
          const k = KIND[t.kind];
          return (
            <div
              key={t.id}
              className={`toast-in pointer-events-auto flex max-w-md items-start gap-2.5 rounded-2xl border px-4 py-3 text-xs font-semibold shadow-pop ${k.className}`}
            >
              <Icon name={k.icon} size={16} className="mt-px shrink-0" />
              <span className="leading-relaxed">{t.text}</span>
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}

export function useToast(): ToastApi {
  return (
    useContext(Ctx) ?? {
      push: () => {},
      ok: () => {},
      warn: () => {},
      error: () => {},
    }
  );
}
