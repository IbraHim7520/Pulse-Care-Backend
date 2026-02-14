import status from "http-status"
import { Gender, UserStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../../lib/prisma"
import AppError from "../../../shared/AppError"

interface updateDoctorSpecalitiyPayload  {
    specalityId :string,
    shouldDelete?: boolean
}
interface UpdateDoctorInfoData {

            name?: string,
            profilePhoto?: string,
            contactNumber?: string,
            address?: string,
            registrationNumber?: string,
            experience?: number
            gender?: Gender
            appointmentFee?: number,
            qualification?: string,
            currentWorkingPlace?: string,
            designation?: string,
            specalities?: updateDoctorSpecalitiyPayload[]
        
}

const getAllDoctors = async () => {
   return await prisma.doctor.findMany({
    where:{
        isDeleted: false
    },
        include:{
            user:true,
            specialities: {
                select: {
                    speciality: {
                        select:{
                            id:true,
                            title:true,
                            description:true,
                            icon:true,
                            isDeleted:true
                        }
                    }
                }
            }
        }
    })
}



const getOneDoctor = async(doctorId:string)=>{
    return await prisma.doctor.findUnique({
        where:{
            id: doctorId,
            isDeleted: false,  
        },
        include:{
            specialities:{
                select:{
                    speciality:{
                        
                        select:{
                            id:true,
                            title:true,
                            description:true,
                            icon:true,
                            isDeleted:true
                        }
                    }
                }
            }
        }
    })
}

const deleteDoctor = async(doctorId:string)=>{
    const isDoctorExist = await prisma.doctor.findUnique({where: {id: doctorId} , include: {user: true}});
    if(!isDoctorExist){
        throw new AppError(status.NOT_FOUND , "Doctor is not exists!!");
    }


    await prisma.$transaction(async (tx) => {
        await tx.doctor.update({
            where: { id: doctorId },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
            },
        })

        await tx.user.update({
            where: { id: isDoctorExist.userId },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                status: UserStatus.DELETED 
            },
        })

        await tx.session.deleteMany({
            where: { userId: isDoctorExist.userId }
        })

        await tx.doctorSpeciality.deleteMany({
            where: { doctorId: doctorId }
        })
    })

    return {message: "Doctor Deleted successfully!"}


}


const updateDoctor = async(doctorId:string, updateData:UpdateDoctorInfoData)=>{
    const isDoctorExist = await prisma.doctor.findUnique({where: {id: doctorId}});
    if(!isDoctorExist){
        throw new AppError(status.NOT_FOUND , "Doctor is not exists!!");
    }   
    const {specalities} = updateData;
    await prisma.$transaction(async(tx)=>{
        if(updateData){
            await tx.doctor.update({
                where: {
                    id: doctorId
                },
                data:{
                    ...updateData
                }
            })
        }

        if(specalities && specalities.length > 0){
            for(const specality of specalities){
                const {specalityId , shouldDelete} = specality;
                if(shouldDelete){
                    await tx.doctorSpeciality.delete({
                        where:{
                            doctorId_specialityId: {
                                doctorId: doctorId,
                                specialityId: specalityId
                            }
                        }
                    })
                }else{
                    await tx.doctorSpeciality.upsert({
                        where:{
                            doctorId_specialityId:{
                                doctorId,
                                specialityId: specalityId
                            }
                        },create:{
                            doctorId,
                            specialityId: specalityId,
                        },
                        update: {}
                    })
                }
            }
        }
    })

    const doctor = await getOneDoctor(doctorId);
    return doctor
}

export const doctorService = {
    getAllDoctors,
    getOneDoctor,
    deleteDoctor,
    updateDoctor
}