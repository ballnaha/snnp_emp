import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) return null

                try {
                    const user = await prisma.user.findUnique({
                        where: { username: credentials.username as string }
                    })

                    if (!user || user.status !== "active") return null

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password as string,
                        user.password
                    )

                    if (!isPasswordValid) return null

                    return {
                        id: user.id,
                        name: user.name,
                        username: user.username,
                        role: user.role
                    }
                } catch (error) {
                    console.error("Auth error:", error)
                    return null
                }
            }
        }),
    ],
})
