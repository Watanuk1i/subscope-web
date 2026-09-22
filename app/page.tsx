import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between">
      {/* Шапка */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2 font-extrabold text-xl tracking-tight">
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm">S</div>
          SUBSCOPE
        </div>
        <Link className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-indigo-600/30" href="/dashboard">
          Войти в кабинет
        </Link>
      </header>

      {/* Главный блок (Hero) */}
      <main className="max-w-4xl mx-auto px-6 text-center py-20 space-y-8">
        <div className="inline-block bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
          Управление подписками нового поколения
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
          Контролируйте все подписки в <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">одном месте</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Забываете про автопродления? SUBSCOPE помогает отслеживать регулярные расходы, анализировать траты и находить точки экономии.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-8 py-4 rounded-2xl font-bold text-base shadow-xl shadow-indigo-600/20" href="/dashboard">
            Открыть дашборд бесплатно
          </Link>
        </div>
      </main>

      {/* Подвал */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-8 border-t border-slate-800 text-center text-xs text-slate-500">
        © 2026 SUBSCOPE. Все права защищены.
      </footer>
    </div>
  );
}
