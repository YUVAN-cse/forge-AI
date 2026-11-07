
import { Router } from "express";
import auth from "../middleware/auth.middleware.js";

import {
    getRepositoryIntelligence,
    generateRepositoryUMLController,
} from "../controllers/repositoryIntelligence.controller.js";

const router = Router();

router.get(
    "/repositories/:repositoryId/intelligence",
    auth,
    getRepositoryIntelligence
);

router.post(
    "/repositories/:repositoryId/uml",
    auth,
    generateRepositoryUMLController
);

export default router;
