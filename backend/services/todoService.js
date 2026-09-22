import mongoose from 'mongoose';
import Todo from '../models/Todo.js';

/**
 * services/todoService.js
 * Business-logic layer – owns all DB interaction.
 * Controllers call this; nothing below this layer knows about HTTP.
 */

/**
 * Convert a Mongoose document → plain JS object with `id` instead of `_id`.
 */
function toPlain(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  obj.id = (obj._id || obj.id).toString();
  delete obj._id;
  delete obj.__v;
  if (obj.createdAt instanceof Date) obj.createdAt = obj.createdAt.toISOString();
  if (obj.updatedAt instanceof Date) obj.updatedAt = obj.updatedAt.toISOString();
  return obj;
}

/**
 * Assert that `id` is a valid MongoDB ObjectId.
 * Throws a structured error when invalid (controller catches it).
 */
function assertValidId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Invalid todo ID format');
    err.status = 400;
    throw err;
  }
}

// ─── Read ────────────────────────────────────────────────────────────────────

/**
 * Fetch all todos with optional filtering. Always ordered newest first.
 * @param {{ completed?, priority?, search? }} options
 */
export async function getAllTodos({
  completed,
  priority,
  search
} = {}) {
  const filter = {};

  if (completed !== undefined) {
    filter.completed = completed === 'true' || completed === true;
  }
  if (priority) {
    filter.priority = priority;
  }
  if (search) {
    filter.$or = [
      { title:       { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags:        { $regex: search, $options: 'i' } }
    ];
  }

  const docs = await Todo.find(filter).sort({ createdAt: -1 });
  return docs.map(toPlain);
}

/**
 * Fetch a single todo by its MongoDB ObjectId string.
 * Returns null when not found.
 */
export async function getTodoById(id) {
  assertValidId(id);
  const doc = await Todo.findById(id);
  return toPlain(doc);
}

/**
 * Aggregate stats across all todos.
 */
export async function getTodoStats() {
  const [total, completed, high, medium, low] = await Promise.all([
    Todo.countDocuments(),
    Todo.countDocuments({ completed: true }),
    Todo.countDocuments({ priority: 'high',   completed: false }),
    Todo.countDocuments({ priority: 'medium', completed: false }),
    Todo.countDocuments({ priority: 'low',    completed: false })
  ]);
  return {
    total,
    completed,
    active: total - completed,
    byPriority: { high, medium, low }
  };
}

// ─── Write ───────────────────────────────────────────────────────────────────

/**
 * Create a new todo.
 * @param {{ title, description?, priority?, tags? }} data
 */
export async function createTodo(data) {
  const doc = await Todo.create({
    title:       data.title.trim(),
    description: (data.description || '').trim(),
    completed:   false,
    priority:    data.priority || 'medium',
    tags:        Array.isArray(data.tags) ? data.tags : []
  });
  return toPlain(doc);
}

/**
 * Update an existing todo (partial update supported).
 * Returns null when not found.
 * @param {string} id
 * @param {{ title?, description?, completed?, priority?, tags? }} data
 */
export async function updateTodo(id, data) {
  assertValidId(id);
  const fields = {};
  if (data.title       !== undefined) fields.title       = data.title.trim();
  if (data.description !== undefined) fields.description = data.description.trim();
  if (data.completed   !== undefined) fields.completed   = Boolean(data.completed);
  if (data.priority    !== undefined) fields.priority    = data.priority;
  if (data.tags        !== undefined && Array.isArray(data.tags)) fields.tags = data.tags;

  const doc = await Todo.findByIdAndUpdate(
    id,
    { $set: fields },
    { new: true, runValidators: true }
  );
  return toPlain(doc);
}

/**
 * Toggle the `completed` flag of a todo.
 * Returns null when not found.
 * @param {string} id
 */
export async function toggleTodo(id) {
  assertValidId(id);
  const existing = await Todo.findById(id);
  if (!existing) return null;
  existing.completed = !existing.completed;
  await existing.save();
  return toPlain(existing);
}

/**
 * Delete a todo by id.
 * Returns true when deleted, false when not found.
 * @param {string} id
 */
export async function deleteTodo(id) {
  assertValidId(id);
  const result = await Todo.findByIdAndDelete(id);
  return result !== null;
}

/**
 * Seed sample data when the collection is empty (called once at startup).
 */
export async function seedIfEmpty() {
  const count = await Todo.countDocuments();
  if (count > 0) return;
  await Todo.insertMany([
    {
      title: 'Learn React MPA patterns',
      description: 'Understand how multi-page apps work with React + Vite',
      completed: false,
      priority: 'high',
      tags: ['learning', 'frontend']
    },
    {
      title: 'Build production-ready Express API',
      description: 'Implement proper error handling, validation, and logging',
      completed: true,
      priority: 'medium',
      tags: ['backend', 'api']
    },
    {
      title: 'Write clear documentation',
      description: 'Document every feature so interviewers can evaluate properly',
      completed: false,
      priority: 'high',
      tags: ['docs']
    }
  ]);
  console.log('📦 Database seeded with sample todos');
}
