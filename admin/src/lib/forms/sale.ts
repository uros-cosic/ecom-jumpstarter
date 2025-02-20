'use client'

import { z } from 'zod'

export const saleSchema = z.object({
    name: z.string(),
    products: z.array(z.string()),
    type: z.string(),
    thumbnail: z.string().optional(),
    region: z.string(),
    discountPercentage: z.number().optional(),
    discountAmount: z.number().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    metadata: z.record(z.string(), z.string()).optional(),
})

export type saleSchemaValues = z.infer<typeof saleSchema>
