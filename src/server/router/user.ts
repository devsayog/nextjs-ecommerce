import { z } from 'zod'

import { ROLES } from '@/appdata/list'

import {
  protectedAdminProcedure,
  protectedSuperAdminProcedure,
  router,
} from '../trpc'

export const userRouter = router({
  updateUserRole: protectedSuperAdminProcedure
    .input(
      z.object({
        id: z.string(),
        role: z
          .string({ invalid_type_error: 'Please select valid status' })
          .refine((val) => ROLES.map((c) => c).includes(val as any), {
            message: 'Please select valid role',
          }),
      })
    )
    .mutation(async ({ input, ctx }) =>
      ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          role: input.role as any,
        },
      })
    ),
  getById: protectedAdminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) =>
      ctx.prisma.user.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          name: true,
          createdAt: true,
          image: true,
          email: true,
          role: true,
        },
      })
    ),
  getAll: protectedAdminProcedure.query(({ ctx }) =>
    ctx.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        image: true,
        email: true,
        role: true,
      },
    })
  ),
})
