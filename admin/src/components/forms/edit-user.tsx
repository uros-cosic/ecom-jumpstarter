"use client"

import { userSchema, userSchemaValues } from "@/lib/forms/user"
import { IRegion, IUser, USER_ROLE } from "@/lib/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { updateUser } from "@/lib/data/user"
import { toast } from "sonner"

type Props = {
    user: IUser
    regions: IRegion[]
}

const EditUserForm = ({ user, regions }: Props) => {
    const [loading, setLoading] = useState(false)

    const form = useForm<userSchemaValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            role: user.role,
            region: user.region
        }
    })

    const onSubmit = async (values: userSchemaValues) => {
        setLoading(true)

        const [, err] = await updateUser(user._id, values)

        if (err) {
            toast.error(err)
            setLoading(false)
            return
        }

        toast.success('User updated')

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
                <FormField
                    name="role"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <FormControl>
                                <Select {...field} onValueChange={val => form.setValue('role', val)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={USER_ROLE.USER}>{USER_ROLE.USER}</SelectItem>
                                        <SelectItem value={USER_ROLE.ADMIN}>{USER_ROLE.ADMIN}</SelectItem>
                                    </SelectContent>
                                </Select>
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
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            regions.map(region => (
                                                <SelectItem key={region._id} value={region._id}>{region.name}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={loading} type='submit' className="lg:grid-cols-2">Edit user</Button>
            </form>
        </Form>
    )
}

export default EditUserForm
