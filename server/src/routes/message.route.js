import { createMessage, getMessagesByProjectId, deleteMessage } from '../controllers/message.controller.js';
import auth from '../middleware/auth.middleware.js';
import { Router } from 'express';


const router = Router();

router.post('/', auth, createMessage);
router.get('/project/:projectId', auth, getMessagesByProjectId);
router.delete('/:messageId', auth, deleteMessage);

export default router;