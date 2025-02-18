"use client"

import { IRegion } from "@/lib/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { collectionSchema, collectionSchemaValues } from "@/lib/forms/collection"
import { createCollection } from "@/lib/data/collection"

type Props = {
    regions: IRegion[],
}

const CreateCollectionForm = ({ regions }: Props) => {
    const [loading, setLoading] = useState(false)

    const form = useForm<collectionSchemaValues>({
        resolver: zodResolver(collectionSchema),
        defaultValues: {
            name: '',
            description: '',
            keywords: [],
            region: ''
        }
    })

    const onSubmit = async (values: collectionSchemaValues) => {
        setLoading(true)

        const [, err] = await createCollection(values)

        if (err) {
            toast.error(err)
            setLoading(false)
            return
        }

        toast.success('Collection created')

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
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={loading} type="submit" className="lg:col-span-2">Create collection</Button>
            </form>
        </Form>
    )
}

export default CreateCollectionForm
