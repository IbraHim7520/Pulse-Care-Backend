import { Router } from "express";
import { userController } from "./user.controller";
import doctorRoute from "./Doctors/doctor.route";
import zodVlidations from "../../middlewere/zodValidations";
import { createDoctorSchema } from "../../ZodSchema/zodUserSchema";
import adminRoute from "./Admin/admin.route";
import { verifyRequest } from "../../middlewere/verifyRequest";
import { Role } from "../../generated/prisma/enums";

const userRouter = Router();

userRouter.post('/create-doctor', verifyRequest(Role.ADMIN , Role.SUPER_ADMIN) ,verifyRequest(Role.ADMIN , Role.SUPER_ADMIN) , zodVlidations(createDoctorSchema) , userController.createDoctorController)
userRouter.get('/me', verifyRequest(Role.PAITENT , Role.ADMIN, Role.DOCTOR , Role.SUPER_ADMIN) ,userController.getMeControle)



userRouter.use('/doctors', doctorRoute)
userRouter.use('/admin', adminRoute)



export default userRouter;