import { Router } from "express";
import { doctorController } from "./doctor.controller";
import zodVlidations from "../../../middlewere/zodValidations";
import { updateDoctorSchema } from "../../../ZodSchema/zodUserSchema";

const doctorRoute = Router()


doctorRoute.get('/all-doctors', doctorController.getAllDoctors);

doctorRoute.get('/:doctorId', doctorController.getOneDoctor);
doctorRoute.delete('/:doctorId', doctorController.deleteDoctor);

doctorRoute.patch('/:doctorId', zodVlidations(updateDoctorSchema) ,doctorController.updateDoctor)
//!-------TASKS----------
//?1. Get Doctor by Id---Done
//?2. Update Doctor by Id -- Done
//?3. Delete Doctor by Id Soft Delete -- Done


export default doctorRoute;