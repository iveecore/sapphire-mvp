import { z } from 'zod'

export const bodyProfileSchema = z.object({
  body_type: z.string().max(80).optional().nullable(),
  height_cm: z.number().int().min(80).max(240).optional().nullable(),
  bust_cm: z.number().int().min(40).max(200).optional().nullable(),
  waist_cm: z.number().int().min(40).max(200).optional().nullable(),
  hips_cm: z.number().int().min(40).max(250).optional().nullable(),
  size_top: z.string().max(20).optional().nullable(),
  size_bottom: z.string().max(20).optional().nullable(),
  size_shoes: z.string().max(20).optional().nullable()
})

