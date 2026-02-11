import { Gender } from "../../../generated/prisma/enums"
import { prisma } from "../../../lib/prisma"

interface UpdateDoctorInfoData {

            name?: string,
            email?: string,
            profilePhoto?: string,
            contactNumber?: string,
            address?: string,
            registrationNumber?: string,
            experience?: number
            gender?: Gender
            appointmentFee?: number,
            qualification?: string,
            currentWorkingPlace?: string,
            designation?: string
        
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
    return await prisma.doctor.update({
        where:{
            id: doctorId
        },
        data:{
            isDeleted: true
        }
    })
}


const updateDoctor = async(doctorId:string, updateData:UpdateDoctorInfoData)=>{
        return await prisma.doctor.update({
            where:{
                id: doctorId
            },
            data:updateData
        })
}

export const doctorService = {
    getAllDoctors,
    getOneDoctor,
    deleteDoctor,
    updateDoctor
}