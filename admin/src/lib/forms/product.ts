'use client'

import { z } from 'zod'

export const productOptionSchema = z.object({
    name: z.string(),
    value: z.string(),
})

export const productVariantSchema = z.object({
    title: z.string(),
    options: z.array(productOptionSchema),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    ean: z.string().optional(),
    upc: z.string().optional(),
    hsCode: z.string().optional(),
    midCode: z.string().optional(),
    originCountry: z.string().optional(),
    weight: z.string().optional(),
    length: z.string().optional(),
    height: z.string().optional(),
    width: z.string().optional(),
    material: z.string().optional(),
    price: z.number(),
    quantity: z.number(),
})

export type productVariantSchemaValues = z.infer<typeof productVariantSchema>

export const productOptionsSchema = z.object({
    name: z.string(),
    values: z.array(z.string()),
})

export type productOptionsSchemaValues = z.infer<typeof productOptionsSchema>

export const productSchema = z.object({
    name: z.string(),
    description: z.string(),
    details: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    type: z.string(),
    thumbnail: z.string(),
    images: z.array(z.string()),
    productCategory: z.string().optional(),
    productCollection: z.string().optional(),
    options: z.array(productOptionsSchema).optional(),
    variants: z.array(productVariantSchema).optional(),
    region: z.string(),
    sizeGuide: z.string().optional(),
    price: z.number(),
    quantity: z.number(),
    metadata: z.record(z.string(), z.string()).optional(),
})

export type productSchemaValues = z.infer<typeof productSchema>
