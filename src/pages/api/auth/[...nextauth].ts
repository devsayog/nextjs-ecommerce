import { PrismaAdapter } from '@next-auth/prisma-adapter'
import type { NextAuthOptions, User } from 'next-auth'
import NextAuth from 'next-auth'
import type { AdapterUser } from 'next-auth/adapters'
import EmailProvider from 'next-auth/providers/email'
import GoogleProvider from 'next-auth/providers/google'

import { env } from '@/env/server.mjs'
import { prisma } from '@/server/db/client'
import type { ROLES } from '@/types/enum'

type UserType = (User & { role: ROLES }) | (AdapterUser & { role: ROLES })
export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user }) {
      const returnUser = user as UserType
      if (session.user) {
        session.user.id = returnUser.id
        session.user.role = returnUser.role
      }
      return session
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      server: {
        host: env.SMTP_HOST,
        port: Number(env.SMTP_PORT),
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASSWORD,
        },
      },
      from: env.SMTP_FROM,
      maxAge: 10 * 60,
    }),
  ],
  pages: {
    signIn: '/',
    signOut: '/',
    verifyRequest: '/',
    error: '/',
  },
  secret: env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
