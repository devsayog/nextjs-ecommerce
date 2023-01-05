import { router } from '../trpc'
import { authRouter } from './auth'
import { orderRouter } from './order'
import { productRouter } from './product'
import { reviewRouter } from './review'
import { stripeRouter } from './stripe'
import { userRouter } from './user'

export const appRouter = router({
  auth: authRouter,
  product: productRouter,
  stripe: stripeRouter,
  order: orderRouter,
  review: reviewRouter,
  user: userRouter,
})
export type AppRouter = typeof appRouter
