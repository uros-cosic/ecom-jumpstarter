"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { register } from '@/lib/data/auth'
import { toast } from 'sonner'
import registerFormSchema, { registerFormSchemaValues } from '@/lib/forms/register'
import { IRegion } from '@/lib/types'

type Props = {
    region: IRegion
    alreadyRegisteredLabel: string
    submitLabel: string
    loginLabel: string
    passwordConfirmLabel: string
    passwordLabel: string
    nameLabel: string
}

const RegisterForm = ({ region, loginLabel, submitLabel, alreadyRegisteredLabel, nameLabel, passwordLabel, passwordConfirmLabel }: Props) => {
    const form = useForm<registerFormSchemaValues>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            email: '',
            password: '',
            passwordConfirm: '',
            name: '',
            region: region._id
        }
    })

    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const onSubmit = async (values: registerFormSchemaValues) => {
        const [, error] = await register(values)

        if (error) toast.error(error)
    }

    const handleLoginClick = () => {
        const params = new URLSearchParams(searchParams)

        params.set("mode", "login")

        router.replace(`${pathname}?${params.toString()}`)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='w-full grid grid-cols-1 gap-5 text-left'>
                <FormField
                    name='name'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{nameLabel}</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    className="bg-white"
                                    autoFocus={true}
                                    autoComplete='given-name'
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
                                    autoComplete='new-password'
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name='passwordConfirm'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{passwordConfirmLabel}</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="password"
                                    className="bg-white"
                                    autoComplete='new-password'
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <span className='text-sm text-gray-500'>
                    {alreadyRegisteredLabel}? <button className='text-blue-500 underline' type='button' onClick={handleLoginClick}>{loginLabel}</button>
                </span>
                <Button type="submit">{submitLabel}</Button>
            </form>
        </Form>
    )
}

export default RegisterForm
