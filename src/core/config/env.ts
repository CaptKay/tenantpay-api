import dotenv from "dotenv";
dotenv.config();


const required = (value: string | undefined, name: string): string => {
    if(!value){
        throw new Error(`Missing required env variable: ${name}`)
    }
    return value;
}


export const env = {
    PORT: process.env.PORT || "4000",
    JWT_SECRET: required(process.env.JWT_SECRET, "JWT_SECRET"),
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
    
} as const