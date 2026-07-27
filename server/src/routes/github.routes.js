import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import {
    connectGithub,
    githubCallback
} from "../controllers/github.controller.js";

import { getRepositories } from "../controllers/github.controller.js";

const router = Router();

router.get("/connect", auth, connectGithub);
router.get("/callback", githubCallback);
router.get("/repositories", auth, getRepositories);

export default router;