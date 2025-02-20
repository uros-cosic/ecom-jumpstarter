"use client"

import { regionSchema, regionSchemaValues } from "@/lib/forms/region"
import { ICountry } from "@/lib/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { ChevronDown } from "lucide-react"
import { Separator } from "../ui/separator"
import { ScrollArea } from "../ui/scroll-area"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { createRegion } from "@/lib/data/region"
import { toast } from "sonner"

type Props = {
    countries: ICountry[]
}

const CreateRegionForm = ({ countries }: Props) => {
    const [loading, setLoading] = useState(false)
    const [filteredCountries, setFilteredCountries] = useState<ICountry[]>(countries)

    const form = useForm<regionSchemaValues>({
        resolver: zodResolver(regionSchema),
        defaultValues: {
            countries: [],
            currency: '',
            defaultLocale: '',
            name: ''
        }
    })

    const onSubmit = async (values: regionSchemaValues) => {
        setLoading(true)

        const [, err] = await createRegion(values)

        if (err) {
            toast.error(err)
            setLoading(false)
            return
        }

        toast.success('Region created')

        setLoading(false)
    }

    const currencies = useMemo(() => {
        return Array.from(new Set(countries.map(c => c.currency))).sort((a, b) => a.localeCompare(b))
    }, [countries])

    const locales = useMemo(() => {
        return Array.from(new Set(countries.map(c => c.languages).flat())).sort((a, b) => a.localeCompare(b))
    }, [countries])

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
                    name="defaultLocale"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Locale</FormLabel>
                            <FormControl>
                                <Select {...field} onValueChange={val => form.setValue('defaultLocale', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose locale" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            locales.map(locale => (
                                                <SelectItem key={locale} value={locale}>{locale}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="currency"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <FormControl>
                                <Select {...field} onValueChange={val => form.setValue('currency', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            currencies.map(currency => (
                                                <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="countries"
                    control={form.control}
                    render={() => (
                        <FormItem className="grid gap-2">
                            <FormLabel>Countries</FormLabel>
                            <FormControl>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className="w-fit">
                                            <ChevronDown />
                                            Choose countries
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Input
                                            placeholder="Search..."
                                            onChange={e => {
                                                setFilteredCountries(countries.filter(c => c.name.toLowerCase().includes(e.target.value.toLowerCase())))
                                            }}
                                        />
                                        <Separator className="mt-4" />
                                        <ScrollArea className="w-full max-h-[200px] overflow-y-auto">
                                            {filteredCountries.map(country => (
                                                <div key={country._id} className="flex gap-2 items-center text-sm">
                                                    <Checkbox
                                                        name={country._id}
                                                        id={country._id}
                                                        onCheckedChange={checked => {
                                                            if (checked) form.setValue("countries", [...form.getValues('countries'), country._id])
                                                            else form.setValue("countries", form.getValues('countries').filter(c => c !== country._id))
                                                        }}
                                                    />
                                                    <Label
                                                        htmlFor={country._id}
                                                        className="text-foreground/80 font-normal line-clamp-2 py-4 hover:underline"
                                                    >
                                                        {country.name}
                                                    </Label>
                                                </div>
                                            ))}
                                        </ScrollArea>
                                    </PopoverContent>
                                </Popover>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={loading} type="submit" className="lg:col-span-2">Create region</Button>
            </form>
        </Form>
    )
}

export default CreateRegionForm
