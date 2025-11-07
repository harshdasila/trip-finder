import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/db"
import bcrypt from 'bcrypt'
import { getUserDetails } from "@/actions/auth.action";

export const NEXT_AUTH: any = {
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                username: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const user = await prisma.user.findFirst({
                        where: { user_email: credentials.email }
                    });

                    if (!user || !user.user_password) {
                        return null; // User not found or no password set
                    }

                    const match = await bcrypt.compare(credentials.password, user.user_password);
                    if (!match) {
                        return null; // Invalid password
                    }


                    // Return user object that will be stored in JWT/session
                    return {
                        id: user.user_id.toString(),
                        email: user.user_email,
                        name: user.user_name,
                        image: user.user_image,
                    };
                } catch (error) {
                    console.error('Error during authentication:', error);
                    return null;
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async signIn({ user, account, profile }: any) {
            console.log(account, 'account on top');
            console.log(user, 'user on top')
            console.log(profile, 'profile on top')
            if (account?.provider === 'google') {
                try {
                    const existingUser = await prisma.user.findUnique({
                        where: { user_google_id: profile.sub }
                    });
                    if (!existingUser) {
                        const newUser = await prisma.user.create({
                            data: {
                                user_google_id: profile.sub,
                                user_email: profile.email,
                                user_name: profile.name,
                                user_image: profile.picture,
                            }
                        });
                        user.dbId = newUser.user_id;
                    }
                    else {
                        await prisma.user.update({
                            where: {
                                user_google_id: profile?.sub
                            },
                            data: {
                                user_name: profile?.name,
                                user_image: profile?.picture,
                            }
                        });
                        user.dbId = existingUser.user_id;
                    }
                    return true;
                } catch (error) {
                    console.error("Error in logging through google", error);
                    return false;
                }

            }
            return true;
        },
        jwt: async ({ user, token }: any) => {
            if (user) {
                if (user.dbId) {
                    // Google OAuth - use dbId we set in signIn callback
                    token.userId = user.dbId;
                } else if (user.id) {
                    // Credentials login - user.id is already the database ID
                    token.userId = user.id;
                }
            }

            if (token) {
                const user: any = await getUserDetails(token?.userId);
                token.gender = user?.gender;
            }
            return token;
        },
        session: ({ session, token, user }: any) => {
            if (session.user) {
                session.user.id = token.userId
                session.user.gender = token.gender
            }
            return session
        }
    },
    pages: {
        signIn: "/login",
    },
}