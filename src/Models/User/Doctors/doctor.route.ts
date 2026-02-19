import { Router } from "express";
import { doctorController } from "./doctor.controller";
import zodVlidations from "../../../middlewere/zodValidations";
import { updateDoctorSchema } from "../../../ZodSchema/zodUserSchema";
import { verifyRequest } from "../../../middlewere/verifyRequest";
import { Role } from "../../../generated/prisma/enums";

const doctorRoute = Router()


doctorRoute.get('/all-doctors', verifyRequest(Role.ADMIN, Role.SUPER_ADMIN) ,doctorController.getAllDoctors);

doctorRoute.get('/:doctorId', verifyRequest(Role.ADMIN , Role.SUPER_ADMIN) ,doctorController.getOneDoctor);
doctorRoute.delete('/:doctorId', verifyRequest(Role.ADMIN , Role.SUPER_ADMIN) ,doctorController.deleteDoctor);

doctorRoute.patch('/:doctorId', verifyRequest(Role.ADMIN , Role.SUPER_ADMIN) ,zodVlidations(updateDoctorSchema) ,doctorController.updateDoctor)



export default doctorRoute;