import { email } from "better-auth";
import { auth } from "../../lib/auth";
import { UserStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

interface IRegisterPaitent {
    name: string,
    email: string,
    password: string
}

const registerPaitent = async (payload: IRegisterPaitent) => {
    const { name, email, password } = payload;
    const newUser = await auth.api.signUpEmail({
            body: {
                name,
                email,
                password,
            }
        })
    if (!newUser.user) {
        throw new Error("Failed to register paitent!")
    }
    try {
        //* If user created then create a new paitent profile for the user
        const paintentProfileData = {
            userId: newUser.user.id,
            name: payload.name,
            email: payload.email
        }
        const paintent = await prisma.$transaction(async (tx) => {
            const newPaitent = await tx.paitent.create({
                data: paintentProfileData
            })
            return newPaitent;
        })
        return {
            ...newUser,
            paitentProfile: paintent
        };
    } catch (error) {
        await prisma.user.delete({
            where:{
                id: newUser.user.id
            }
        })
        return error
    }
}


interface ILoggedInUser {
    email: string,
    password: string
}
const loginUser = async (payload: ILoggedInUser) => {
    const { email, password } = payload
    const loggedIn = await auth.api.signInEmail({
        body: {
            email,
            password
        }
    })

    if (loggedIn.user.status === UserStatus.BLOCKED) {
        throw new Error("User is Blocked!")
    }

    if (loggedIn.user.isDeleted) {
        throw new Error("User is not exists")
    }

    return loggedIn
}


export const authService = {
    registerPaitent,
    loginUser
}