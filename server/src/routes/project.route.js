import { createProject, getProjectsByOrganizationId, getProjectById } from '../controllers/project.controller.js';
import auth from '../middleware/auth.middleware.js';
import { Router } from 'express';

const router = Router();

router.post('/', auth, createProject);
router.get('/:organizationId', auth, getProjectsByOrganizationId);
router.get('/:id', auth, getProjectById);

export default router;