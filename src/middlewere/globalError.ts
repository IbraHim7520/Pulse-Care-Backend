import { NextFunction, Request, Response } from "express";
import env from "../configs/env";
import status from "http-status";

export const globalErrorHandler = (err:any, req:Request, res:Response, next:NextFunction) => {
if(env.NODE_ENV === 'development'){
    console.error(err);
}

let statusCode:number = status.INTERNAL_SERVER_ERROR;
let message:string = 'An unexpected error occurred!';
    res.status(statusCode).send({success:false, message, error: err.message });
}