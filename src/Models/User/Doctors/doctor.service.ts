import { prisma } from "../../../lib/prisma"

const getAllDoctors = async () => {
   return await prisma.doctor.findMany({
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


export const doctorService = {
    getAllDoctors
}