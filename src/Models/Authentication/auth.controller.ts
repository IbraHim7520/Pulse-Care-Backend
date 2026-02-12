import { Request, Response } from "express"
import catchAsync from "../../shared/catchAsync"
import { authService } from "./auth.service"
import { tokenUtilts } from "../../utils/token";

const registerPaintentController = catchAsync(async(req:Request , res:Response)=>{
    const userData = req.body;
    const userRegisterResult = await authService.registerPaitent(userData)
    
    const {accessToken ,refreshToken ,token} = userRegisterResult
    tokenUtilts.setAccessTokenCookie(res , accessToken);
    tokenUtilts.setRefreshTokenCookie(res , refreshToken)
    tokenUtilts.setBetterAuthSessionCookie(res , token as string)

    res.status(201).send({
        success: true,
        message: "New Paitent Registered successfully.",
        data: userRegisterResult
    })
})


const loginUserControle = catchAsync(async(req:Request , res:Response)=>{
    const userData = req.body;
    const userRegisterData = await authService.loginUser(userData)
    
    const {accessToken , refreshToken , token} = userRegisterData
    tokenUtilts.setAccessTokenCookie(res , accessToken);
    tokenUtilts.setRefreshTokenCookie(res , refreshToken)
    tokenUtilts.setBetterAuthSessionCookie(res , token)

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