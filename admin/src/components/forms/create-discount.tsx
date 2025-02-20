"use client"

import { discountSchema, discountSchemaValues } from "@/lib/forms/discount"
import { DISCOUNT_TYPE } from "@/lib/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import DatePicker from "../date-picker"
import { Button } from "../ui/button"
import { createDiscount } from "@/lib/data/discount"
import { toast } from "sonner"

const CreateDiscountForm = () => {
    const [loading, setLoading] = useState(false)
    const [type, setType] = useState<DISCOUNT_TYPE>(DISCOUNT_TYPE.PERCENTAGE)

    const form = useForm<discountSchemaValues>({
        resolver: zodResolver(discountSchema),
        defaultValues: {
            code: '',
            type: DISCOUNT_TYPE.PERCENTAGE,
            usageLimit: 1
        }
    })

    const onSubmit = async (values: discountSchemaValues) => {
        setLoading(true)

        const [, err] = await createDiscount(values)

        if (err) {
            toast.error(err)
            setLoading(false)
            return
        }

        toast.success('Discount created')

        setLoading(false)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <FormField
                    name="code"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Code</FormLabel>
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
                    name="type"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <FormControl>
                                <Select{...field} onValueChange={val => {
                                    form.setValue('type', val)
                                    setType(val as DISCOUNT_TYPE)
                                }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={DISCOUNT_TYPE.FIXED}>{DISCOUNT_TYPE.FIXED}</SelectItem>
                                        <SelectItem value={DISCOUNT_TYPE.PERCENTAGE}>{DISCOUNT_TYPE.PERCENTAGE}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {
                    type === DISCOUNT_TYPE.FIXED && (
                        <FormField
                            name="amount"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount amount</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            min={0}
                                            required
                                            onChange={e => {
                                                form.setValue('amount', Number(e.target.value || 0))
                                            }}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    )
                }
                {
                    type === DISCOUNT_TYPE.PERCENTAGE && (
                        <FormField
                            name="percentage"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount percentage</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            min={0}
                                            max={1}
                                            step={".01"}
                                            required
                                            onChange={e => {
                                                form.setValue('percentage', Number(e.target.value || 0))
                                            }}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    )
                }
                <FormField
                    name="usageLimit"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Usage limit</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="number"
                                    min={1}
                                    required
                                    onChange={e => {
                                        form.setValue('usageLimit', Number(e.target.value || 0))
                                    }}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    name="validFrom"
                    control={form.control}
                    render={() => (
                        <FormItem className="grid gap-2">
                            <FormLabel>Valid from</FormLabel>
                            <FormControl>
                                <DatePicker
                                    onChange={val => form.setValue('validFrom', new Date(val as string))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="validTo"
                    control={form.control}
                    render={() => (
                        <FormItem className="grid gap-2">
                            <FormLabel>Valid to</FormLabel>
                            <FormControl>
                                <DatePicker
                                    onChange={val => form.setValue('validTo', new Date(val as string))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={loading} type="submit" className="lg:col-span-2">Create discount</Button>
            </form>
        </Form>
    )
}

export default CreateDiscountForm
