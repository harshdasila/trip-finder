"use server"

import prisma from "@/db";

export const updateUserGenderAction = async(selectedGender: any, userID: any) => {
    const response = await prisma.user.update({
        where:{
            user_id: userID
        },
        data:{
            gender: selectedGender
        }
    });
    return response?.user_id;
}