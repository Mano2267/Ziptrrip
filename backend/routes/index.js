import { Router } from 'express';
import todosRouter from './todos.js';

/**
 * routes/index.js
 * Central route aggregator – mount all resource routers here.
 * server.js only needs to import this one file.
 */
const router = Router();

router.use('/todos', todosRouter);

// Future routers go here, e.g.:
// router.use('/users', usersRouter);

export default router;
