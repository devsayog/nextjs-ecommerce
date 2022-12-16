import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import slugify from 'slugify'

import { productSchema } from '@/types/product'

import { prisma } from '../db/client'
import { protectedSuperAdminProcedure, publicProcedure, router } from '../trpc'

const adminProduct = Prisma.validator<Prisma.ProductSelect>()({
  id: true,
  title: true,
  brand: true,
  category: true,
  countInStock: true,
  images: true,
  newPrice: true,
  oldPrice: true,
  section: true,
  subSection: true,
})

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
  dashboardList: publicProcedure.query(async () => {
    return prisma.product.findMany({ select: adminProduct })
  }),
})
