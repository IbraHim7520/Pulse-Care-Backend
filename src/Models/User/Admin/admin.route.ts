import { Router } from "express";
import { adminController } from "./admin.controller";
import zodVlidations from "../../../middlewere/zodValidations";
import { createAdminSchema } from "../../../ZodSchema/zodUserSchema";
import { verifyRequest } from "../../../middlewere/verifyRequest";
import { Role } from "../../../generated/prisma/enums";

const adminRoute = Router();

adminRoute.post('/create-admin', verifyRequest(Role.ADMIN , Role.SUPER_ADMIN) , zodVlidations(createAdminSchema) ,adminController.createAdminController)

adminRoute.get('/all-admins', verifyRequest(Role.ADMIN , Role.SUPER_ADMIN) ,adminController.getAllAdminsController );
adminRoute.patch('/update-admin/:adminId', verifyRequest(Role.SUPER_ADMIN) ,adminController.updateAdminController)
adminRoute.get('/single-admin/:adminId', verifyRequest(Role.ADMIN , Role.SUPER_ADMIN) ,adminController.getOneAdminController)
adminRoute.delete('/delete-admin/:adminId', verifyRequest(Role.SUPER_ADMIN) ,adminController.deleteAdminController)



export default adminRoute;