import { Request, Response } from "express"
import catchAsync from "../../shared/catchAsync"
import { authService } from "./auth.service"
import { tokenUtilts } from "../../utils/token";
import AppError from "../../shared/AppError";

import status from "http-status";
import env from "../../configs/env";
import { auth } from "../../lib/auth";

const registerPaintentController = catchAsync(async (req: Request, res: Response) => {
    const userData = req.body;
    const userRegisterResult = await authService.registerPaitent(userData)

    const { accessToken, refreshToken, token } = userRegisterResult
    tokenUtilts.setAccessTokenCookie(res, accessToken);
    tokenUtilts.setRefreshTokenCookie(res, refreshToken)
    tokenUtilts.setBetterAuthSessionCookie(res, token as string)

    res.status(201).send({
        success: true,
        message: "New Paitent Registered successfully.",
        data: userRegisterResult
    })
})


const loginUserControle = catchAsync(async (req: Request, res: Response) => {
    const userData = req.body;
    const userRegisterData = await authService.loginUser(userData)

    const { accessToken, refreshToken, token } = userRegisterData
    tokenUtilts.setAccessTokenCookie(res, accessToken);
    tokenUtilts.setRefreshTokenCookie(res, refreshToken)
    tokenUtilts.setBetterAuthSessionCookie(res, token)

    res.status(201).send({
        success: true,
        message: "SignIn successfully.",
        data: userRegisterData
    })
})


const getNewTokenControle = catchAsync(async (req: Request, res: Response) => {
    const oldrefreshToken = req.cookies?.refreshToken;
    const btrAuthSessionToken = req.cookies?.["better-auth.session_token"];
    if (!oldrefreshToken) {
        throw new AppError(status.UNAUTHORIZED, "Refresh token is missing!!");
    }

    const result = await authService.getNewToken(oldrefreshToken, btrAuthSessionToken);
    const { sessionToken, refreshToken, accessToken } = result;

    tokenUtilts.setAccessTokenCookie(res, accessToken);
    tokenUtilts.setRefreshTokenCookie(res, refreshToken);
    tokenUtilts.setBetterAuthSessionCookie(res, sessionToken)

    res.status(200).send({
        success: true,
        message: "New Token generated successfully.",
        data: result
    })
})



const changePassControlle = catchAsync(async (req: Request, res: Response) => {
    const { oldPass, newPass } = req.body;
    const btrAuthSessionToken = req.cookies?.["better-auth.session_token"];

    const passChangeResponse = await authService.chnagePassword(oldPass, newPass, btrAuthSessionToken);
    const { refreshToken, accessToken } = passChangeResponse;

    tokenUtilts.setAccessTokenCookie(res, accessToken);
    tokenUtilts.setRefreshTokenCookie(res, refreshToken);
    tokenUtilts.setBetterAuthSessionCookie(res, passChangeResponse.token as string)

    res.status(200).send({
        success: true,
        message: "Passwor reset successfully.",
        data: passChangeResponse
    })
})


const userLogoutControle = catchAsync(async (req: Request, res: Response) => {

    const btrAuthSessionToken = req.cookies?.["better-auth.session_token"];

    const logoutResponse = await authService.userLogout(btrAuthSessionToken);

    tokenUtilts.clearCookies(res, 'accessToken')
    tokenUtilts.clearCookies(res, 'refreshToken')
    tokenUtilts.clearCookies(res, 'better-auth.session_token')


    if (logoutResponse.success) {
        res.status(200).send({
            success: true,
            message: "Logout successfully.",

        })
    } else {
        res.status(200).send({
            success: false,
            message: "Failed to logout! Please try again.",

        })
    }
})


const verifyEmailControlle = catchAsync(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const response = await authService.emailVerify(email, otp);
    res.status(status.OK).send({
        success: true,
        message: "Email varification sent",
        data: response
    })
})


const forgetPassControle = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    await authService.forgetPassword(email);
    res.status(200).send({
        success: true,
        message: "Password reset OTP sent to email successfully!"
    })
})


const resetPassControle = catchAsync(async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body;
    await authService.resetPassword(email, otp, newPassword);
    res.status(200).send({
        success: true,
        message: "Password reset successfully!"
    })
})


const googleLoginControle = catchAsync(async (req: Request, res: Response) => {
    const redirectpath = req.query.redirect || "/dashboard";
    const encodedRedirectPath = encodeURIComponent(redirectpath as string);
    const callbackURL = `${env.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`

    res.render('googleRedirect', {
        callbackURL: callbackURL,
        betterAuthUrl: env.BETTER_AUTH_URL

    })
})

const googleLoginSuccess = catchAsync(async (req: Request, res: Response) => {
    const redirectpath = req.query.redirect as string || "/dashboard";
    const sessionToken = req.cookies["better-auth.session_token"]

    if (!sessionToken) {
        return res.redirect(`${env.FRONTEND_URL}/login?error=oauth_failed`)
    }

    const UserSession = await auth.api.getSession({
        headers: {
            "Cookie": `better-auth.session_token=${sessionToken}`
        }
    })

    if (!UserSession) {
        return res.redirect(`${env.FRONTEND_URL}/login?error=no_session_found`)
    }

    if (UserSession && !UserSession?.user) {
        return res.redirect(`${env.FRONTEND_URL}/login?error=no_user_found`)
    }

    const paitentCreateResult = await authService.googleLoginSuccess(UserSession);
    const { refreshToken, accessToken } = paitentCreateResult;

    tokenUtilts.setAccessTokenCookie(res, accessToken);
    tokenUtilts.setRefreshTokenCookie(res, refreshToken);

    let finalRedirectPath;
    if (redirectpath.startsWith("/") && !redirectpath.startsWith("//")) {
        finalRedirectPath = redirectpath
    } else {
        finalRedirectPath = '/dashboard'
    }

    res.redirect(`${env.FRONTEND_URL}/${finalRedirectPath}`)
})


const googleOauthError = catchAsync(async (req: Request, res: Response) => {
    const errors = req.query.error as string || "oauth_error";

    res.redirect(`${env.FRONTEND_URL}/login?error=${errors}`)
})
export const authController = {
    registerPaintentController,
    loginUserControle,
    getNewTokenControle,
    changePassControlle,
    userLogoutControle,
    verifyEmailControlle,
    resetPassControle,
    forgetPassControle,
    googleLoginControle,
    googleLoginSuccess,
    googleOauthError
}