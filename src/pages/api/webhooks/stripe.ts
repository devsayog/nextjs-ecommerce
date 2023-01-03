/* eslint-disable no-restricted-syntax */
import { buffer } from 'micro'
import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

import { env } from '@/env/server.mjs'
import { prisma } from '@/server/db/client'

const endpointSecret =
  'whsec_5711d8b53beef153b601bbcc8afa2b0bd044cfc3636e44d2c6b0945c2fc45119'

export const config = {
  api: {
    bodyParser: false,
  },
}

// eslint-disable-next-line import/no-anonymous-default-export
export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const webhookSecret = env.STRIPE_PRIVATE_KEY
  const stripe = new Stripe(webhookSecret, {
    apiVersion: '2022-11-15',
  })
  const signature = req.headers['stripe-signature'] as string
  const signingSecret = endpointSecret
  const reqBuffer = await buffer(req)

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(reqBuffer, signature, signingSecret)
  } catch (error: any) {
    console.log(error)
    return res.status(400).send(`Webhook error: ${error.message}`)
  }
  const data: any = event.data.object

  switch (event.type) {
    case 'checkout.session.completed':
      stripe.customers
        .retrieve(data.customer)
        .then(async (customer: any) => {
          const array: any = []
          const items = JSON.parse(customer.metadata.cart)
          for (const item of items) {
            // eslint-disable-next-line no-await-in-loop
            const product = await prisma.product.findFirst({
              where: { id: item.id },
            })
            if (!product) {
              throw new Error('Something went worng')
            }
            array.push({
              id: product.id,
              name: product.title,
              slug: product.slug,
              image: product.images[0],
              price: product.newPrice,
              quantity: item.quantity,
            })
            // eslint-disable-next-line no-await-in-loop
            await prisma.product.update({
              where: { id: item.id },
              data: {
                sold: product.sold + item.quantity,
                countInStock: product.countInStock - item.quantity,
              },
            })
          }
          await prisma.orders.create({
            data: {
              paymentIntent: data.payment_intent,
              customerId: data.id,
              userId: customer.metadata.userId,
              items: array,
              addressLine1: data.shipping.address.line1,
              addressLine2: data.shipping.address.line2,
              city: data.shipping.address.city,
              country: data.shipping.address.country,
              email: data.customer_details.email,
              postalCode: data.shipping.address.postal_code,
              name: data.shipping.name,
              phone: data.customer_details.phone,
              totalAmount: data.amount_total,
              shippingCharge: data.shipping_options.reduce(
                // eslint-disable-next-line no-return-assign
                (acc: any, cur: any) =>
                  cur.shipping_rate === data.shipping_rate
                    ? (acc = cur.shipping_amount)
                    : 0,
                0
              ),
            },
          })
        })
        .catch((err) => {
          console.log(err)
        })
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  res.send({ received: true })
}
