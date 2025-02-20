"use client"

import { saleSchema, saleSchemaValues } from "@/lib/forms/sale"
import { IProduct, IRegion, ISale, SALE_TYPE } from "@/lib/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { ScrollArea } from "../ui/scroll-area"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"
import { ChevronDown } from "lucide-react"
import { Separator } from "../ui/separator"
import DatePicker from "../date-picker"
import DropFileInput from "../drop-file-input"
import { toast } from "sonner"
import { updateSale, uploadThumbnail } from "@/lib/data/sale"
import Image from "next/image"

type Props = {
    regions: IRegion[]
    products: IProduct[]
    sale: ISale
}

const EditSaleForm = ({ sale, regions, products }: Props) => {
    const [loading, setLoading] = useState(false)
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>(products)
    const [type, setType] = useState<SALE_TYPE>(sale.type)
    const [thumbnail, setThumbnail] = useState<File>()

    const form = useForm<saleSchemaValues>({
        resolver: zodResolver(saleSchema),
        defaultValues: {
            name: sale.name,
            type: sale.type,
            products: sale.products,
            region: sale.region,
            thumbnail: sale.thumbnail,
            discountAmount: sale.discountAmount ?? undefined,
            discountPercentage: sale.discountPercentage ?? undefined,
            endDate: sale.endDate ?? undefined,
            startDate: sale.startDate ?? undefined,
            metadata: sale.metadata
        }
    })

    const onSubmit = async (values: saleSchemaValues) => {
        setLoading(true)

        const newValues = { ...values, }

        if (thumbnail) {
            const formData = new FormData()
            formData.append('thumbnail', thumbnail)

            const [url, thumbnailErr] = await uploadThumbnail(formData)

            if (thumbnailErr) {
                toast.error(thumbnailErr)
                setLoading(false)
                return
            }

            newValues.thumbnail = url!
        }

        const [, err] = await updateSale(sale._id, newValues)

        if (err) {
            toast.error(err)
            setLoading(false)
            return
        }

        toast.success('Sale updated')

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
                    name="type"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <FormControl>
                                <Select {...field} onValueChange={val => {
                                    form.setValue('type', val)
                                    setType(val as SALE_TYPE)
                                }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={SALE_TYPE.FIXED}>{SALE_TYPE.FIXED}</SelectItem>
                                        <SelectItem value={SALE_TYPE.PERCENTAGE}>{SALE_TYPE.PERCENTAGE}</SelectItem>
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
                                        <SelectValue placeholder="Choose region" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {regions.map(region => (
                                            <SelectItem key={region._id} value={region._id}>{region.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {
                    type === SALE_TYPE.FIXED && (
                        <FormField
                            name="discountAmount"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount amount</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            min={0}
                                            required
                                            onChange={e => {
                                                form.setValue('discountAmount', Number(e.target.value || 0))
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )
                }
                {
                    type === SALE_TYPE.PERCENTAGE && (
                        <FormField
                            name="discountPercentage"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount percentage</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            min={0}
                                            max={1}
                                            step={".01"}
                                            required
                                            onChange={e => {
                                                form.setValue('discountPercentage', Number(e.target.value || 0))
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )
                }
                <FormField
                    name="startDate"
                    control={form.control}
                    render={() => (
                        <FormItem className="grid gap-2">
                            <FormLabel>Start date</FormLabel>
                            <FormControl>
                                <DatePicker
                                    onChange={val => form.setValue('startDate', new Date(val as string))}
                                    defaultValue={sale.startDate ?? undefined}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="endDate"
                    control={form.control}
                    render={() => (
                        <FormItem className="grid gap-2">
                            <FormLabel>End date</FormLabel>
                            <FormControl>
                                <DatePicker
                                    onChange={val => form.setValue('endDate', new Date(val as string))}
                                    defaultValue={sale.endDate ?? undefined}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="products"
                    control={form.control}
                    render={() => (
                        <FormItem className="grid gap-2">
                            <FormLabel>Product on sale</FormLabel>
                            <FormControl>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className="w-fit">
                                            <ChevronDown />
                                            Choose products
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Input
                                            placeholder="Search..."
                                            onChange={e => {
                                                setFilteredProducts(products.filter(p => p.name.toLowerCase().includes(e.target.value.toLowerCase())))
                                            }}
                                        />
                                        <Separator className="mt-4" />
                                        <ScrollArea className="w-full max-h-[200px] overflow-y-auto">
                                            {filteredProducts.map(product => (
                                                <div key={product._id} className="flex gap-2 items-center text-sm">
                                                    <Checkbox
                                                        name={product._id}
                                                        id={product._id}
                                                        onCheckedChange={checked => {
                                                            if (checked) form.setValue("products", [...form.getValues('products'), product._id])
                                                            else form.setValue("products", form.getValues('products').filter(p => p !== product._id))
                                                        }}
                                                        defaultChecked={sale.products.includes(product._id)}
                                                    />
                                                    <Label
                                                        htmlFor={product._id}
                                                        className="text-foreground/80 font-normal line-clamp-2 py-4 hover:underline"
                                                    >
                                                        {product.name}
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
                <FormField
                    name="thumbnail"
                    control={form.control}
                    render={() => (
                        <FormItem className="lg:col-span-2">
                            <FormLabel>Thumbnail</FormLabel>
                            <DropFileInput
                                type={"single"}
                                accept={"image/png, image/jpeg, image/webp"}
                                onFileChange={(values) => setThumbnail((values as File[])[0])}
                            />
                            {!thumbnail &&
                                <div className="relative flex items-center justify-center h-16 w-16 rounded-md border bg-gray-50 overflow-hidden">
                                    <Image
                                        src={sale.thumbnail}
                                        alt={sale.name}
                                        height={64}
                                        width={64}
                                        quality={70}
                                    />
                                </div>
                            }
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="lg:col-span-2" disabled={loading}>Update sale</Button>
            </form>
        </Form>
    )
}

export default EditSaleForm

