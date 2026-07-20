import {createOrganization, getOrganizations, getOrganizationById} from '../controllers/organization.controller.js';
import auth from '../middleware/auth.middleware.js';
import { Router } from 'express';

const router = Router();

router.post('/', auth, createOrganization);
router.get('/', auth, getOrganizations);
router.get('/:id', auth, getOrganizationById);

export default router;