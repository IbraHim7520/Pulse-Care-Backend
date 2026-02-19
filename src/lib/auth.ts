import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../generated/prisma/enums";
import { bearer, emailOTP } from "better-auth/plugins";
import { sendEmail } from "../utils/sendEmail";
import AppError from "../shared/AppError";
import status from "http-status";
import env from "../configs/env";


export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword:{
    enabled:true,
    requireEmailVerification: true
  },
  emailVerification:{
    sendOnSignUp:true,
    sendOnSignIn:true,
    autoSignInAfterVerification:true
  },
  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({email , otp , type}) {
        if(type === 'email-verification'){
          const userData = await prisma.user.findUnique({
            where: {
              email: email
            }
          })
          if(!userData){
            throw new AppError(status.NOT_FOUND , `User with ${email} no found!`);
          }
          if(userData && !userData.emailVerified){
            sendEmail({
              to: email,
              subject: "Verify Your Email.",
              templateName: "otp",
              templateData: {
                name: userData.name,
                otp: otp
              }
            })
          }
        }else if(type === 'forget-password'){
          const isExistsUser = await prisma.user.findUnique({
            where:{
              email: email
            }
          })
          if(isExistsUser){
            sendEmail({
              to: email,
              subject: "Password reset OTP",
              templateName: "otp",
              templateData: {
                name:  isExistsUser.name,
                otp
              }
            })
          }
        }
      },
      expiresIn: 2*60,
        otpLength: 6,
    })
  ],
  advanced:{
    useSecureCookies: true,
    cookies:{
      state:{
        attributes:{
          sameSite: "none",
          secure:true,
          httpOnly:true,
          path: "/"
        }
      },
      sessionToken:{
        attributes:{
          sameSite: "none",
          secure:true,
          httpOnly:true,
          path: "/"
        }
      }
    }
  },
  socialProviders:{
    google:{
      clientId: env.G_CLIENT_ID,
      clientSecret: env.G_CLIENT_SECRET,
      
      mapProfileToUser : ()=>{
        return{
          role: Role.PAITENT,
          status: UserStatus.ACTIVE,
          needPasswordChange: false,
          emailVerified: true,
          deletedAt: null
        }
      }
    }
  },
  redirectURLs : {
      signIn: `${env.BETTER_AUTH_URL}/api/v1/auth/google/success`
  },
  user: {
    additionalFields: {
      role: {
        type:"string",
        required: true,
        defaultValue: Role.PAITENT
      },
      status: {
        type: "string",
        required:true,
        defaultValue: UserStatus.ACTIVE
      },
      needPasswordChange: {
        type: "boolean",
        required:true,
        defaultValue: false
      },
      isDeleted: {
        type: "boolean",
        required:true , 
        defaultValue: false
      },
      deletedAt: {
        type: "date",
        required:false,
        defaultValue: null
      }
    }
  }
});