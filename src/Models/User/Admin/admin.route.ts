import { Router } from "express";
import { adminController } from "./admin.controller";
import zodVlidations from "../../../middlewere/zodValidations";
import { createAdminSchema } from "../../../ZodSchema/zodUserSchema";

const adminRoute = Router();

adminRoute.post('/create-admin' ,zodVlidations(createAdminSchema) ,adminController.createAdminController)

adminRoute.get('/all-admins', adminController.getAllAdminsController );
adminRoute.patch('/update-admin/:adminId', adminController.updateAdminController)
adminRoute.get('/single-admin/:adminId', adminController.getOneAdminController)
adminRoute.delete('/delete-admin/:adminId', adminController.deleteAdminController)



export default adminRoute;