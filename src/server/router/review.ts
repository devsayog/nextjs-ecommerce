import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { protectedProcedure, router } from '../trpc'

export const reviewRouter = router({
  add: protectedProcedure
    .input(
      z.object({
        message: z.string().min(4, 'Review must be 4 characters long.'),
        rating: z.number().max(5, 'Rating must not be greater than 5.'),
        productId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.review.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      })
      const res = await ctx.prisma.product.findUnique({
        where: {
          id: input.productId,
        },
        select: {
          review: {
            select: {
              rating: true,
            },
          },
        },
      })
      if (!res) {
        throw new TRPCError({
          message: 'Failed to create review',
          code: 'BAD_REQUEST',
        })
      }
      const count = res.review.length
      if (count < 1) {
        throw new TRPCError({
          message: 'Failed to create review',
          code: 'BAD_REQUEST',
        })
      }
      const avg = res.review.reduce((acc, cur) => {
        acc += cur.rating
        return acc
      }, 0)
      await ctx.prisma.product.update({
        where: {
          id: input.productId,
        },
        data: {
          rating: Math.round(avg / count),
        },
      })
      return {
        message: 'Review added',
      }
    }),
})
