"use client"

import { categorySchema, categorySchemaValues } from "@/lib/forms/category"
import { IProductCategory, IRegion } from "@/lib/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "@/components/ui/button"
import { updateCategory } from "@/lib/data/category"
import { toast } from "sonner"

type Props = {
    regions: IRegion[],
    categories: IProductCategory[]
    category: IProductCategory
}

const EditCategoryForm = ({ category, categories, regions }: Props) => {
    const [loading, setLoading] = useState(false)

    const form = useForm<categorySchemaValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: category.name,
            description: category.description,
            keywords: category.keywords,
            region: category.region,
            parentCategory: category.parentCategory ?? undefined,
            metadata: category.metadata
        }
    })

    const onSubmit = async (values: categorySchemaValues) => {
        setLoading(true)

        const [, err] = await updateCategory(category._id, values)

        if (err) {
            toast.error(err)
            setLoading(false)
            return
        }

        toast.success('Cateogry updated')

        setLoading(false)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    autoFocus
                                    required
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    required
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="region"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Region</FormLabel>
                            <FormControl>
                                <Select {...field} onValueChange={val => form.setValue('region', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose region" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {regions.map(region => (
                                            <SelectItem key={region._id} value={region._id}>{region.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="parentCategory"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Parent category</FormLabel>
                            <FormControl>
                                <Select {...field} onValueChange={val => form.setValue('parentCategory', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(category => (
                                            <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="keywords"
                    control={form.control}
                    render={() => (
                        <FormItem>
                            <FormLabel>Keywords</FormLabel>
                            <FormControl>
                                <Input
                                    onChange={e => {
                                        form.setValue('keywords', e.target.value.split(',').map(w => w.trim()))
                                    }}
                                    defaultValue={category.keywords?.join(', ') ?? ''}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={loading} type="submit" className="lg:col-span-2">Update category</Button>
            </form>
        </Form>
    )
}

export default EditCategoryForm

