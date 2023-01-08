import { protectedAdminProcedure, router } from '../trpc'

export const dashboardRouter = router({
  totalSales: protectedAdminProcedure.query(async ({ ctx }) => {
    const res = await ctx.prisma.product.aggregate({
      _sum: {
        sold: true,
      },
    })
    return res._sum.sold
  }),
  totalOrders: protectedAdminProcedure.query(async ({ ctx }) => {
    const res = await ctx.prisma.orders.count({})
    return res
  }),
  totalProducts: protectedAdminProcedure.query(async ({ ctx }) => {
    const res = await ctx.prisma.product.count({})
    return res
  }),
  totalEarnings: protectedAdminProcedure.query(async ({ ctx }) => {
    const res = await ctx.prisma.orders.aggregate({
      _sum: {
        totalAmount: true,
      },
    })
    return res._sum.totalAmount
  }),
  mostSoldProducts: protectedAdminProcedure.query(async ({ ctx }) => {
    const res = await ctx.prisma.product.findMany({
      take: 5,
      orderBy: {
        sold: 'desc',
      },
    })
    return res
  }),
})
