'use client'

import { z } from 'zod'

export const userSchema = z.object({
    name: z.string(),
    email: z.string(),
    role: z.string(),
    region: z.string(),
})

export type userSchemaValues = z.infer<typeof userSchema>
