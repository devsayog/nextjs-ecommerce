import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import slugify from 'slugify'
import { z } from 'zod'

import {
  getProductSchema,
  productByIdSchema,
  productSchema,
  productUpdateSchema,
} from '@/types/product'

import { protectedSuperAdminProcedure, publicProcedure, router } from '../trpc'

const adminProduct = Prisma.validator<Prisma.ProductSelect>()({
  rating: true,
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
  slug: true,
})
const returnProduct = Prisma.validator<Prisma.ProductSelect>()({
  brand: true,
  category: true,
  countInStock: true,
  description: true,
  id: true,
  images: true,
  metaDescription: true,
  newPrice: true,
  oldPrice: true,
  rating: true,
  section: true,
  slug: true,
  sold: true,
  subSection: true,
  title: true,
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
      return ctx.prisma.product.create({
        data: {
          ...input,
          slug: slugify(input.title),
          user: {
            connect: { id: ctx.session.user.id },
          },
        },
      })
    }),
  dashboardList: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.product.findMany({
      orderBy: [{ createdAt: 'desc' }],
      select: adminProduct,
    })
  }),
  getById: publicProcedure
    .input(productByIdSchema)
    .query(async ({ input, ctx }) => {
      const product = await ctx.prisma.product.findUnique({
        where: { id: input.id },
      })
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
    .mutation(async ({ input, ctx }) => {
      const product = await ctx.prisma.product.update({
        where: { id: input.id },
        data: { ...input },
      })
      return product
    }),
  deleteById: protectedSuperAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.product.delete({ where: { id: input.id } })
      return { message: 'Product deleted' }
    }),
  getAllProduct: publicProcedure
    .input(getProductSchema)
    .query(async ({ input, ctx }) => {
      const limit = input.limit ? Math.round(input.limit) : 8
      const cursor = input.cursor || ''
      const skip = cursor !== '' ? 1 : 0
      const cursorObj = cursor === '' ? undefined : { id: cursor }
      const orderBy:
        | Prisma.Enumerable<Prisma.ProductOrderByWithRelationInput>
        | undefined = []
      if (input.mostSold) {
        orderBy.push({ sold: 'desc' })
      } else {
        orderBy.push({ createdAt: 'desc' })
      }
      const obj: Prisma.ProductFindManyArgs = {
        select: adminProduct,
        take: limit,
        skip,
        cursor: cursorObj,
        orderBy,
      }
      if (input.category) {
        obj.where = {
          category: input.category,
        }
      }
      if (input.subSection) {
        if (input.subSection.length > 0) {
          const a = input.subSection.map((i) => ({ subSection: i }))
          obj.where = {
            ...obj.where,
            OR: a,
          }
        }
      }
      const products = await ctx.prisma.product.findMany(obj)
      if (!products) {
        throw new TRPCError({
          message: 'Not found',
          code: 'NOT_FOUND',
        })
      }
      return {
        products,
        nextId: products.length === limit ? products[limit - 1]?.id : undefined,
      }
    }),
  productDescription: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const product = await ctx.prisma.product.findFirst({
        where: { slug: input.slug },
        select: {
          ...returnProduct,
          review: {
            orderBy: {
              createdAt: 'desc',
            },
            select: {
              id: true,
              message: true,
              createdAt: true,
              rating: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      })
      if (!product) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Product not found',
        })
      }
      return product
    }),
  search: publicProcedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      return ctx.prisma.product.findMany({
        where: {
          OR: [
            { brand: { contains: input.query, mode: 'insensitive' } },
            { title: { contains: input.query, mode: 'insensitive' } },
            { category: { contains: input.query, mode: 'insensitive' } },
            { section: { contains: input.query, mode: 'insensitive' } },
            { subSection: { contains: input.query, mode: 'insensitive' } },
          ],
        },
        take: 5,
        select: {
          id: true,
          title: true,
          category: true,
          slug: true,
          section: true,
          subSection: true,
          images: true,
          brand: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }),
})
