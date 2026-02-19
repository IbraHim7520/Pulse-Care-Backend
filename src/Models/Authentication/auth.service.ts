
import { auth } from "../../lib/auth";
import { UserStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { tokenUtilts } from "../../utils/token";
import AppError from "../../shared/AppError";
import status from "http-status";
import { jwtUtils } from "../../utils/jwt";
import env from "../../configs/env";
import { JwtPayload } from "jsonwebtoken";
import { isValid } from "zod/v3";

interface IRegisterPaitent {
    name: string,
    email: string,
    password: string
}

const registerPaitent = async (payload: IRegisterPaitent) => {
    const { name, email, password } = payload;
    const newUser = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
        }
    })
    if (!newUser.user) {
        throw new Error("Failed to register paitent!")
    }
    try {
        //* If user created then create a new paitent profile for the user
        const paintentProfileData = {
            userId: newUser.user.id,
            name: payload.name,
            email: payload.email
        }
        const paintent = await prisma.$transaction(async (tx) => {
            const newPaitent = await tx.paitent.create({
                data: paintentProfileData
            })
            return newPaitent;
        })


        const accessToken = tokenUtilts.getAccessToken({
            userId: newUser.user.id,
            email: newUser.user.email,
            name: newUser.user.name,
            role: newUser.user.role,
            status: newUser.user.status,
            isDeleted: newUser.user.isDeleted,
            emailVerified: newUser.user.emailVerified

        })

        const refreshToken = tokenUtilts.getRefreshToken({
            userId: newUser.user.id,
            email: newUser.user.email,
            name: newUser.user.name,
            role: newUser.user.role,
            status: newUser.user.status,
            isDeleted: newUser.user.isDeleted,
            emailVerified: newUser.user.emailVerified
        })


        return {
            ...newUser,
            accessToken,
            refreshToken,
            token: newUser.token, // explicitly include it
            paintent
        };
    } catch (error:any) {
        console.log(error)
        await prisma.user.delete({
            where: {
                id: newUser.user.id
            }
        })
        throw new Error(error)
    }
}


interface ILoggedInUser {
    email: string,
    password: string
}
const loginUser = async (payload: ILoggedInUser) => {
    const { email, password } = payload
    const loggedIn = await auth.api.signInEmail({
        body: {
            email,
            password
        }
    })

    if (loggedIn.user.status === UserStatus.BLOCKED) {
        throw new Error("User is Blocked!")
    }

    if (loggedIn.user.isDeleted) {
        throw new Error("User is not exists")
    }

    const accessToken = tokenUtilts.getAccessToken({
        userId: loggedIn.user.id,
        email: loggedIn.user.email,
        name: loggedIn.user.name,
        role: loggedIn.user.role,
        status: loggedIn.user.status,
        isDeleted: loggedIn.user.isDeleted,
        emailVerified: loggedIn.user.emailVerified

    })

    const refreshToken = tokenUtilts.getRefreshToken({
        userId: loggedIn.user.id,
        email: loggedIn.user.email,
        name: loggedIn.user.name,
        role: loggedIn.user.role,
        status: loggedIn.user.status,
        isDeleted: loggedIn.user.isDeleted,
        emailVerified: loggedIn.user.emailVerified
    })

    return {
        accessToken,
        refreshToken,
        ...loggedIn
    }

}

const getNewToken = async(refreshToken:string , sessionToken:string) =>{
    const isSessionTokenExists = await prisma.session.findUnique({
        where:{
            token: sessionToken,
        },
        include:{
            user: true
        }
    })
    if(!isSessionTokenExists){
        throw new AppError(status.UNAUTHORIZED , "Invalid session token provided!!");
    }

    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken , env.REFRESH_TOKEN_SECRET) as JwtPayload;
    if(!verifiedRefreshToken.success && verifiedRefreshToken.error ){
        throw new AppError(status.UNAUTHORIZED, "Invalid refresh token provided!!");
    }
    const userData = verifiedRefreshToken;
    
    const NewaccessToken = tokenUtilts.getAccessToken({
        userId: userData.userId,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        status: userData.status,
        isDeleted: userData.isDeleted,
        emailVerified: userData.emailVerified

    })

    const NewrefreshToken = tokenUtilts.getRefreshToken({
        userId: userData.userId,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        status: userData.status,
        isDeleted: userData.isDeleted,
        emailVerified: userData.emailVerified
    })

    const updadteSessionToken = await prisma.session.update({
        where:{
            token: sessionToken,
        },data:{
            token: sessionToken,
            expiresAt: new Date( Date.now() + 1*24*60*60*1000 ),
            updatedAt: new Date()
        }
    })
    
    const {token} = updadteSessionToken

    return {
        accessToken: NewaccessToken,
        refreshToken: NewrefreshToken,
        sessionToken: token
    }
}




