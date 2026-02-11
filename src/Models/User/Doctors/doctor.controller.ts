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



const getOneDoctor = catchAsync(async(req:Request , res:Response)=>{
    const docId = req.params.doctorId as string;
    const doctor = await doctorService.getOneDoctor(docId);
    res.status(200).send({
        success: true,
        message: "Doctor Found successfully",
        data: doctor
    })
})

const deleteDoctor = catchAsync(async(req:Request , res:Response)=>{
    const docId = req.params.doctorId as string;
    const deletedResult = await doctorService.deleteDoctor(docId);
    res.status(200).send({
        success: true,
        message: "Doctor Deleted successfully",
        data: deletedResult
    })
})

const updateDoctor =catchAsync(async(req:Request , res:Response)=>{
    const docId = req.params.doctorId as string;
    const updateData = req.body;
    const updatedDoctorResult = await doctorService.updateDoctor(docId, updateData);
    res.status(200).send({
        success: true,
        message: "Doctor Updated successfully",
        data: updatedDoctorResult
    })
})

export const doctorController = {
    getAllDoctors,
    getOneDoctor,
    deleteDoctor,
    updateDoctor
}