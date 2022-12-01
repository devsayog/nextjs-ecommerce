import { protectedProcedure, publicProcedure, router } from '../trpc'

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => ctx.session),
  getSecretMessage: protectedProcedure.query(
    () => 'You are logged in to see this message'
  ),
  getMessage: publicProcedure.query(() => 'this is your message'),
})
