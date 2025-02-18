"use client"

import { categorySchema, categorySchemaValues } from "@/lib/forms/category"
import { IProductCollection, IRegion } from "@/lib/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "@/components/ui/button"
import { updateCategory } from "@/lib/data/category"
import { toast } from "sonner"
import { updateCollection } from "@/lib/data/collection"

type Props = {
    regions: IRegion[],
    collection: IProductCollection
}

const EditCollectionForm = ({ collection, regions }: Props) => {
    const [loading, setLoading] = useState(false)

    const form = useForm<categorySchemaValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: collection.name,
            description: collection.description,
            keywords: collection.keywords,
            region: collection.region,
            metadata: collection.metadata
        }
    })

    const onSubmit = async (values: categorySchemaValues) => {
        setLoading(true)

        const [, err] = await updateCollection(collection._id, values)

        if (err) {
            toast.error(err)
            setLoading(false)
            return
        }

        toast.success('Collection updated')

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
                                    defaultValue={collection.keywords?.join(', ') ?? ''}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={loading} type="submit" className="lg:col-span-2">Update collection</Button>
            </form>
        </Form>
    )
}

export default EditCollectionForm


