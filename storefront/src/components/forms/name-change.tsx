"use client"

import { nameChangeFormSchema, nameChangeFormSchemaValues } from "@/lib/forms/account"
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
    nameLabel: string
    submitLabel: string
    nameChangeSuccessMessage: string
}

const NameChangeForm = ({ className, nameLabel, submitLabel, nameChangeSuccessMessage }: Props) => {
    const form = useForm<nameChangeFormSchemaValues>({ resolver: zodResolver(nameChangeFormSchema), defaultValues: { name: '' } })

    const onSubmit = async (values: nameChangeFormSchemaValues) => {
        const [, err] = await updateMe(values)

        if (err) {
            toast.error(err)
            return
        }

        toast.success(nameChangeSuccessMessage)
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn("flex items-center", className)}
            >
                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    aria-label={nameLabel}
                                    name="name"
                                    className='rounded-r-none bg-secondary text-secondary-foreground bg-white'
                                    placeholder={nameLabel}
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

export default NameChangeForm
