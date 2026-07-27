import { Router } from "express";
import auth from "../middleware/auth.middleware.js";
import { importRepository } from "../controllers/repository.controller.js";

const router = Router();

router.post(
    "/projects/:projectId/import",
    auth,
    importRepository
);

export default router;