import { TRPCError } from '@trpc/server'
import slugify from 'slugify'

import { productSchema } from '@/types/product'

import { prisma } from '../db/client'
import { protectedSuperAdminProcedure, router } from '../trpc'

export const productRouter = router({
  add: protectedSuperAdminProcedure
    .input(productSchema)
    .mutation(async ({ input, ctx }) => {
      if (input.images.length > 5) {
        throw new TRPCError({
          code: 'PAYLOAD_TOO_LARGE',
          message: 'Only 5 images are supported',
        })
      }
      const product = await prisma.product.create({
        data: {
          ...input,
          slug: slugify(input.title),
          user: {
            connect: { id: ctx.session.user.id },
          },
        },
      })
      return product
    }),
})
