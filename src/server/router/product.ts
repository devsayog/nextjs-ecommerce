import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import slugify from 'slugify'
import { z } from 'zod'

import {
  productByIdSchema,
  productSchema,
  productUpdateSchema,
} from '@/types/product'

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
      return prisma.product.create({
        data: {
          ...input,
          slug: slugify(input.title),
          user: {
            connect: { id: ctx.session.user.id },
          },
        },
      })
    }),
  dashboardList: publicProcedure.query(async () => {
    return prisma.product.findMany({
      orderBy: [{ createdAt: 'desc' }],
      select: adminProduct,
    })
  }),
  getById: publicProcedure.input(productByIdSchema).query(async ({ input }) => {
    const product = await prisma.product.findUnique({ where: { id: input.id } })
    if (!product) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Product not found',
      })
    }
    return product
  }),
  update: protectedSuperAdminProcedure
    .input(productUpdateSchema)
    .mutation(async ({ input }) => {
      const product = await prisma.product.update({
        where: { id: input.id },
        data: { ...input },
      })
      return product
    }),
  deleteById: protectedSuperAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await prisma.product.delete({ where: { id: input.id } })
      return { message: 'Product deleted' }
    }),
})
