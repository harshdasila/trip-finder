import { NEXT_AUTH } from "@/lib/auth";
import NextAuth from "next-auth";

const { handlers } = NextAuth(NEXT_AUTH);

export const { GET, POST } = handlers;