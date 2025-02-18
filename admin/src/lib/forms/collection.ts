'use client'

import { z } from 'zod'

export const collectionSchema = z.object({
    name: z.string(),
    description: z.string(),
    keywords: z.array(z.string()).optional(),
    region: z.string(),
    metadata: z.record(z.string(), z.string()).optional(),
})

export type collectionSchemaValues = z.infer<typeof collectionSchema>
