import { Router } from 'express';
import {
  listTodos,
  getStats,
  getTodo,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo
} from '../controllers/todoController.js';

/**
 * routes/todos.js
 * Pure route definitions – no logic, just wires URLs to controller handlers.
 */
const router = Router();

router.get('/',              listTodos);   // GET  /api/todos
router.get('/stats',         getStats);    // GET  /api/todos/stats
router.get('/:id',           getTodo);     // GET  /api/todos/:id
router.post('/',             createTodo);  // POST /api/todos
router.put('/:id',           updateTodo);  // PUT  /api/todos/:id
router.patch('/:id/toggle',  toggleTodo);  // PATCH /api/todos/:id/toggle
router.delete('/:id',        deleteTodo);  // DELETE /api/todos/:id

export default router;
