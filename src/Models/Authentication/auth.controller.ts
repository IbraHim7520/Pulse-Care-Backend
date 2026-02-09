import { Request, Response } from "express"
import catchAsync from "../../shared/catchAsync"
import { authService } from "./auth.service"

const registerPaintentController = catchAsync(async(req:Request , res:Response)=>{
    const userData = req.body;
    const userRegisterData = await authService.registerPaitent(userData)
    res.status(201).send({
        success: true,
        message: "New Paitent Registered successfully.",
        data: userRegisterData
    })
})


const loginUserControle = catchAsync(async(req:Request , res:Response)=>{
    const userData = req.body;
    const userRegisterData = await authService.loginUser(userData)
    res.status(201).send({
        success: true,
        message: "SignIn successfully.",
        data: userRegisterData
    })
})
export const authController = {
    registerPaintentController,
    loginUserControle
}