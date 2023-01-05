import { z } from 'zod'

import { ROLES } from '@/appdata/list'

export const getUser = z.object({
  role: z
    .string({ invalid_type_error: 'Please select valid status' })
    .refine((val) => ROLES.map((c) => c).includes(val as any), {
      message: 'Please select valid role',
    }),
})
export type GetUser = z.infer<typeof getUser>
