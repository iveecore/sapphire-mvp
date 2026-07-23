import { z } from 'zod'

export const signupSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  fullName: z.string().trim().max(120).optional()
})

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.')
})

export function formatZodError(error: z.ZodError) {
  return error.issues[0]?.message ?? 'Please check your details and try again.'
}

export const loginResponseSchema = z.object({
  next: z.string().min(1).optional()
})
