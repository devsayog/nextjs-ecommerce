import { z } from 'zod'

import { category, section, subSection } from '@/appdata/navdata'

const common = {
  brand: z.string().min(3, 'Title must be 3 characters long'),
  title: z.string().min(3, 'Title must be 3 characters long'),
  metaDescription: z.string().min(5, 'Description must be 5 characters long'),
  oldPrice: z
    .number({ invalid_type_error: 'Please enter valid number' })
    .min(0.01, 'Price must be grateter than $0.01'),
  newPrice: z
    .number({ invalid_type_error: 'Please enter valid number' })
    .min(0.01, 'Price must be grateter than $0.01'),
  countInStock: z
    .number({ invalid_type_error: 'Please enter valid number' })
    .min(1, 'Quantity must be minimum of 1'),
  category: z
    .string({ invalid_type_error: 'Please select valid category' })
    .refine((val) => category.map((c) => c).includes(val as any), {
      message: 'Please select valid category',
    }),
  section: z
    .string({ invalid_type_error: 'Please select valid section' })
    .refine((val) => section.map((c) => c).includes(val as any), {
      message: 'Please select valid section',
    }),
  subSection: z
    .string({ invalid_type_error: 'Please select valid subsection' })
    .refine((val) => subSection.map((c) => c).includes(val as any), {
      message: 'Please select valid subsection',
    }),
}

export const productFormSchema = z.object({ ...common })
export const productSchema = z.object({
  description: z.string(),
  images: z.string().url().array(),
  sold: z.number().default(0),
  rating: z.number().default(0),
  ...common,
})
export type ProductFormSchemaType = z.infer<typeof productFormSchema>
