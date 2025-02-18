'use client'

import { z } from 'zod'

export const categorySchema = z.object({
    name: z.string(),
    description: z.string(),
    keywords: z.array(z.string()).optional(),
    parentCategory: z.string().optional(),
    region: z.string(),
    metadata: z.record(z.string(), z.string()).optional(),
})

export type categorySchemaValues = z.infer<typeof categorySchema>
