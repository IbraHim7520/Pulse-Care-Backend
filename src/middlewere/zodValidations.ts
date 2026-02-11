import { defaultAc } from "better-auth/plugins/organization/access";
import { NextFunction, Request, Response } from "express";
import z from "zod";

const zodVlidations = (zodSchema: z.ZodObject)=>{
    return(req:Request , res:Response, next:NextFunction)=>{
        const validationResult = zodSchema.safeParse(req.body);
        if(!validationResult.success){
            next(validationResult.error)
        }
        req.body = validationResult.data;
        next();
    }
}

export default zodVlidations;