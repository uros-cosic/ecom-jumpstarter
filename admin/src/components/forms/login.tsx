"use client"

import { toast } from "sonner"
import { redirect } from "next/navigation"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { STORE } from "@/lib/constants"
import loginFormSchema, { loginFormSchemaValues } from "@/lib/forms/login"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { logIn } from "@/lib/data/auth"

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const [loading, setLoading] = useState(false)

    const form = useForm<loginFormSchemaValues>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const onSubmit = async (values: loginFormSchemaValues) => {
        setLoading(true)

        const [, err] = await logIn(values)

        if (err) {
            toast.error(err)
            setLoading(false)
            return
        }

        redirect('/')
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="font-[family-name:var(--font-montserrat)] text-xl font-medium">Welcome to {STORE.name}</h1>
                        </div>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <FormField
                                    name="email"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="email" placeholder="m@example.com" required autoFocus={true} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid gap-2">
                                <FormField
                                    name="password"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="password" placeholder="********" required />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button disabled={loading} aria-disabled={loading} type="submit" className="w-full">
                                Login
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}
