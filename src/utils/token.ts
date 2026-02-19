import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import env from "../configs/env";
import { Response } from "express";
import { cookieUtils } from "./cookie";

const getAccessToken = (payload: JwtPayload)=>{
    const token = jwtUtils.createToken(payload ,env.ACCESS_TOKEN_SECRET , {expiresIn: "1d"} as SignOptions)
    return token
}


const getRefreshToken = (payload: JwtPayload)=>{
    const refreshToken = jwtUtils.createToken(payload , env.REFRESH_TOKEN_SECRET, {expiresIn: "7d"} as SignOptions)
    return refreshToken
}


const setAccessTokenCookie = (res:Response , token:string )=>{
    const key: string = "accessToken"

    cookieUtils.setCookie(res , key , token , {
        httpOnly:true,
        secure:true,
        sameSite: 'strict',
        path: "/",
        maxAge: 1 * 24 * 60 * 60 * 1000
    } )
}


const setRefreshTokenCookie = (res:Response , token:string )=>{
    const key: string = "refreshToken"

    cookieUtils.setCookie(res , key , token , {
        httpOnly:true,
        secure:true,
        sameSite: 'strict',
        path: "/",
        maxAge: 7 * 24 * 60 * 60 *1000
    } )
}



const setBetterAuthSessionCookie = (res:Response , token:string )=>{
    const key: string = "better-auth.session_token"

    cookieUtils.setCookie(res , key , token , {
        httpOnly:true,
        secure:true,
        sameSite: 'strict',
        path: "/",
        maxAge: 3*24*60*60*1000
    } )
}


const clearCookies = (res:Response , tokenName:string)=>{
    cookieUtils.clearCookie(res , tokenName , {
        httpOnly:true,
        secure:true,
        sameSite: 'none'
    })
}

export const tokenUtilts = {
    getAccessToken,
    getRefreshToken,
    setAccessTokenCookie,
    setRefreshTokenCookie,
    setBetterAuthSessionCookie,
    clearCookies
}