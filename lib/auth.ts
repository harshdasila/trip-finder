import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/db"

export const NEXT_AUTH: any = {
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                username: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any) {
                console.log("Credentials received:", credentials);
                // const email = typeof credentials?.email === "string" ? credentials.email : "";

                const user = await prisma.user.findFirst({
                    where: {
                        user_email: credentials?.email
                    }
                });
                console.log(user,'this is user')
                if (user) {
                    return {
                        id: user.user_id.toString(),
                        email: user?.user_email,
                        name: user?.user_name,
                        image: user?.user_image,
                    };
                }
                return null;
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
            if (account?.provider === 'google') {
                try {
                    const existingUser = await prisma.user.findUnique({
                        where: { user_google_id: profile.sub }
                    });
                    if (!existingUser) {
                        await prisma.user.create({
                            data: {
                                user_google_id: profile.sub,
                                user_email: profile.email,
                                user_name: profile.name,
                                user_image: profile.picture,
                            }
                        });
                    }
                } catch (error) {
                    console.error("Error in logginf through google", error);
                    return false;
                }

            }
            return true;
        },
        jwt: async ({ user, token }: any) => {
            return token;
        },
        session: ({ session, token, user }: any) => {
            if (session.user) {
                session.user.id = token.sub
            }
            return session
        }
    },
    pages: {
        signIn: "/login",
    },
}