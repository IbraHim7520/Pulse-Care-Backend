import { Speciality } from "../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

const getAllSpecality = async()=>{
    return await prisma.speciality.findMany()
}

const createSpecality = async(payload: Speciality) : Promise<Speciality>=>{
        return await prisma.speciality.create({
            data: payload
        })
}

const deleteSpecality = async(specialityId:string)=>{
    return await prisma.speciality.delete({
        where: {
            id: specialityId
        }
    })
}


const updateSpeciality = async(payload: Speciality, specialityId:string):Promise<Speciality>=>{
    return await prisma.speciality.update({
        where:{
            id: specialityId,
        },
        data: payload
    })
}



export const specalityService = {
    getAllSpecality,
    createSpecality,
    deleteSpecality,
    updateSpeciality
}