'use client'

import { z } from 'zod'

// TODO: Localize error messages => use server func >:DDD

const discountCodeFormSchema = z.object({ code: z.string() })

export type discountCodeFormSchemaValues = z.infer<
    typeof discountCodeFormSchema
>

export default discountCodeFormSchema
