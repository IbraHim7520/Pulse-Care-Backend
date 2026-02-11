import { Router } from "express";
import { doctorController } from "./doctor.controller";

const doctorRoute = Router()


doctorRoute.get('/all-doctors', doctorController.getAllDoctors);

//!-------TASKS----------
//?1. Get Doctor by Id
//?2. Update Doctor by Id
//?3. Delete Doctor by Id Soft Delete


export default doctorRoute;