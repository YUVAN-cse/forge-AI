import { createProject, getProjectsByOrganizationId, getProjectById } from '../controllers/project.controller.js';
import auth from '../middleware/auth.middleware.js';
import { getActivityByProjectId } from '../controllers/activity.controller.js';
import { Router } from 'express';

const router = Router();

router.post('/', auth, createProject);
router.get('/:organizationId', auth, getProjectsByOrganizationId);
router.get('/:id', auth, getProjectById);
router.get('/:projectId/activity', auth, getActivityByProjectId);

export default router;