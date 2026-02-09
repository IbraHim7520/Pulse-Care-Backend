import { email } from "better-auth";
import { auth } from "../../lib/auth";
import { UserStatus } from "../../generated/prisma/enums";

interface IRegisterPaitent {
    name: string,
    email: string,
    password: string
}

const registerPaitent = async(payload: IRegisterPaitent) =>{
    const {name , email , password} = payload;

    const newUser = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
        }
    })

    if(!newUser.user){
        throw new Error("Failed to register paitent!")
    }
    return newUser;
}


interface ILoggedInUser {
    email : string,
    password: string
}
const loginUser = async(payload: ILoggedInUser) =>{
    const {email , password} = payload
    const loggedIn = await auth.api.signInEmail({
        body: {
            email,
            password
        }
    })

    if(loggedIn.user.status === UserStatus.BLOCKED){
        throw new Error("User is Blocked!")
    }

    if(loggedIn.user.isDeleted){
        throw new Error("User is not exists")
    }

    return loggedIn
}


export const authService = {
    registerPaitent,
    loginUser
}