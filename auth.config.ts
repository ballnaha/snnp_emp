import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.role = user.role;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session.user && token) {
                session.user.role = token.role;
                session.user.username = token.username;
            }
            return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');
            const isOnRoot = nextUrl.pathname === '/';

            if (isOnAdmin || isOnRoot) {
                if (isLoggedIn) return true;
                return false;
            }
            return true;
        },
    },
    providers: [],
} satisfies NextAuthConfig
