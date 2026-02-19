import { Router } from "express";
import { authController } from "./auth.controller";
import { verifyRequest } from "../../middlewere/verifyRequest";
import { Role } from "../../generated/prisma/enums";

const authRouter = Router();

authRouter.post('/register', authController.registerPaintentController)
authRouter.post('/sign-in', authController.loginUserControle);

authRouter.post('/regenerate-token', authController.getNewTokenControle)

authRouter.post('/change-password' , verifyRequest(Role.ADMIN , Role.PAITENT , Role.DOCTOR , Role.SUPER_ADMIN) , authController.changePassControlle);
authRouter.post('/logout' , verifyRequest(Role.ADMIN , Role.PAITENT , Role.DOCTOR , Role.SUPER_ADMIN) , authController.userLogoutControle);


//! Un-tasted routes
//!Cause failed to sent emaail,
authRouter.post('/verify-email' , authController.verifyEmailControlle)
authRouter.post('/forget-password' , authController.forgetPassControle)
authRouter.post('/reset-password' , authController.resetPassControle)



//Google Login API
//! Un-tasted routes
//!Errors:-- Error Occurred While Redirecting To Google. Please Try Again Later. Failed to fetch
authRouter.get('/login/google', authController.googleLoginControle)
authRouter.get('/google/success', authController.googleLoginSuccess)
authRouter.get('/oauth/error', authController.googleOauthError)
export default authRouter