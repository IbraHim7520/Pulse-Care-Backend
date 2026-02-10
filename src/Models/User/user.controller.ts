import { Request, Response } from "express"
import catchAsync from "../../shared/catchAsync"
import { UserService } from "./user.service";

const createDoctorController = catchAsync(async(req:Request , res:Response )=>{
    const payload = req.body;
    const doctorCreateResult = await UserService.createDoctor(payload)
    res.status(201).send({
        success: true,
        message: "Doctor created successfully",
        data: doctorCreateResult
    })
})

export const userController = {
    createDoctorController
}