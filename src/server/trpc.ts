import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'

import { ROLES } from '@/types/enum'

import type { Context } from './context'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape
  },
})
export const { router } = t

/**
 * Unprotected procedure
 */
export const publicProcedure = t.procedure
/**
 * Resuable middleware to ensure users are logged in
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})
/**
 * Protected procedure
 */
export const protectedProcedure = t.procedure.use(isAuthed)

/**
 * Resuable middleware to ensure only Admin have access
 */
const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  const { user } = ctx.session
  if (user.role === ROLES.USER) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Only admin have access to this content',
    })
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})
/**
 * Protected Admin procedure
 */
export const protectedAdminProcedure = t.procedure.use(isAdmin)

/**
 * Resuable middleware to ensure only SuperAdmin have access
 */
const isSuperAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  const { user } = ctx.session
  if (user.role !== ROLES.SUPERADMIN) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Only super admin have access to this content',
    })
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})
/**
 * Protected SuperAdmin procedure
 */
export const protectedSuperAdminProcedure = t.procedure.use(isSuperAdmin)
