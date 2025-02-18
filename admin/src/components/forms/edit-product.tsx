"use client"

import { productOptionsSchemaValues, productSchema, productSchemaValues, productVariantSchemaValues } from "@/lib/forms/product"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { IProduct, IProductCategory, IProductCollection, IRegion, PRODUCT_TYPE } from "@/lib/types"
import DropFileInput from "../drop-file-input"
import { useEffect, useState } from "react"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Plus } from "lucide-react"
import { Badge } from "../ui/badge"
import { updateProduct, uploadImages, uploadThumbnail } from "@/lib/data/product"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import TextEditor from "../text-editor"
import Image from "next/image"

type Props = {
    product: IProduct
    regions: IRegion[]
    categories: IProductCategory[]
    collections: IProductCollection[]
}

const EditProductForm = ({ product, regions, categories, collections }: Props) => {
    const [loading, setLoading] = useState(false)
    const [options, setOptions] = useState<productOptionsSchemaValues[]>(product.options ?? [])
    const [variants, setVariants] = useState<productVariantSchemaValues[]>(product.variants as productVariantSchemaValues[] ?? [])

    const [thumbnail, setThumbnail] = useState<File>()
    const [images, setImages] = useState<File[]>([])
    const [dialogOption, setDialogOption] = useState<productOptionsSchemaValues>({ name: '', values: [] })
    const [dialogVariant, setDialogVariant] = useState<productVariantSchemaValues>({ title: '', options: [], quantity: 1, price: 0 })

    const router = useRouter()

    const form = useForm<productSchemaValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: product.name,
            description: product.description,
            type: product.type,
            thumbnail: product.thumbnail,
            images: product.images,
            region: product.region,
            price: product.price,
            quantity: product.quantity,
            details: product.details ?? undefined,
            keywords: product.keywords,
            metadata: product.metadata,
            options: product.options ?? undefined,
            productCategory: product.productCategory ?? undefined,
            productCollection: product.productCollection ?? undefined,
            sizeGuide: product.sizeGuide ?? undefined,
            variants: product.variants as productVariantSchemaValues[] ?? undefined
        }
    })

    const onSubmit = async (values: productSchemaValues) => {
        setLoading(true)

        const newValues = { ...values }

        if (thumbnail) {
            const thumbnailFormData = new FormData()
            thumbnailFormData.append('thumbnail', thumbnail!)

            const [thumbnailUrl, thumbnailErr] = await uploadThumbnail(thumbnailFormData)

            if (thumbnailErr) {
                toast.error(thumbnailErr)
                setLoading(false)
                return
            }

            newValues.thumbnail = thumbnailUrl!
        }

        if (images.length) {
            const imagesFormData = new FormData()
            for (const img of images) imagesFormData.append('images', img)

            const [imageUrls, imgErr] = await uploadImages(imagesFormData)

            if (imgErr) {
                toast.error(imgErr)
                setLoading(false)
                return
            }

            newValues.images = imageUrls!
        }

        const [data, err] = await updateProduct(product._id, newValues)

        if (err) {
            toast.error(err)
            setLoading(false)
            return
        }

        toast('Product updated', {
            action: {
                label: 'Review',
                onClick: () => { router.push(`/products/${data!._id}`) }
            }
        })

        setLoading(false)
    }

    useEffect(() => {
        if (options.length) form.setValue("options", options)
    }, [options])

    useEffect(() => {
        if (variants.length) form.setValue("variants", variants)
    }, [variants])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-4 gap-5">
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
                                    required
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    required
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
                                <Select {...field} onValueChange={val => form.setValue('type', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={PRODUCT_TYPE.PRODUCT}>{PRODUCT_TYPE.PRODUCT}</SelectItem>
                                        <SelectItem value={PRODUCT_TYPE.DIGITAL}>{PRODUCT_TYPE.DIGITAL}</SelectItem>
                                        <SelectItem value={PRODUCT_TYPE.SERVICE}>{PRODUCT_TYPE.SERVICE}</SelectItem>
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
                <FormField
                    name="price"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="number"
                                    min={0}
                                    required
                                    onChange={e => {
                                        form.setValue('price', Number(e.target.value || 0))
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="quantity"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type="number"
                                    min={1}
                                    required
                                    onChange={e => {
                                        form.setValue('quantity', Number(e.target.value || 0))
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="keywords"
                    control={form.control}
                    render={() => (
                        <FormItem>
                            <FormLabel>Keywords</FormLabel>
                            <FormControl>
                                <Input
                                    defaultValue={form.getValues("keywords")?.join(', ')}
                                    onChange={e => {
                                        form.setValue('keywords', e.target.value.split(',').map(w => w.trim()))
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="productCategory"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                                <Select {...field} onValueChange={val => form.setValue('productCategory', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(category => (
                                            <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="productCollection"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Collection</FormLabel>
                            <FormControl>
                                <Select {...field} onValueChange={val => form.setValue('productCollection', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose collection" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {collections.map(collection => (
                                            <SelectItem key={collection._id} value={collection._id}>{collection.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="thumbnail"
                    control={form.control}
                    render={() => (
                        <FormItem className="lg:col-span-4">
                            <FormLabel>Thumbnail</FormLabel>
                            <DropFileInput
                                type={"single"}
                                accept={"image/png, image/jpeg, image/webp"}
                                onFileChange={(values) => setThumbnail((values as File[])[0])}
                            />
                            {!thumbnail &&
                                <div className="relative flex items-center justify-center h-16 w-16 rounded-md border bg-gray-50 overflow-hidden">
                                    <Image
                                        src={product.thumbnail}
                                        alt={product.name}
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
                <FormField
                    name="images"
                    control={form.control}
                    render={() => (
                        <FormItem className="lg:col-span-4">
                            <FormLabel>Images</FormLabel>
                            <DropFileInput
                                type={"multiple"}
                                accept={"image/png, image/jpeg, image/webp"}
                                onFileChange={(values) => setImages(values as File[])}
                            />
                            {!images.length &&
                                <div className="flex flex-wrap gap-2">
                                    {
                                        product.images.map((img, idx) => (
                                            <div key={idx} className="relative flex items-center justify-center h-16 w-16 rounded-md border bg-gray-50 overflow-hidden">
                                                <Image
                                                    src={img}
                                                    alt={product.name}
                                                    height={64}
                                                    width={64}
                                                    quality={70}
                                                />
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="lg:col-span-4 flex flex-col gap-3">
                    <Label>Options</Label>
                    <div className="w-full grid grid-cols-4 gap-3">
                        {options.map(option => (
                            <div key={option.name} className="flex flex-col gap-2 text-sm">
                                <span className="font-medium">{option.name}</span>
                                <span className="text-foreground/80">{option.values.join(', ')}</span>
                            </div>
                        ))}
                    </div>
                    <Dialog onOpenChange={() => setDialogOption({ name: '', values: [] })}>
                        <DialogTrigger asChild>
                            <Button type="button" variant={"ghost"}>
                                <Plus />
                                <span>Add option</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add option</DialogTitle>
                                <DialogDescription>Create product option that will be used for variants</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <Label>Name</Label>
                                    <Input
                                        placeholder="Option name"
                                        onChange={e => setDialogOption(prev => ({ ...prev, name: e.target.value.trim() }))}
                                    />
                                </div>
                                <div>
                                    <Label>Comma separated values</Label>
                                    <Input
                                        placeholder="Option values"
                                        onChange={e => setDialogOption(prev => ({ ...prev, values: e.target.value.split(',').map(val => val.trim()) }))}
                                    />
                                </div>
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        disabled={!dialogOption.name || !dialogOption.values.length}
                                        onClick={() => { setOptions(prev => [...prev, dialogOption]) }}
                                    >
                                        Add
                                    </Button>
                                </DialogClose>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="lg:col-span-4 flex flex-col gap-3">
                    <Label>Variants</Label>
                    <div className="w-full grid grid-cols-4 gap-3">
                        {variants.map(variant => (
                            <div key={variant.title} className="font-medium text-sm">
                                {variant.title}
                            </div>
                        ))}
                    </div>
                    <Dialog onOpenChange={() => setDialogVariant({ title: '', options: [], quantity: 1, price: 0 })}>
                        <DialogTrigger asChild>
                            <Button type="button" variant={"ghost"}>
                                <Plus />
                                <span>Add variant</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add variant</DialogTitle>
                                <DialogDescription>Create product variant based on options</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <Label>Title</Label>
                                    <Input
                                        placeholder="Variant title"
                                        onChange={e => setDialogVariant(prev => ({ ...prev, title: e.target.value.trim() }))}
                                    />
                                </div>
                                <div>
                                    <Label>Quantity</Label>
                                    <Input
                                        onChange={e => setDialogVariant(prev => ({ ...prev, quantity: +e.target.value }))}
                                        type="number"
                                        min={1}
                                        defaultValue={1}
                                    />
                                </div>
                                <div>
                                    <Label>Price</Label>
                                    <Input
                                        onChange={e => setDialogVariant(prev => ({ ...prev, price: +e.target.value }))}
                                        type="number"
                                        min={0}
                                        defaultValue={0}
                                    />
                                </div>
                                <div>
                                    <Label>Options</Label>
                                    {!!dialogVariant.options.length &&
                                        <div className="flex gap-2 flex-wrap text-sm font-medium py-2">
                                            {dialogVariant.options.map((opt, idx) => (
                                                <Badge variant="secondary" key={idx}>{opt.name}: {opt.value}</Badge>
                                            ))}
                                        </div>
                                    }
                                    <div className="flex gap-3">
                                        <Select value={dialogVariant.options.find(o => o.value === '')?.name || ''} onValueChange={val => setDialogVariant(prev => ({ ...prev, options: [...prev.options, { name: val, value: '' }] }))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose option" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {options.map(option => (
                                                    <SelectItem key={option.name} value={option.name}>
                                                        {option.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {dialogVariant.options.some(o => o.value === '') &&
                                            <Select onValueChange={val => {
                                                setDialogVariant(prev => ({ ...prev, options: prev.options.map(o => o.value === '' ? { ...o, value: val } : o) }))
                                            }}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choose value" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {options
                                                        .find(opt => opt.name === dialogVariant.options.find(o => o.value === '')!.name)!
                                                        .values
                                                        .map(val => (
                                                            <SelectItem key={val} value={val}>{val}</SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                        }
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <Label>SKU</Label>
                                        <Input
                                            placeholder="SKU"
                                            onChange={e => setDialogVariant(prev => ({ ...prev, sku: e.target.value.trim() }))}
                                        />
                                    </div>
                                    <div>
                                        <Label>Barcode</Label>
                                        <Input
                                            placeholder="Barcode"
                                            onChange={e => setDialogVariant(prev => ({ ...prev, barcode: e.target.value.trim() }))}
                                        />
                                    </div>
                                    <div>
                                        <Label>EAN</Label>
                                        <Input
                                            placeholder="EAN"
                                            onChange={e => setDialogVariant(prev => ({ ...prev, ean: e.target.value.trim() }))}
                                        />
                                    </div>
                                    <div>
                                        <Label>HS Code</Label>
                                        <Input
                                            placeholder="HS Code"
                                            onChange={e => setDialogVariant(prev => ({ ...prev, hsCode: e.target.value.trim() }))}
                                        />
                                    </div>
                                    <div>
                                        <Label>Mid Code</Label>
                                        <Input
                                            placeholder="Mid Code"
                                            onChange={e => setDialogVariant(prev => ({ ...prev, midCode: e.target.value.trim() }))}
                                        />
                                    </div>
                                    <div>
                                        <Label>UPC</Label>
                                        <Input
                                            placeholder="UPC"
                                            onChange={e => setDialogVariant(prev => ({ ...prev, upc: e.target.value.trim() }))}
                                        />
                                    </div>
                                    <div>
                                        <Label>Origin Country</Label>
                                        <Input
                                            placeholder="Origin country"
                                            onChange={e => setDialogVariant(prev => ({ ...prev, originCountry: e.target.value.trim() }))}
                                        />
                                    </div>
                                    <div>
                                        <Label>Height</Label>
                                        <Input
                                            placeholder="Height"
                                            onChange={e => setDialogVariant(prev => ({ ...prev, height: e.target.value.trim() }))}
                                        />
                                    </div>
                                    <div>
                                        <Label>Width</Label>
                                        <Input
                                            placeholder="Width"
                                            onChange={e => setDialogVariant(prev => ({ ...prev, width: e.target.value.trim() }))}
                                        />
                                    </div>
                                    <div>
                                        <Label>Weight</Label>
                                        <Input
                                            placeholder="Weight"
                                            onChange={e => setDialogVariant(prev => ({ ...prev, weight: e.target.value.trim() }))}
                                        />
                                    </div>
                                    <div>
                                        <Label>Length</Label>
                                        <Input
                                            placeholder="Length"
                                            onChange={e => setDialogVariant(prev => ({ ...prev, length: e.target.value.trim() }))}
                                        />
                                    </div>
                                    <div>
                                        <Label>Material</Label>
                                        <Input
                                            placeholder="Material"
                                            onChange={e => setDialogVariant(prev => ({ ...prev, material: e.target.value.trim() }))}
                                        />
                                    </div>
                                </div>
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        disabled={!dialogVariant.title || !dialogVariant.options.filter(o => !!o.value).length}
                                        onClick={() => { setVariants(prev => [...prev, { ...dialogVariant, options: dialogVariant.options.filter(o => !!o.value) }]) }}
                                    >
                                        Add
                                    </Button>
                                </DialogClose>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="lg:col-span-4">
                    <Label>Details</Label>
                    <TextEditor
                        markdown={product.detailsMarkdown ?? ''}
                        onChange={val => form.setValue('details', val)}
                    />
                </div>
                <Button disabled={loading} className="lg:col-span-4">Update product</Button>
            </form>
        </Form>
    )
}

export default EditProductForm

