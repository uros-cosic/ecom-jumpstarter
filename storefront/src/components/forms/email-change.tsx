"use client"

import { emailChangeFormSchema, emailChangeFormSchemaValues } from "@/lib/forms/account"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { ClassNameValue } from "tailwind-merge"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { updateMe } from "@/lib/data/user"

type Props = {
    className?: ClassNameValue
    submitLabel: string
    emailChangeSuccessMessage: string
}

const EmailChangeForm = ({ className, submitLabel, emailChangeSuccessMessage }: Props) => {
    const form = useForm<emailChangeFormSchemaValues>({ resolver: zodResolver(emailChangeFormSchema), defaultValues: { email: '' } })

    const onSubmit = async (values: emailChangeFormSchemaValues) => {
        const [, err] = await updateMe(values)

        if (err) {
            toast.error(err)
            return
        }

        toast.success(emailChangeSuccessMessage)
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("flex items-center", className)}
            >
                <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    aria-label="Email"
                                    name="name"
                                    type="email"
                                    className='rounded-r-none bg-secondary text-secondary-foreground bg-white'
                                    placeholder="email"
                                    required
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="rounded-l-none border border-l-0">{submitLabel}</Button>
            </form>
        </Form>

    )
}

export default EmailChangeForm
