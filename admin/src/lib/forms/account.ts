'use client'

import { z } from 'zod'

export const accountSchema = z.object({
    name: z.string(),
    email: z.string().email(),
})

export type accountSchemaValues = z.infer<typeof accountSchema>
