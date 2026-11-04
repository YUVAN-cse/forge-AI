
import { Router } from "express";

import auth from "../middleware/auth.middleware.js";

import {
    askRepositoryQuestion,
} from "../controllers/repositoryAssistant.controller.js";

const router = Router();

router.post(
    "/repositories/:repositoryId/assistant",
    auth,
    askRepositoryQuestion
);

export default router;
