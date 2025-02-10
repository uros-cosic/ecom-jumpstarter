"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import loginFormSchema, { loginFormSchemaValues } from '@/lib/forms/log-in'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { logIn } from '@/lib/data/auth'
import { toast } from 'sonner'

type Props = {
    submitLabel: string;
    passwordLabel: string;
    noAccountLabel: string;
    registerLabel: string;
}

const LogInForm = ({ passwordLabel, submitLabel, registerLabel, noAccountLabel }: Props) => {
    const form = useForm<loginFormSchemaValues>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const onSubmit = async (values: loginFormSchemaValues) => {
        const [, error] = await logIn(values)

        if (error) toast.error(error)
    }

    const handleRegisterClick = () => {
        const params = new URLSearchParams(searchParams)

        params.set("mode", "register")

        router.replace(`${pathname}?${params.toString()}`)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='w-full grid grid-cols-1 gap-5 text-left'>
                <FormField
                    name='email'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="email"
                                    className="bg-white"
                                    autoFocus={true}
                                    autoComplete='email'
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name='password'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{passwordLabel}</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="password"
                                    className="bg-white"
                                    autoComplete='current-password'
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <span className='text-sm text-gray-500'>
                    {noAccountLabel}? <button className='text-blue-500 underline' type='button' onClick={handleRegisterClick}>{registerLabel}</button>
                </span>
                <Button type="submit">{submitLabel}</Button>
            </form>
        </Form>
    )
}

export default LogInForm
