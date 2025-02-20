'use client'

import { z } from 'zod'

export const passwordChangeSchema = z.object({
    passwordCurrent: z.string().min(8),
    password: z.string().min(8),
})

export type passwordChangeSchemaValues = z.infer<typeof passwordChangeSchema>
