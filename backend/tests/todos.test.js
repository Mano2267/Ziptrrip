/**
 * Basic unit / integration tests for the Todo API
 * Run with: npm test (from backend folder)
 */
import request from 'supertest';
import app from '../server.js';
import { store } from '../data/store.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '../data/todos.json');

// Reset store before each test suite
beforeAll(async () => {
  // Ensure clean state
  try {
    await fs.unlink(DATA_FILE);
  } catch (_) { }
  store.initialized = false;
  await store.init();
});

describe('Todo API', () => {
  let createdId;

  test('GET /api/health returns 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/todos returns list', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('POST /api/todos creates a todo', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({
        title: 'Test Todo',
        description: 'Created by test',
        priority: 'high',
        tags: ['test']
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Test Todo');
    expect(res.body.data.id).toBeDefined();
    createdId = res.body.data.id;
  });

  test('POST /api/todos rejects empty title', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ title: '   ' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('GET /api/todos/:id returns single todo', async () => {
    const res = await request(app).get(`/api/todos/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(createdId);
  });

  test('GET /api/todos/:id returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/todos/non-existent-id');
    expect(res.status).toBe(404);
  });

  test('PUT /api/todos/:id updates todo', async () => {
    const res = await request(app)
      .put(`/api/todos/${createdId}`)
      .send({ title: 'Updated Title', completed: true });
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Updated Title');
    expect(res.body.data.completed).toBe(true);
  });

  test('PATCH /api/todos/:id/toggle toggles status', async () => {
    const before = await request(app).get(`/api/todos/${createdId}`);
    const wasCompleted = before.body.data.completed;

    const res = await request(app).patch(`/api/todos/${createdId}/toggle`);
    expect(res.status).toBe(200);
    expect(res.body.data.completed).toBe(!wasCompleted);
  });

  test('DELETE /api/todos/:id deletes todo', async () => {
    const res = await request(app).delete(`/api/todos/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const check = await request(app).get(`/api/todos/${createdId}`);
    expect(check.status).toBe(404);
  });
});
