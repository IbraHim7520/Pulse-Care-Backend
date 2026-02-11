import { NextFunction, Request, Response } from "express";
import env from "../configs/env";
import status from "http-status";
import z from "zod";

interface IValidationError {
    field: string;
    message: string;
}

export const globalErrorHandler = (err:any, req:Request, res:Response, next:NextFunction) => {
if(env.NODE_ENV === 'development'){
    console.error(err);
}
let validationErrors:IValidationError[]  = []
if(err instanceof z.ZodError){
    err.issues.forEach((err)=>{
        validationErrors.push({
            field: err.path.join('->'),
            message: err.message
        })
    })

    
    res.status(status.BAD_REQUEST).send({
        success:false, 
        message: 'Validation Error', 
        error: validationErrors
    })
}

let statusCode:number = status.INTERNAL_SERVER_ERROR;
let message:string = 'An unexpected error occurred!';
    res.status(statusCode).send({
        success:false, 
        message, 
        error: err.message 
    });



}