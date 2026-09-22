import * as todoService from '../services/todoService.js';
import { validateCreatePayload, validateUpdatePayload } from '../utils/validators.js';
import { sendSuccess, sendError, sendNotFound } from '../utils/apiResponse.js';

/**
 * controllers/todoController.js
 * Thin HTTP layer – validates input, calls the service, sends the response.
 * No DB logic lives here.
 */

// ─── GET /api/todos ───────────────────────────────────────────────────────────
export async function listTodos(req, res, next) {
  try {
    const { completed, priority, search } = req.query;
    const todos = await todoService.getAllTodos({ completed, priority, search });
    sendSuccess(res, todos);
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/todos/stats ─────────────────────────────────────────────────────
export async function getStats(req, res, next) {
  try {
    const stats = await todoService.getTodoStats();
    sendSuccess(res, stats);
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/todos/:id ───────────────────────────────────────────────────────
export async function getTodo(req, res, next) {
  try {
    const todo = await todoService.getTodoById(req.params.id);
    if (!todo) return sendNotFound(res, 'Todo not found');
    sendSuccess(res, todo);
  } catch (err) {
    // assertValidId throws 400 errors; forward them to errorHandler
    next(err);
  }
}

// ─── POST /api/todos ──────────────────────────────────────────────────────────
export async function createTodo(req, res, next) {
  try {
    const { title, description, priority, tags } = req.body;

    const errors = validateCreatePayload({ title, priority, tags });
    if (errors.length) return sendError(res, errors, 400);

    const todo = await todoService.createTodo({ title, description, priority, tags });
    sendSuccess(res, todo, 'Todo created successfully', 201);
  } catch (err) {
    next(err);
  }
}

// ─── PUT /api/todos/:id ───────────────────────────────────────────────────────
export async function updateTodo(req, res, next) {
  try {
    const { title, description, completed, priority, tags } = req.body;

    const errors = validateUpdatePayload({ title, priority, tags });
    if (errors.length) return sendError(res, errors, 400);

    const todo = await todoService.updateTodo(req.params.id, {
      title, description, completed, priority, tags
    });
    if (!todo) return sendNotFound(res, 'Todo not found');
    sendSuccess(res, todo, 'Todo updated successfully');
  } catch (err) {
    next(err);
  }
}

// ─── PATCH /api/todos/:id/toggle ─────────────────────────────────────────────
export async function toggleTodo(req, res, next) {
  try {
    const todo = await todoService.toggleTodo(req.params.id);
    if (!todo) return sendNotFound(res, 'Todo not found');
    sendSuccess(res, todo, `Todo marked as ${todo.completed ? 'completed' : 'active'}`);
  } catch (err) {
    next(err);
  }
}

// ─── DELETE /api/todos/:id ────────────────────────────────────────────────────
export async function deleteTodo(req, res, next) {
  try {
    const deleted = await todoService.deleteTodo(req.params.id);
    if (!deleted) return sendNotFound(res, 'Todo not found');
    sendSuccess(res, null, 'Todo deleted successfully');
  } catch (err) {
    next(err);
  }
}
