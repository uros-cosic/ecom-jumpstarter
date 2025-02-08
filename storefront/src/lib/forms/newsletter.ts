'use client'

import { z } from 'zod'

// TODO: Localize error messages => use server func >:DDD

const newsletterFormSchema = z.object({ email: z.string().email() })

export type newsletterFormSchemaValues = z.infer<typeof newsletterFormSchema>

export default newsletterFormSchema
