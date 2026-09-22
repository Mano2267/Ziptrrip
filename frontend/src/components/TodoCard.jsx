import React, { useState } from 'react';

const priorityStyles = {
  high:   'bg-rose-500/20 text-rose-300 border border-rose-500/30',
  medium: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  low:    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
};

export function TodoCard({ todo, onToggle, onDelete }) {
  const [toggling, setToggling]   = useState(false);
  const [deleting, setDeleting]   = useState(false);

  async function handleToggle() {
    setToggling(true);
    await onToggle(todo.id);
    setToggling(false);
  }

  async function handleDelete() {
    setDeleting(true);
    await onDelete(todo.id);
    setDeleting(false);
  }

  return (
    <article
      className={`card p-4 ${todo.completed ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start gap-3">

        {/* ── Checkbox ── */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={toggling}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2
            transition-all duration-200
            ${todo.completed
              ? 'border-brand-500 bg-brand-600 text-white shadow-[0_0_8px_rgba(124,58,237,0.4)]'
              : 'border-slate-300 hover:border-brand-400'
            }`}
          aria-label={todo.completed ? 'Mark as active' : 'Mark as completed'}
        >
          {todo.completed && (
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* ── Content ── */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`/todo.html?id=${todo.id}`}
              className={`font-semibold
                ${todo.completed ? 'line-through text-slate-400' : 'text-black'}`}
            >
              {todo.title}
            </a>

            {/* Priority badge */}
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${priorityStyles[todo.priority] || priorityStyles.medium}`}>
              {todo.priority}
            </span>
          </div>

          {/* Description */}
          {todo.description && (
            <p className="mt-1 line-clamp-2 text-sm text-slate-600">{todo.description}</p>
          )}

          {/* Meta row */}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
            {todo.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {todo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md px-1.5 py-0.5 text-brand-300 font-medium"
                    style={{ background: 'rgba(124,58,237,0.18)' }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex shrink-0 items-center gap-1">
          <a
            href={`/todo.html?id=${todo.id}`}
            className="btn-ghost px-2 py-1 text-xs rounded-lg"
            title="View details"
          >
            Open
          </a>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="btn px-2 py-1 text-xs rounded-lg text-rose-500 hover:bg-rose-50 transition-all duration-200"
            title="Delete"
          >
            {deleting ? '...' : 'Delete'}
          </button>
        </div>
      </div>
    </article>
  );
}
