import { router } from '../trpc'
import { authRouter } from './auth'
import { orderRouter } from './order'
import { productRouter } from './product'
import { reviewRouter } from './review'
import { stripeRouter } from './stripe'

export const appRouter = router({
  auth: authRouter,
  product: productRouter,
  stripe: stripeRouter,
  order: orderRouter,
  review: reviewRouter,
})
export type AppRouter = typeof appRouter
