import type { DefaultSession } from 'next-auth'

import type { ROLES } from './enum'

declare module 'next-auth' {
  interface Session {
    user?: {
      id: string
      role: ROLES
    } & DefaultSession['user']
  }
}
