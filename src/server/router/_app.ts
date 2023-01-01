import { router } from '../trpc'
import { authRouter } from './auth'
import { orderRouter } from './order'
import { productRouter } from './product'
import { stripeRouter } from './stripe'

export const appRouter = router({
  auth: authRouter,
  product: productRouter,
  stripe: stripeRouter,
  order: orderRouter,
})
export type AppRouter = typeof appRouter
