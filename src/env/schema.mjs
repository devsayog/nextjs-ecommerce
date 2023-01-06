// @ts-check
import { z } from 'zod'

export const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  NEXTAUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.preprocess(
    (str) => process.env.VERCEL_URL ?? str,
    process.env.VERCEL ? z.string() : z.string().url()
  ),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string(),
  SMTP_USER: z.string(),
  SMTP_PASSWORD: z.string(),
  SMTP_FROM: z.string().email(),
  STRIPE_PRIVATE_KEY: z.string(),
  CLIENT_URL: z.string().url(),
  WEB_HOOK_SECRET: z.string(),
})
export const clientSchema = z.object({
  // NEXT_PUBLIC_API: z.string().url()
  NEXT_PUBLIC_CLOUDINARY_KEY: z.string(),
  NEXT_PUBLIC_CLOUD_NAME: z.string(),
  NEXT_PUBLIC_PRESET: z.string(),
  NEXT_PUBLIC_CLIENT_URL: z.string(),
})
export const clientEnv = {
  NEXT_PUBLIC_CLOUDINARY_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_KEY,
  NEXT_PUBLIC_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUD_NAME,
  NEXT_PUBLIC_PRESET: process.env.NEXT_PUBLIC_PRESET,
  NEXT_PUBLIC_CLIENT_URL: process.env.NEXT_PUBLIC_CLIENT_URL,
}
