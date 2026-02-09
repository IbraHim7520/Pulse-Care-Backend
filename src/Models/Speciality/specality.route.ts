import { Router } from "express";
import { specalityController } from "./specality.controller";

const specialityRoute = Router()

specialityRoute.get('/all-specalities', specalityController.getSpeicalityControl)
specialityRoute.post('/create-specality', specalityController.createSpeicalityControl)
specialityRoute.delete('/delete-specality/:specalityId', specalityController.deleteSpeicalityControl)
specialityRoute.patch('/update-specality/:specalityId', specalityController.updateSpeicalityControl)

export default specialityRoute