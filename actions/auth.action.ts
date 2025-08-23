"use server"
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
    const isUserExist = await ifUserExists(email);
    if (isUserExist) {
        return;
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    const response = await prisma.user.create({
        data:{
            user_email: email,
            user_password: hashedPassword,
            user_name: name
        } 
        
    });
    return response;
}

export const signin = async (formData: FormData): Promise<any> => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    console.log(email,password,'on server')

    try {
        const user = await prisma.user.findFirst({
            where: { user_email: email },
        });

        if (!user) {
            console.log('User not found');
            return;
        }

        const match = await bcrypt.compare(password, user.user_password);
        if (!match) {
            console.log('Incorrect password');
            return;
        }

        // Authentication success
        console.log('Login success:', user.user_id);

        // You could set cookies or session here (not via return)
        // But you should NOT return a value here if used with <form action={signin}>
    } catch (error) {
        console.error('Error during signin:', error);
    }
};