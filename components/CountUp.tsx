'use client';

import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  value: number;
  duration?: number;
  decimals?: number;
  format?: (n: number) => string;
  className?: string;
  start?: boolean;
}

export function CountUp({
  value,
  duration = 900,
  decimals = 0,
  format,
  className,
  start = true,
}: CountUpProps) {
  const [shown, setShown] = useState(0);
  const fromRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!start) return;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduce || duration <= 0) {
      fromRef.current = value;
      setShown(value);
      return;
    }

    const from = fromRef.current;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = from + (value - from) * eased;
      setShown(next);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else fromRef.current = value;
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration, start]);

  const text = format
    ? format(shown)
    : shown.toLocaleString('ru-RU', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

  return <span className={className}>{text}</span>;
}
