import {createOrganization, getOrganizations, getOrganizationById , addMemberToOrganization, removeMemberFromOrganization , getMembersOfOrganization} from '../controllers/organization.controller.js';
import auth from '../middleware/auth.middleware.js';
import { Router } from 'express';

const router = Router();

router.post('/', auth, createOrganization);
router.get('/', auth, getOrganizations);
router.get('/:id', auth, getOrganizationById);
router.post('/:id/members', auth, addMemberToOrganization);
router.delete('/:id/members/:userId', auth, removeMemberFromOrganization);
router.get('/:id/members', auth, getMembersOfOrganization);

export default router;