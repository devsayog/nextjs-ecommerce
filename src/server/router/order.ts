import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { STATUSES } from '@/appdata/list'
import { env } from '@/env/server.mjs'

import {
  protectedAdminProcedure,
  protectedProcedure,
  protectedSuperAdminProcedure,
  router,
} from '../trpc'
import { sendEmail } from '../utils/email'

function generateMessage({ status, name }: { status: string; name: string }) {
  let message = ''
  switch (status) {
    case 'SHIPPING':
      message = `${name} order is now shipped and will be deliverd soon.`
      break
    case 'SUCCESS':
      message = `${name} order have been successfully deliverd. Thank you for shopping with us.`
      break
    case 'CANCELED':
      message = `${name} order have beem canceled. Sorry for inconvenience.`
      break
    default:
      break
  }
  return message
}
const orderList = Prisma.validator<Prisma.OrdersSelect>()({
  id: true,
  totalAmount: true,
  createdAt: true,
  items: true,
})

export const orderRouter = router({
  getAdminOrder: protectedAdminProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.orders.findMany({
      select: {
        id: true,
        deliveryStatus: true,
        totalAmount: true,
        shippingCharge: true,
        name: true,
        email: true,
        createdAt: true,
        items: true,
      },
    })
    return result
  }),
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
  updateDeliveryStatus: protectedSuperAdminProcedure
    .input(
      z.object({
        id: z.string(),
        deliveryStatus: z
          .string({ invalid_type_error: 'Please select valid status' })
          .refine((val) => STATUSES.map((c) => c).includes(val as any), {
            message: 'Please select valid status',
          }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const order = await ctx.prisma.orders.update({
        where: {
          id: input.id,
        },
        data: {
          deliveryStatus: input.deliveryStatus as any,
        },
        select: {
          id: true,
          deliveryStatus: true,
          name: true,
          email: true,
          user: {
            select: {
              email: true,
            },
          },
        },
      })
      const msg = generateMessage({
        status: order.deliveryStatus,
        name: order.name || 'Your',
      })
      await sendEmail({
        to: (order.email ?? order.user.email) || '',
        subject: 'Update on delivery status',
        html: `
        ${msg}
        <p>Check your order details <a target='_blank' href='${env.CLIENT_URL}/order/${order.id}'>${order.id}</a></p>
        `,
      })
      return {
        message: 'Updated successfully',
      }
    }),
})
