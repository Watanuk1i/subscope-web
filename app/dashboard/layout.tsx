import React from 'react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Боковое меню (Sidebar) */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-lg tracking-tight">
            <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs">S</div>
            SUBSCOPE
          </Link>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2 font-medium text-sm text-slate-600">
          <Link href="/dashboard" className="p-3 rounded-lg bg-indigo-50 text-indigo-600">Главная</Link>
          <Link href="/dashboard/subscriptions" className="p-3 rounded-lg hover:bg-slate-50 transition">Мои подписки</Link>
          <Link href="/dashboard/analytics" className="p-3 rounded-lg hover:bg-slate-50 transition">Аналитика</Link>
          <Link href="/dashboard/calendar" className="p-3 rounded-lg hover:bg-slate-50 transition">Календарь</Link>
        </nav>
      </aside>

      {/* Основная часть */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between">
          <h1 className="text-xl font-bold">Обзор</h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
          </div>
        </header>
        <div className="flex-1 p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
