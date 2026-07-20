import { createComment, getCommentsByTaskId, updateComment, deleteComment } from '../controllers/task.controller.js';
import auth from '../middleware/auth.middleware.js';
import { Router } from 'express';

const router = Router();

router.post('/', auth, createComment);
router.get('/:taskId', auth, getCommentsByTaskId);
router.patch('/:commentId', auth, updateComment);
router.delete('/:commentId', auth, deleteComment);

export default router;