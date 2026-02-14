import { Router } from "express";
import { userController } from "./user.controller";
import doctorRoute from "./Doctors/doctor.route";
import zodVlidations from "../../middlewere/zodValidations";
import { createDoctorSchema } from "../../ZodSchema/zodUserSchema";
import adminRoute from "./Admin/admin.route";

const userRouter = Router();

userRouter.post('/create-doctor', zodVlidations(createDoctorSchema) , userController.createDoctorController)
//userRouter.post('/create-admin', userController.createDoctorController)
//userRouter.post('/create-super-admin', userController.createDoctorController)




userRouter.use('/doctors', doctorRoute)
userRouter.use('/admin', adminRoute)

export default userRouter;