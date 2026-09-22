import React from 'react';

export function StatsBar({ stats }) {
  if (!stats) return null;

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="card px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total</p>
        <p className="mt-1 text-2xl font-bold text-slate-900">{stats.total}</p>
      </div>
      <div className="card px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Active</p>
        <p className="mt-1 text-2xl font-bold text-brand-600">{stats.active}</p>
      </div>
      <div className="card px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Completed</p>
        <p className="mt-1 text-2xl font-bold text-emerald-600">{stats.completed}</p>
      </div>
      <div className="card px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">High Priority</p>
        <p className="mt-1 text-2xl font-bold text-red-600">{stats.byPriority?.high ?? 0}</p>
      </div>
    </div>
  );
}
