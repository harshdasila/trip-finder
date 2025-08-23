import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const NEXT_AUTH = {
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                username: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("Credentials received:", credentials);

                if (
                    credentials?.username === "admin@example.com" &&
                    credentials?.password === "password"
                ) {
                    return {
                        id: "user1",
                        name: "Admin User",
                        email: credentials.username,
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
    // callbacks: {
    //     session: ({session, token, user}: any) => {
    //         console.log(session,'session');
    //     }
    // }
    //   session: {
    //     strategy: "jwt",
    //   },
      pages: {
        signIn: "/auth/signin", // Optional custom page
        signUp: "/auth/signup"
      },
}