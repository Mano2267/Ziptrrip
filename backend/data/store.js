import mongoose from 'mongoose';
import Todo from '../models/Todo.js';

/**
 * MongoDB-backed data store.
 * Exposes the same interface as the old file-based TodoStore so that
 * routes/todos.js and the rest of the codebase require no changes.
 */
class TodoStore {
  /**
   * Seed the database with sample data on first run (empty collection).
   */
  async _seedIfEmpty() {
    const count = await Todo.countDocuments();
    if (count > 0) return;

    await Todo.insertMany([
      {
        title: 'Learn React MPA patterns',
        description: 'Understand how multi-page apps work with React + Vite',
        completed: false,
        priority: 'high',
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        tags: ['learning', 'frontend']
      },
      {
        title: 'Build production-ready Express API',
        description: 'Implement proper error handling, validation, and logging',
        completed: true,
        priority: 'medium',
        dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        tags: ['backend', 'api']
      },
      {
        title: 'Write clear documentation',
        description: 'Document every feature so interviewers can evaluate properly',
        completed: false,
        priority: 'high',
        dueDate: null,
        tags: ['docs']
      }
    ]);

    console.log('📦 Database seeded with sample todos');
  }

  /**
   * Convert a Mongoose document to a plain object shaped like the old store.
   * Maps Mongoose's _id → id and exposes timestamps as ISO strings.
   */
  _toPlain(doc) {
    if (!doc) return null;
    const obj = doc.toObject();
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
    // Normalise timestamps to ISO strings
    obj.createdAt = obj.createdAt instanceof Date ? obj.createdAt.toISOString() : obj.createdAt;
    obj.updatedAt = obj.updatedAt instanceof Date ? obj.updatedAt.toISOString() : obj.updatedAt;
    return obj;
  }

  async getAll({ completed, priority, search } = {}) {
    const filter = {};

    if (completed !== undefined) {
      filter.completed = completed === 'true' || completed === true;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (search) {
      // Use MongoDB text search when available, fall back to regex
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const docs = await Todo.find(filter).sort({ createdAt: -1 });
    return docs.map(d => this._toPlain(d));
  }

  async getById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const doc = await Todo.findById(id);
    return this._toPlain(doc);
  }

  async create(data) {
    const doc = await Todo.create({
      title: data.title.trim(),
      description: (data.description || '').trim(),
      completed: false,
      priority: data.priority || 'medium',
      tags: Array.isArray(data.tags) ? data.tags : []
    });
    return this._toPlain(doc);
  }

  async update(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    const updateFields = {};
    if (data.title !== undefined) updateFields.title = data.title.trim();
    if (data.description !== undefined) updateFields.description = data.description.trim();
    if (data.completed !== undefined) updateFields.completed = Boolean(data.completed);
    if (data.priority !== undefined) updateFields.priority = data.priority;
    if (data.tags !== undefined && Array.isArray(data.tags)) updateFields.tags = data.tags;

    const doc = await Todo.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    return this._toPlain(doc);
  }

  async delete(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const result = await Todo.findByIdAndDelete(id);
    return result !== null;
  }

  async getStats() {
    const [total, completed] = await Promise.all([
      Todo.countDocuments(),
      Todo.countDocuments({ completed: true })
    ]);
    const active = total - completed;
    const [high, medium, low] = await Promise.all([
      Todo.countDocuments({ priority: 'high', completed: false }),
      Todo.countDocuments({ priority: 'medium', completed: false }),
      Todo.countDocuments({ priority: 'low', completed: false })
    ]);
    return { total, completed, active, byPriority: { high, medium, low } };
  }
}

export const store = new TodoStore();