const chnagePassword = async(oldPassword:string , newPassword:string , sessionToken:string)=>{
    const sessions = await auth.api.getSession({
        headers: new Headers({Authorization: `Bearer ${sessionToken}`})
    })
    if(!sessions){
        throw new AppError(status.UNAUTHORIZED, "Invalid session token provided!");
    }

    const result = await auth.api.changePassword({
        body:{
            currentPassword: oldPassword,
            newPassword: newPassword,
            revokeOtherSessions: true
        },
        headers: new Headers({Authorization: `Bearer ${sessionToken}`})
    })
    console.log(sessions)
    const accessToken = tokenUtilts.getAccessToken({
        userId: sessions.user.id,
        email: sessions.user.email,
        name: sessions.user.name,
        role: sessions.user.role,
        status: sessions.user.status,
        isDeleted: sessions.user.isDeleted,
        emailVerified: sessions.user.emailVerified

    })

    const refreshToken = tokenUtilts.getRefreshToken({
        userId: sessions.user.id,
        email: sessions.user.email,
        name: sessions.user.name,
        role: sessions.user.role,
        status: sessions.user.status,
        isDeleted: sessions.user.isDeleted,
        emailVerified: sessions.user.emailVerified
    })
    return {
        ...result,
        accessToken,
        refreshToken

    };
}



const userLogout = async(sessionToken:string) =>{
    const logoutResult = await auth.api.signOut({
        headers: new Headers({Authorization: `Bearer ${sessionToken}`})
    })
    return logoutResult
}


const emailVerify = async(email:string , otp:string)=>{
    const isOtpValid = await auth.api.verifyEmailOTP({
        body:{
            email,
            otp
        }
    })

    if(isOtpValid.status && !isOtpValid.user.emailVerified ){
            await prisma.user.update({
                where:{
                    email: email
                },
                data:{
                    emailVerified: true
                }
            })
    }
}


const forgetPassword = async(email:string)=>{
    const isExistsUser = await prisma.user.findUnique({
            where:{
              email: email
            }
          })
    if(!isExistsUser){
        throw new AppError(status.NOT_FOUND, "User is not available");
    }

    if(!isExistsUser.emailVerified) throw new AppError(status.BAD_REQUEST, "Email is not verified!");

    if(isExistsUser.isDeleted || isExistsUser.status === UserStatus.DELETED){
        throw new AppError(status.NOT_FOUND, "User not found!");
    }

    await auth.api.requestPasswordResetEmailOTP({
        body:{
            email: email
        }
    })
}


const resetPassword = async(userMail:string , otp:string , newPass:string)=>{
    const isExistsUser = await prisma.user.findUnique({
            where:{
              email: userMail
            }
          })
    if(!isExistsUser){
        throw new AppError(status.NOT_FOUND, "User is not available");
    }

    if(!isExistsUser.emailVerified) throw new AppError(status.BAD_REQUEST, "Email is not verified!");

    if(isExistsUser.isDeleted || isExistsUser.status === UserStatus.DELETED){
        throw new AppError(status.NOT_FOUND, "User not found!");
    }


    await auth.api.resetPasswordEmailOTP({
        body:{
            email: userMail,
            otp,
            password: newPass
        }
    })
    await prisma.session.deleteMany({
        where:{
            userId: isExistsUser.id
        }
    })
}


const googleLoginSuccess = async(UserSession: any)=>{
    const isPaitentExists = await prisma.paitent.findUnique({
        where:{
            userId: UserSession.user.id
        }
    })

    if(!isPaitentExists){
        await prisma.paitent.create({
            data:{
                userId: UserSession.user.id,
                name: UserSession.user.name,
                email: UserSession.user.email
            }
        })
    }

    const accessToken = tokenUtilts.getAccessToken({
        userId: UserSession.user.id,
        name: UserSession.user.name,
        role: UserSession.user.role,

    })

    const refreshToken = tokenUtilts.getRefreshToken({
        userId: UserSession.user.id,
        name: UserSession.user.name,
        role: UserSession.user.role,
    })
    return {
        accessToken,
        refreshToken,
    }
}

export const authService = {
    registerPaitent,
    loginUser,
    getNewToken,
    chnagePassword,
    userLogout,
    emailVerify,
    forgetPassword,
    resetPassword,
    googleLoginSuccess
}