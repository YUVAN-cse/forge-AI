import {register , login , me , logout} from '../controllers/auth.controller.js';
import auth from '../middleware/auth.middleware.js';
import { Router } from 'express';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, me);
router.get('/logout', auth, logout);

export default router;