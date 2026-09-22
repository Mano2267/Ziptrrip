import React from 'react';

export function Layout({ children, title = 'Todo App' }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* ── Header ── */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="/" className="flex items-center gap-2 font-bold text-slate-800 hover:text-brand-600 transition-colors">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white text-sm font-extrabold"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)' }}
            >
              T
            </span>
            <span className="text-lg tracking-tight">ZipTrip</span>
          </a>
          <nav className="flex items-center gap-2 text-sm">
            <a
              href="/"
              className="rounded-lg px-3 py-1.5 text-slate-600 hover:bg-brand-50 hover:text-brand-700 font-medium transition-all duration-200"
            >
              All Todos
            </a>
          </nav>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          {title && (
            <h1 className="mb-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {title}
            </h1>
          )}
          {children}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-400">
        Built for interview · MPA React + Express · MongoDB
      </footer>
    </div>
  );
}
