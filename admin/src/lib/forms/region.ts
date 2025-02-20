'use client'

import { z } from 'zod'

export const regionSchema = z.object({
    name: z.string(),
    currency: z.string(),
    defaultLocale: z.string(),
    countries: z.array(z.string()),
    taxRate: z.number().optional(),
    metadata: z.record(z.string(), z.string()).optional(),
})

export type regionSchemaValues = z.infer<typeof regionSchema>
