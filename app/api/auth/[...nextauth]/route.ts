import { NEXT_AUTH } from "@/lib/auth";
import NextAuth from "next-auth";


const authConfig = NextAuth(NEXT_AUTH);

export const { handlers, auth, signIn, signOut } = (authConfig);

export const { GET, POST } = handlers;
