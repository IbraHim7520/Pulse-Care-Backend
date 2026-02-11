import { email } from "better-auth"
import { Speciality } from "../../generated/prisma/client"
import { Gender, Role } from "../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"
import { auth } from "../../lib/auth"

interface ICreateDoctor {
    password: string,
    doctror: {
        name: string,
        email: string,
        profilePhoto?: string,
        contactNumber?: string,
        address?: string,
        registrationNumber: string,
        experience?: number
        gender: Gender
        appointmentFee: number,
        qualification: string,
        currentWorkingPlace: string,
        designation: string
    }
    specalities: string[]
}

const createDoctor = async (data: ICreateDoctor) => {
    const specalities: Speciality[] = [];
    for (const specialityId of data.specalities) {
        const speciality = await prisma.speciality.findUnique({
            where: {
                id: specialityId
            }
        })
        if (!speciality) {
            throw new Error(`Speciality with id ${specialityId} not found`)
        }
        specalities.push(speciality)
    }

    const isUserExist = await prisma.user.findUnique({
        where: {
            email: data.doctror.email
        }
    })
    if (isUserExist) {
        throw new Error(`User with email ${data.doctror.email} already exists!!`)
    }

    const userData = {
        email: data.doctror.email,
        password: data.password,
        role: Role.DOCTOR,
        name: data.doctror.name,
        needPasswordChange: true
    }
    const Doctoruser = await auth.api.signUpEmail({
        body: userData
    })

    try {
        const result = await prisma.$transaction(async (tx) => {
            const newDoctor = await tx.doctor.create({
                data: {
                    userId: Doctoruser.user.id,
                    ...data.doctror
                }
            })
            const doctorSpecialities = specalities.map((sp) => {
                return {
                    doctorId: newDoctor.id,
                    specialityId: sp.id
                }
            })

            await tx.doctorSpeciality.createMany({
                data: doctorSpecialities
            })

            const doctor = await tx.doctor.findUnique({
                where: {
                    id: newDoctor.id,
                },
                select: {
                    id: true,
                    userId: true,
                    name: true,
                    email: true,
                    profilePhoto: true,
                    contactNumber: true,
                    address: true,
                    registrationNumber: true,
                    experience: true,
                    appointmentFee: true,
                    qualification: true,
                    currentWorkingPlace: true,
                    designation: true,
                    createdAt: true,
                    updatedAt: true,
                    user: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                            role: true,
                            image: true,
                            status: true,
                            emailVerified: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    },
                    specialities: {
                        select: {
                            speciality: {
                                select: {
                                    title: true,
                                    id: true
                                }
                            }
                        }
                    }
                }
            })

            return doctor;

        })
        return result;
    } catch (error) {
        console.log("Transaction failed, rolling back changes", error);
        await prisma.user.delete({
            where: {
                id: Doctoruser.user.id
            }
        })
    }
}

export const UserService = {
    createDoctor
}