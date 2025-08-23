import { z } from "zod"

export const siginSchema = z.object({
    email: z.email("Invalid email address").min(1, "Email is required."),
    password: z.string().min(1, "Password is required.")
})

export const signupSchema = z.object({
    name: z.string().min(1, "Name is required."),
    email: z.email("Invalid email address.").min(1, "Email is required"),
    password: z
        .string()
        .min(1, "Please enter your Password.")
        .min(8, "Password must be at least 8 characters long.")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[a-zA-Z\d!@#$%^&*()_+]+$/,
            "Password must contain at least 1 lowercase letter, 1 uppercase letter, and 1 special character."
        ),
    cnfPassword: z.string().min(1, "Please confirm your Password."),
})
    .refine((data: any) => data.password === data.cnfPassword, {
        message: "Passwords do not match.",
        path: ["cnfPassword"],
    });