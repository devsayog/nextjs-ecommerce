import { z } from 'zod'

export const addressSchema = z.object({
  address: z.string().min(10, 'Address must be 10 characters long'),
  email: z.string().email({ message: 'Please enter valid email' }),
  postalCode: z
    .string()
    .regex(
      /^([0-9]{5}|[a-zA-Z][a-zA-Z ]{0,49})$/,
      'Please provide valid postal code'
    ),
  fullName: z.string().min(3, 'Full name must be 5 characters long'),
  mobileNumber: z
    .string()
    .regex(
      /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$/,
      'Please provide valid mobile number.'
    ),
  landMark: z.string().optional(),
  province: z.string().min(3, 'Province must be 10 characters long'),
  city: z.string().min(3, 'Please provide valid city name'),
  area: z.string().min(3, 'Area must be 3 characters long.'),
})
export type AddressSchemaType = z.infer<typeof addressSchema>
