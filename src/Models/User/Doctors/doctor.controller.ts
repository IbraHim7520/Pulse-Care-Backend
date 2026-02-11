import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { doctorService } from "./doctor.service";

const getAllDoctors = catchAsync(async(req:Request , res:Response)=>{
    const doctors = await doctorService.getAllDoctors();
    res.status(200).send({
        success: true,
        message: "Doctors retrieved successfully",
        data: doctors
    })
})

export const doctorController = {
    getAllDoctors
}