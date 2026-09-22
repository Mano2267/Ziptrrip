import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/index.css';
import { Layout } from '../components/Layout';
import { Toast } from '../components/Toast';
import { ConfirmModal } from '../components/ConfirmModal';
import { api } from '../api';

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function DetailPage() {
  const id = getQueryParam('id');
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('Missing todo id in URL. Use ?id=...');
      setLoading(false);
      return;
    }
    loadTodo();
  }, [id]);

  async function loadTodo() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getById(id);
      setTodo(res.data);
      setForm({
        title: res.data.title,
        description: res.data.description || '',
        priority: res.data.priority,
        tags: (res.data.tags || []).join(', '),
        completed: res.data.completed
      });
    } catch (err) {
      setError(err.status === 404 ? 'Todo not found' : err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.update(id, {
        title: form.title,
        description: form.description,
        priority: form.priority,
        tags: form.tags
          ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        completed: form.completed
      });
      setTodo(res.data);
      setEditing(false);
      setToast({ message: 'Todo updated successfully!', type: 'success' });
    } catch (err) {
      setToast({ message: err.message || 'Failed to update todo', type: 'error' });
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle() {
    try {
      const res = await api.toggle(id);
      setTodo(res.data);
      setForm((f) => ({ ...f, completed: res.data.completed }));
      setToast({
        message: res.data.completed ? 'Marked as completed!' : 'Marked as active!',
        type: 'success'
      });
    } catch (err) {
      setToast({ message: err.message || 'Failed to update status', type: 'error' });
    }
  }

  function handleDelete() {
    setShowConfirmDelete(true);
  }

  async function handleConfirmDelete() {
    setIsDeleting(true);
    try {
      await api.remove(id);
      window.location.href = '/';
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete todo', type: 'error' });
      setShowConfirmDelete(false);
    } finally {
      setIsDeleting(false);
    }
  }

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        </div>
      </Layout>
    );
  }

  if (error || !todo) {
    return (
      <Layout title="Todo not found">
        <div className="card py-16 text-center">
          <p className="text-lg font-medium text-red-600">{error || 'Unknown error'}</p>
          <a href="/" className="btn-primary mt-6 inline-flex">
            Back to list
          </a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={editing ? 'Edit Todo' : 'Todo Details'}>
      <div className="mb-4">
        <a href="/" className="text-sm text-brand-600 hover:underline">
          ← Back to all todos
        </a>
      </div>

      <div className="card overflow-hidden">
        {/* Header bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleToggle}
              className={`flex h-6 w-6 items-center justify-center rounded border-2 transition ${
                todo.completed
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-slate-300 hover:border-brand-500'
              }`}
            >
              {todo.completed && (
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${
                todo.completed
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {todo.completed ? 'Completed' : 'Active'}
            </span>
          </div>

          <div className="flex gap-2">
            {!editing && (
              <button type="button" onClick={() => setEditing(true)} className="btn-secondary">
                Edit
              </button>
            )}
            <button type="button" onClick={handleDelete} className="btn-danger">
              Delete
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-8">
          {editing ? (
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Title *</label>
                <input
                  required
                  className="input text-lg font-medium"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  className="input min-h-[120px]"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Priority</label>
                <select
                  className="input"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Tags (comma separated)
                </label>
                <input
                  className="input"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="completed"
                  checked={form.completed}
                  onChange={(e) => setForm({ ...form, completed: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor="completed" className="text-sm text-slate-700">
                  Mark as completed
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setForm({
                      title: todo.title,
                      description: todo.description || '',
                      priority: todo.priority,
                      tags: (todo.tags || []).join(', '),
                      completed: todo.completed
                    });
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h2
                  className={`text-2xl font-bold tracking-tight ${
                    todo.completed ? 'text-slate-500 line-through' : 'text-slate-900'
                  }`}
                >
                  {todo.title}
                </h2>
                {todo.description && (
                  <p className="mt-3 whitespace-pre-wrap text-slate-600 leading-relaxed">
                    {todo.description}
                  </p>
                )}
              </div>

              <dl className="grid gap-4 sm:grid-cols-1">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Priority
                  </dt>
                  <dd className="mt-1">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-medium capitalize ${
                        todo.priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : todo.priority === 'medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {todo.priority}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Created
                  </dt>
                  <dd className="mt-1 text-slate-800">
                    {new Date(todo.createdAt).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Last Updated
                  </dt>
                  <dd className="mt-1 text-slate-800">
                    {new Date(todo.updatedAt).toLocaleString()}
                  </dd>
                </div>
              </dl>

              {todo.tags?.length > 0 && (
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Tags
                  </dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {todo.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </dd>
                </div>
              )}

              <div className="rounded-lg bg-slate-50 px-4 py-3 text-xs text-slate-500">
                <span className="font-medium">ID:</span> {todo.id}
              </div>
            </div>
          )}
        </div>
      </div>
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmDelete}
        title="Delete Permanently?"
        message="Are you sure you want to delete this todo permanently? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="No, Cancel"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirmDelete(false)}
      />
    </Layout>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DetailPage />
  </React.StrictMode>
);
