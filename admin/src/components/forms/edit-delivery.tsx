"use client"

import { shippingMethodSchema, shippingMethodSchemaValues } from "@/lib/forms/delivery"
import { IRegion, IShippingMethod } from "@/lib/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { updateShippingMethod } from "@/lib/data/delivery"
import { toast } from "sonner"

type Props = {
    delivery: IShippingMethod
    regions: IRegion[]
}

const EditDeliveryForm = ({ delivery, regions }: Props) => {
    const [loading, setLoading] = useState(false)

    const form = useForm<shippingMethodSchemaValues>({
        resolver: zodResolver(shippingMethodSchema),
        defaultValues: {
            cost: delivery.cost,
            name: delivery.name,
            region: delivery.region,
        }
    })

    const onSubmit = async (values: shippingMethodSchemaValues) => {
        setLoading(true)

        const [, err] = await updateShippingMethod(delivery._id, values)

        if (err) {
            toast.error(err)
            setLoading(false)
            return
        }

        toast.success('Shipping method updated')

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
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="cost"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cost</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="number"
                                    min={0}
                                    required
                                    onChange={e => {
                                        form.setValue('cost', Number(e.target.value || 0))
                                    }}
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
                <Button disabled={loading} type="submit" className="lg:col-span-2">Update shipping method</Button>
            </form>
        </Form>
    )
}

export default EditDeliveryForm

