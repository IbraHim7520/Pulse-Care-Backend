import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Role, UserStatus } from "../generated/prisma/enums";
import ms, { StringValue } from "ms";
import env from "../configs/env";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword:{
    enabled:true
  },
  session: {
  expiresIn: ms(env.BETTER_AUTH_SESSION_EXPIRES_IN as StringValue)/1000,
  updateAge: ms(env.BETTER_AUTH_SESSION_UPDATE_AGE as StringValue)/1000
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