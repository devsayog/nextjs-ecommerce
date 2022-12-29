import { router } from '../trpc'
import { authRouter } from './auth'
import { productRouter } from './product'
import { stripeRouter } from './stripe'

export const appRouter = router({
  auth: authRouter,
  product: productRouter,
  stripe: stripeRouter,
})
export type AppRouter = typeof appRouter
