"use client"

import { passwordChangeFormSchema, passwordChangeFormSchemaValues } from "@/lib/forms/account"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { ClassNameValue } from "tailwind-merge"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { changePassword } from "@/lib/data/auth"

type Props = {
    className?: ClassNameValue
    passwordLabel: string
    passwordCurrentLabel: string
    submitLabel: string
    passwordChangeSuccessMessage: string
}

const PasswordChangeForm = ({ className, passwordChangeSuccessMessage, submitLabel, passwordLabel, passwordCurrentLabel }: Props) => {
    const form = useForm<passwordChangeFormSchemaValues>({ resolver: zodResolver(passwordChangeFormSchema), defaultValues: { password: '', passwordCurrent: '' } })

    const onSubmit = async (values: passwordChangeFormSchemaValues) => {
        const [, err] = await changePassword(values)

        if (err) {
            toast.error(err)
            return
        }

        toast.success(passwordChangeSuccessMessage)
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("flex flex-col gap-2", className)}
            >
                <FormField
                    name="passwordCurrent"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    aria-label={passwordCurrentLabel}
                                    name="name"
                                    className='bg-white'
                                    type="password"
                                    placeholder={passwordCurrentLabel}
                                    autoComplete="current-password"
                                    required
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    aria-label={passwordLabel}
                                    name="name"
                                    className='bg-white'
                                    type="password"
                                    placeholder={passwordLabel}
                                    autoComplete="new-password"
                                    required
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button>{submitLabel}</Button>
            </form>
        </Form>

    )
}

export default PasswordChangeForm
