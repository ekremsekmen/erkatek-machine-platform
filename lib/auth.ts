import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { loginSchema } from "@/lib/validations/auth"
import type { Role } from "@prisma/client"

/**
 * NextAuth.js v5 (Auth.js) configuration.
 * Uses Credentials provider with email/password authentication.
 */
export const { handlers, auth, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "E-posta", type: "email" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined
        const password = credentials?.password as string | undefined

        if (!email || !password) {
          return null
        }

        const parsed = loginSchema.safeParse({ email, password })

        if (!parsed.success) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          parsed.data.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role: Role }).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
      }
      return session
    },
    async authorized({ auth: session, request }) {
      const isLoggedIn = !!session?.user
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
      const isLoginPage = request.nextUrl.pathname === "/admin/giris"

      if (isAdminRoute && !isLoginPage && !isLoggedIn) {
        return Response.redirect(new URL("/admin/giris", request.nextUrl))
      }

      if (isLoginPage && isLoggedIn) {
        return Response.redirect(new URL("/admin/dashboard", request.nextUrl))
      }

      return true
    },
  },
  pages: {
    signIn: "/admin/giris",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.AUTH_SECRET,
})
