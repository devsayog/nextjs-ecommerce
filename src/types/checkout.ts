import { z } from 'zod'

const productSchema = z.object({
  id: z.string(),
  quantity: z.number().min(1, 'Quantity must be minimum of 1'),
})
export const checkoutSchema = z.object({
  products: z.array(productSchema),
})
