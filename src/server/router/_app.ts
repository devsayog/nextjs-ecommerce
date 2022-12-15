import { router } from '../trpc'
import { authRouter } from './auth'
import { productRouter } from './product'

export const appRouter = router({
  auth: authRouter,
  product: productRouter,
})
export type AppRouter = typeof appRouter
