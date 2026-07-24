import {
    createAttachment,
    getAttachmentsByTaskId,
    deleteAttachment,
} from "../controllers/attachment.controller.js";

import auth from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

import { Router } from "express";

const router = Router();

router.post(
    "/",
    auth,
    upload.single("file"),
    createAttachment
);

router.get(
    "/task/:taskId",
    auth,
    getAttachmentsByTaskId
);

router.delete(
    "/:attachmentId",
    auth,
    deleteAttachment
);

export default router;
// POST   /api/attachments
// GET    /api/attachments/task/:taskId
// DELETE /api/attachments/:attachmentId
