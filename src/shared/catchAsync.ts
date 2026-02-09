import { NextFunction, Request, RequestHandler, Response } from "express";

const catchAsync = (fn : RequestHandler) =>{
    return async(req:Request , res:Response , next:NextFunction)=>{
        try {
            await fn(req , res , next)
        } catch (error) {
            console.log(error )
            return res.status(500).send({
                success : false,
                message : "Failed!!",
                error
            })
        }
    }
}

export default catchAsync;