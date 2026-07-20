import {createTask, getTasksByProjectId, updateTask, deleteTask} from '../controllers/task.controller.js';
import auth from '../middleware/auth.middleware.js';
import { Router } from 'express';

const router = Router();

router.post('/', auth, createTask);
router.get('/:projectId', auth, getTasksByProjectId);
router.put('/:taskId', auth, updateTask);
router.delete('/:taskId', auth, deleteTask);

export default router;