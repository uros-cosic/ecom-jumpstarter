'use client'

import { z } from 'zod'

const discountCodeFormSchema = z.object({ code: z.string() })

export type discountCodeFormSchemaValues = z.infer<
    typeof discountCodeFormSchema
>

export default discountCodeFormSchema
