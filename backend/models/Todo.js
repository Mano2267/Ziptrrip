import mongoose from 'mongoose';

/**
 * Todo Mongoose Schema
 * Mirrors the shape used by the old file-based store so the
 * rest of the codebase needs minimal changes.
 */
const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title must be 200 characters or less']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    completed: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'Priority must be one of: low, medium, high'
      },
      default: 'medium'
    },
    tags: {
      type: [String],
      default: []
    }
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
    // Return plain objects with virtuals applied
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for common query patterns
todoSchema.index({ completed: 1 });
todoSchema.index({ priority: 1 });
todoSchema.index({ createdAt: -1 });
todoSchema.index({ title: 'text', description: 'text', tags: 'text' }); // full-text search

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;
