"use server"
import { signIn } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/db"
import { SALT_ROUNDS } from "@/lib/constants";
import bcrypt from 'bcrypt'

const ifUserExists = async (email: string) => {
    const response = await prisma.user.findFirst({
        where: {
            user_email: email,
        }
    });
    return response;
}

export const signup = async (formData: FormData): Promise<any> => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
    // const profileImageUrl = formData?.get('profileImageUrl') as string;
    const isUserExist = await ifUserExists(email);
    if (isUserExist) {
        return {
            message: "Email already exists. Try logging in with the email."
        }
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    const response = await prisma.user.create({
        data: {
            user_email: email,
            user_password: hashedPassword,
            user_name: name,
            // user_image: profileImageUrl ?? null
        }

    });
    return response;
}

export const signin = async (formData: FormData): Promise<any> => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false, // Handle redirect manually for better error handling
        });
        if (result?.error) {
            return {
                success: false,
                message: "Invalid email/password."
            };
        }

        return {
            success: true,
            message: "Login successful"
        };
    } catch (error) {
        console.error('Error during signin:', error);
    }
};