
import { Router } from "express";

import auth from "../middleware/auth.middleware.js";

import {
    reviewRepositoryCode,
} from "../controllers/repositoryCodeReview.controller.js";

const router = Router();

router.post(
    "/repositories/:repositoryId/code-review",
    auth,
    reviewRepositoryCode
);

export default router;
