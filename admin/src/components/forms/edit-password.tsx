"use client"

import { changePassword } from "@/lib/data/auth"
import { passwordChangeSchema, passwordChangeSchemaValues } from "@/lib/forms/password-change"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

const EditPasswordForm = () => {
    const [loading, setLoading] = useState(false)

    const form = useForm<passwordChangeSchemaValues>({
        resolver: zodResolver(passwordChangeSchema),
        defaultValues: {
            password: '',
            passwordCurrent: ''
        }
    })

    const onSubmit = async (values: passwordChangeSchemaValues) => {
        setLoading(true)

        const [, err] = await changePassword(values)

        if (err) {
            toast.error(err)
            setLoading(false)
            return
        }

        toast.success('Password updated')
        setLoading(false)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <FormField
                    name="passwordCurrent"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Current password</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="password"
                                    autoFocus
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New password</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="password"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button disabled={loading} type="submit" className="lg:col-span-2">Change password</Button>
            </form>
        </Form>
    )
}

export default EditPasswordForm
