import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { protectedProcedure, router } from '../trpc'

const orderList = Prisma.validator<Prisma.OrdersSelect>()({
  id: true,
  totalAmount: true,
  createdAt: true,
  items: true,
})

export const orderRouter = router({
  getOrders: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.orders.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: orderList,
    })
  }),
  getOrderDetails: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const order = ctx.prisma.orders.findUnique({ where: { id: input.id } })
      if (!order) {
        throw new TRPCError({
          message: 'Order not found',
          code: 'NOT_FOUND',
        })
      }
      return order
    }),
})
