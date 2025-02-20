"use client"

import { accountSchema, accountSchemaValues } from "@/lib/forms/account"
import { IUser } from "@/lib/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useState } from "react"
import { updateMe } from "@/lib/data/user"
import { toast } from "sonner"

type Props = {
    user: IUser
}

const EditAccountForm = ({ user }: Props) => {
    const [loading, setLoading] = useState(false)

    const form = useForm<accountSchemaValues>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            name: user.name,
            email: user.email
        }
    })

    const onSubmit = async (values: accountSchemaValues) => {
        setLoading(true)

        const [, err] = await updateMe(values)

        if (err) {
            toast.error(err)
            setLoading(false)
            return
        }

        toast.success('Information updated')

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
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="email"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={loading} type="submit" className="lg:col-span-2">Update</Button>
            </form>
        </Form>
    )
}

export default EditAccountForm
