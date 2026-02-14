import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { adminService } from "./admin.service";
import status from "http-status";
import { IRequestUser } from "../../../Interfaces/userReq.interface";

const createAdminController = catchAsync(async(req:Request , res:Response)=>{
    const adminData = req.body;
    const adminCreationResponse = await adminService.createAdmin(adminData);
    res.status(status.CREATED).send({
        success : true,
        message: "Admin Created Successfully!!",
        data: adminCreationResponse
    })
})


const getAllAdminsController = catchAsync(async(req:Request , res:Response)=>{
    const reult = await adminService.getAllAdmins();
    res.status(status.OK).send({
        success: true,
        message: "Admin retrived successfully!",
        data : reult
    })

})

const updateAdminController = catchAsync(async(req:Request, res:Response)=>{
    const adminId = req.params.adminId as string
    const adminData = req.body; 
    const reult = await adminService.updateAdmin(adminId  , adminData);
    res.status(status.OK).send({
        success: true,
        message: "Admin retrived successfully!",
        data : reult
    })
})

const getOneAdminController = catchAsync(async(req:Request , res:Response)=>{
    const adminId = req.params.adminId as string
    const reult = await adminService.getOneAdmin(adminId);
    res.status(status.OK).send({
        success: true,
        message: "Admin retrived successfully!",
        data : reult
    })
})

const deleteAdminController = catchAsync(async(req:Request , res:Response)=>{
    const adminId = req.params.adminId as string
    const user = req.user as IRequestUser
    const reult = await adminService.deleteAdmin(adminId , user);
    res.status(status.OK).send({
        success: true,
        message: "Admin retrived successfully!",
        data : reult
    })
})
export const adminController = {
    createAdminController,
    getAllAdminsController,
    updateAdminController,
    getOneAdminController,
    deleteAdminController
}