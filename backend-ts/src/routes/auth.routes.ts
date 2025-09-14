import { Router } from "express";
import { refreshTokens } from "../controllers/auth.controller.js";

const router = Router()


router.route('/refresh').post(refreshTokens)


export default router