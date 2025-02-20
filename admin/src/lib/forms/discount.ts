'use client'

import { z } from 'zod'

export const discountSchema = z.object({
    code: z.string(),
    type: z.string(),
    amount: z.number().optional(),
    percentage: z.number().optional(),
    usageLimit: z.number(),
    validFrom: z.date().optional(),
    validTo: z.date().optional(),
    metadata: z.record(z.string(), z.string()).optional(),
})

export type discountSchemaValues = z.infer<typeof discountSchema>
