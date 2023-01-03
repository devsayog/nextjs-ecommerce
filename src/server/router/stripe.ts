/* eslint-disable no-restricted-syntax */
import { TRPCError } from '@trpc/server'
import Stripe from 'stripe'

import { env } from '@/env/server.mjs'
import { checkoutSchema } from '@/types/checkout'

import { protectedProcedure, router } from '../trpc'
// stripe listen --forward-to localhost:4242/webhook
// stripe trigger payment_intent.succeeded
const stripe = new Stripe(env.STRIPE_PRIVATE_KEY, {
  apiVersion: '2022-11-15',
})

export const stripeRouter = router({
  checkoutSession: protectedProcedure
    .input(checkoutSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const lineItems = []
        const cartItems = []
        const { products } = input
        for (const item of products) {
          // eslint-disable-next-line no-await-in-loop
          const product = await ctx.prisma.product.findFirst({
            where: { id: item.id },
          })
          if (!product) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Product not found',
            })
          }
          cartItems.push({
            quantity: item.quantity,
            id: product.id,
          })
          lineItems.push({
            price_data: {
              currency: 'usd',
              product_data: {
                name: product.title,
                images: product.images,
              },
              unit_amount: product.newPrice * 100,
            },
            quantity: item.quantity,
          })
        }
        const customer = await stripe.customers.create({
          metadata: {
            userId: ctx.session.user.id,
            cart: JSON.stringify(cartItems),
          },
        })

        const session = await stripe.checkout.sessions.create({
          customer: customer.id,
          payment_method_types: ['card'],
          mode: 'payment',
          line_items: lineItems,
          shipping_address_collection: {
            allowed_countries: ['US', 'NP', 'IN', 'JP', 'ES', 'CA'],
          },
          shipping_options: [
            {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: {
                  amount: 0,
                  currency: 'usd',
                },
                display_name: 'Free shipping',
                // Delivers between 5-7 business days
                delivery_estimate: {
                  minimum: {
                    unit: 'business_day',
                    value: 5,
                  },
                  maximum: {
                    unit: 'business_day',
                    value: 7,
                  },
                },
              },
            },
            {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: {
                  amount: 1500,
                  currency: 'usd',
                },
                display_name: 'Next day air',
                // Delivers in exactly 1 business day
                delivery_estimate: {
                  minimum: {
                    unit: 'business_day',
                    value: 1,
                  },
                  maximum: {
                    unit: 'business_day',
                    value: 1,
                  },
                },
              },
            },
          ],
          success_url: `${process.env.CLIENT_URL}/success`,
          cancel_url: `${process.env.CLIENT_URL}`,
        })
        return {
          url: session.url || '',
        }
      } catch (e) {
        let msg = ''
        if (e instanceof Error) {
          msg = e.message
        }
        throw new TRPCError({
          message: msg || 'Payment failed',
          code: 'INTERNAL_SERVER_ERROR',
        })
      }
    }),
})
