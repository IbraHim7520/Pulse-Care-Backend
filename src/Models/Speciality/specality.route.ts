import { Router } from "express";
import { specalityController } from "./specality.controller";
import { verifyRequest } from "../../middlewere/verifyRequest";
import { Role } from "../../generated/prisma/enums";

const specialityRoute = Router()

specialityRoute.get('/all-specalities', verifyRequest(Role.PAITENT) ,specalityController.getSpeicalityControl)
specialityRoute.post('/create-specality', specalityController.createSpeicalityControl)
specialityRoute.delete('/delete-specality/:specalityId', specalityController.deleteSpeicalityControl)
specialityRoute.patch('/update-specality/:specalityId', specalityController.updateSpeicalityControl)

export default specialityRoute