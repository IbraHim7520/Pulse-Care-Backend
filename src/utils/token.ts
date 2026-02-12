import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import env from "../configs/env";
import { Response } from "express";
import { cookieUtils } from "./cookie";
import ms, { StringValue } from "ms";

const getAccessToken = (payload: JwtPayload)=>{
    const token = jwtUtils.createToken(payload ,env.ACCESS_TOKEN_SECRET , {expiresIn: env.ACCESS_TOKEN_EXPIRES_IN} as SignOptions)
    return token
}


const getRefreshToken = (payload: JwtPayload)=>{
    const refreshToken = jwtUtils.createToken(payload , env.REFRESH_TOKEN_SECRET, {expiresIn: env.REFRESH_TOKEN_EXPIRES_IN} as SignOptions)
    return refreshToken
}


const setAccessTokenCookie = (res:Response , token:string )=>{
    const key: string = "accessToken"
    const accessTokenValidity = env.ACCESS_TOKEN_EXPIRES_IN;

    cookieUtils.setCookie(res , key , token , {
        httpOnly:true,
        secure:true,
        sameSite: 'strict',
        path: "/",
        maxAge: Number(ms(accessTokenValidity as StringValue))/1000
    } )
}


const setRefreshTokenCookie = (res:Response , token:string )=>{
    const key: string = "refreshToken"
    const refreshTokenValidity = env.REFRESH_TOKEN_EXPIRES_IN;

    cookieUtils.setCookie(res , key , token , {
        httpOnly:true,
        secure:true,
        sameSite: 'strict',
        path: "/",
        maxAge: Number(ms(refreshTokenValidity as StringValue))/1000
    } )
}



const setBetterAuthSessionCookie = (res:Response , token:string )=>{
    const key: string = "better-auth.session_token"
    const sessionTokenValidity = env.BETTER_AUTH_SESSION_EXPIRES_IN;

    cookieUtils.setCookie(res , key , token , {
        httpOnly:true,
        secure:true,
        sameSite: 'strict',
        path: "/",
        maxAge: Number(ms(sessionTokenValidity as StringValue))/1000
    } )
}


export const tokenUtilts = {
    getAccessToken,
    getRefreshToken,
    setAccessTokenCookie,
    setRefreshTokenCookie,
    setBetterAuthSessionCookie
}