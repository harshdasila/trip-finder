import { NEXT_AUTH } from "@/lib/auth";
import NextAuth from "next-auth";

export const { handlers , auth, signIn, signOut} = NextAuth(NEXT_AUTH);

export const { GET, POST } = handlers;