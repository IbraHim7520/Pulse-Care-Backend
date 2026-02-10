import { Router } from "express";
import { userController } from "./user.controller";

const userRouter = Router();

userRouter.post('/create-doctor', userController.createDoctorController)
//userRouter.post('/create-admin', userController.createDoctorController)
//userRouter.post('/create-super-admin', userController.createDoctorController)

export default userRouter;