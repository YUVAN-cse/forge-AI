import { createAttachment, getAttachmentsByTaskId, deleteAttachment } from '../controllers/attachment.controller.js';
import auth from '../middleware/auth.middleware.js';
import { Router } from 'express';

const router = Router();    

router.post('/', auth, createAttachment);
router.get('/task/:taskId', auth, getAttachmentsByTaskId);
router.delete('/:attachmentId', auth, deleteAttachment);

export default router;

// POST   /api/attachments
// GET    /api/attachments/task/:taskId
// DELETE /api/attachments/:attachmentId