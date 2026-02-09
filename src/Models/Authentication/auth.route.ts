import { Router } from "express";
import { authController } from "./auth.controller";

const authRouter = Router();

authRouter.post('/register', authController.registerPaintentController)
authRouter.post('/sign-in', authController.loginUserControle);
export default authRouter