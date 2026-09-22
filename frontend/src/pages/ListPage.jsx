import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/index.css';
import { Layout } from '../components/Layout';
import { TodoCard } from '../components/TodoCard';
import { StatsBar } from '../components/StatsBar';
import { Toast } from '../components/Toast';
import { ConfirmModal } from '../components/ConfirmModal';
import { api } from '../api';

function ListPage() {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters
  const [filter, setFilter] = useState('all'); // all | active | completed
  const [priority, setPriority] = useState('');
  const [search, setSearch] = useState('');

  // New todo form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    tags: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filter === 'active') params.completed = 'false';
      if (filter === 'completed') params.completed = 'true';
      if (priority) params.priority = priority;
      if (search.trim()) params.search = search.trim();

      const [listRes, statsRes] = await Promise.all([
        api.getAll(params),
        api.getStats()
      ]);
      setTodos(listRes.data);
      setStats(statsRes.data);
    } catch (err) {
      setError(err.message || 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, [filter, priority, search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Debounce search a little
  useEffect(() => {
    const t = setTimeout(() => {
      // loadData is already dependent on search
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      await api.create({
        title: form.title,
        description: form.description,
        priority: form.priority,
        tags: form.tags
          ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : []
      });
      setForm({ title: '', description: '', priority: 'medium', tags: '' });
      setShowForm(false);
      await loadData();
      setToast({ message: 'Todo created successfully!', type: 'success' });
    } catch (err) {
      setToast({ message: err.message || 'Failed to create todo', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggle(id) {
    try {
      await api.toggle(id);
      await loadData();
    } catch (err) {
      setToast({ message: err.message || 'Failed to update todo', type: 'error' });
    }
  }

  function handleDelete(id) {
    // Opens the modern confirmation modal first
    setDeleteTargetId(id);
  }

  async function handleConfirmDelete() {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await api.remove(deleteTargetId);
      setDeleteTargetId(null);
      await loadData();
      setToast({ message: 'Todo deleted permanently!', type: 'success' });
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete todo', type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Layout title="My Todos">
      <StatsBar stats={stats} />

      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'active', 'completed'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize transition ${
                filter === f
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm"
          >
            <option value="">All priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="search"
            placeholder="Search todos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input max-w-xs"
          />
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="btn-primary"
          >
            {showForm ? 'Cancel' : '+ Add Todo'}
          </button>
        </div>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="card mb-6 p-5">
          <h2 className="mb-4 text-lg font-semibold">New Todo</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Title *</label>
              <input
                required
                className="input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="What needs to be done?"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
              <textarea
                className="input min-h-[80px]"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Optional details..."
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
                placeholder="work, personal, urgent"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Creating...' : 'Create Todo'}
            </button>
          </div>
        </form>
      )}

      {/* Error / Loading / Empty / List */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
          <button onClick={loadData} className="ml-3 underline">
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        </div>
      ) : todos.length === 0 ? (
        <div className="card py-16 text-center">
          <p className="text-lg font-medium text-slate-600">No todos found</p>
          <p className="mt-1 text-sm text-slate-400">
            {filter !== 'all' || search || priority
              ? 'Try changing filters or search terms'
              : 'Create your first todo to get started'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {todos.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Floating Success / Notification Bar */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Permanently?"
        message="Are you sure you want to delete this todo permanently? This cannot be undone."
        confirmText="Yes, Delete"
        cancelText="No, Cancel"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </Layout>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ListPage />
  </React.StrictMode>
);
