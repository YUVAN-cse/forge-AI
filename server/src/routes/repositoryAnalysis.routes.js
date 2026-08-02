import { Router } from "express";

import auth from "../middleware/auth.middleware.js";

import {
    analyzeRepository,
} from "../controllers/repositoryAnalysis.controller.js";


const router = Router();


router.post(

    "/repositories/:repositoryId/analyze",

    auth,

    analyzeRepository

);


export default router;