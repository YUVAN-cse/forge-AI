
import { Router } from "express";
import auth from "../middleware/auth.middleware.js";

import {
    getRepositoryIntelligence
} from "../controllers/repositoryIntelligence.controller.js";

const router = Router();

router.get(
    "/repositories/:repositoryId/intelligence",
    auth,
    getRepositoryIntelligence
);

export default router;
