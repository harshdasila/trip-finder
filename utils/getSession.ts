import { auth } from "@/app/api/auth/[...nextauth]/route"

export const getSession = async() => {
    const session = await auth();
    return session;
}