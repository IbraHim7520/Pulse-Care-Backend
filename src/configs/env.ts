import dotenv from 'dotenv'

dotenv.config()

interface EnvConfig {
    NODE_ENV: string
    PORT: string
    DATABASE_URL: string
    BETTER_AUTH_SECRET: string
    BETTER_AUTH_URL: string,
    ACCESS_TOKEN_SECRET:string,
    REFRESH_TOKEN_SECRET:string,

}

const env: EnvConfig = {
    NODE_ENV: process.env.NODE_ENV as string,
    PORT: process.env.PORT as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,

    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
    REFRESH_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET as string
}

export default env