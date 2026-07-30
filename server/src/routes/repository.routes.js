import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import {
    importRepository,
    getProjectRepositories,
    getRepositoryTree,
    getRepositoryFile
} from "../controllers/repository.controller.js";

const router = Router();

router.post(
    "/projects/:projectId/import",
    auth,
    importRepository
);

router.get(
    "/project/:projectId",
    auth,
    getProjectRepositories
);


router.get(
    "/:repositoryId/tree",
    auth,
    getRepositoryTree
);

router.get(
    "/:repositoryId/file",
    auth,
    getRepositoryFile
);

export default router;