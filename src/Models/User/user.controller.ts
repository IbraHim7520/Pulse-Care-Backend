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
const getMeControle = catchAsync(async(req:Request , res:Response)=>{
    const userId = req.user.userId;
    const profileData = await UserService.getMyProfile(userId as string)
    res.status(200).send({
        success: true,
        message: "Profile retrived successfully",
        data: profileData
    })
})
export const userController = {
    createDoctorController,
    getMeControle
}