import { Router } from "express";
import auth from "../middleware/auth.middleware.js";

import {
    getProjectContextController,
} from "../controllers/ai.controller.js";

import {askProjectAI} from "../controllers/ai.controller.js";
import {generateProjectSummary} from "../controllers/ai.controller.js";
import {askTaskAI} from "../controllers/ai.controller.js";

import {generateTasksForProject} from "../controllers/ai.controller.js";

const router = Router();

router.get(
    "/projects/:projectId/context",
    auth,
    getProjectContextController
);

router.post(
    "/projects/:projectId/ask",
    auth,
    askProjectAI
);

router.get(
    "/projects/:projectId/summary",
    auth,
    generateProjectSummary
);

router.post(
    "/tasks/:taskId/ask",
    auth,
    askTaskAI
);


router.post(
    "/projects/:projectId/generate-tasks",
    auth,
    generateTasksForProject
);

export default router;