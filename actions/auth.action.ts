"use server"
import prisma from "@/db"
import { SALT_ROUNDS } from "@/lib/constants";
import bcrypt from 'bcrypt'

const ifUserExists = async (email: string) => {
    const response = await prisma.tf_users.find_first({
        where: {
            email: email,
        }
    });
    return response;
}

export const signup = async (signupFormData: any) => {
    const { email, password, } = signupFormData;
    const isUserExist = await ifUserExists(email);
    if (isUserExist) {
        return null;
    }
    const hashedPassword = bcrypt.hash(password, SALT_ROUNDS)
    const response = await prisma.tf_users.create({
        email: email,
        password: hashedPassword
    });
    return response;
}

export const signin = async (signinFormData: any) => {
    try {
        const { email, password } = signinFormData;
        const response = await prisma.tf_users.find_first({
            where: {
                email: email
            }
        });
        bcrypt.compare(password, response?.password, function (err, result) {
            if(result==false){
                return null;
            }
            return true;
        });
    } catch (error) {
        console.error("Error in signin service", error);
    }
}