import { notFound } from "next/navigation"

import { getProductById } from "@/lib/data/product"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/utils"
import { currency, locale } from "@/lib/constants"
import Image from "next/image"

type Props = {
    params: Promise<{ id: string }>
}

const Page = async ({ params }: Props) => {
    const { id } = await params

    const product = await getProductById(id)

    if (!product) notFound()

    return (
        <div className="grid gap-10">
            <div className="grid gap-2">
                <Link href="/products" className="flex gap-1 items-center font-medium text-sm text-foreground/80 w-fit hover:underline">
                    <ArrowLeft size={16} />
                    Go back
                </Link>
                <h1 className="font-[family-name:var(--font-montserrat)] font-medium text-2xl">Product - {product._id}</h1>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Variants</TableHead>
                        <TableHead>Options</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Updated</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <div className="flex gap-2 items-center">
                                <div className="relative flex items-center justify-center h-10 w-10 rounded-md border bg-gray-50 overflow-hidden">
                                    <Image
                                        src={product.thumbnail}
                                        alt={product.name}
                                        height={50}
                                        width={50}
                                        quality={70}
                                    />
                                </div>
                                <span>{product.name}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            {product.type}
                        </TableCell>
                        <TableCell>
                            {product.variants?.length ?? '/'}
                        </TableCell>
                        <TableCell>
                            {product.options?.length ?? '/'}
                        </TableCell>
                        <TableCell>
                            {product.quantity}
                        </TableCell>
                        <TableCell>
                            {formatCurrency(locale, currency, product.price)}
                        </TableCell>
                        <TableCell>
                            {formatDate(product.createdAt, locale)}
                        </TableCell>
                        <TableCell className="text-right">
                            {formatDate(product.updatedAt, locale)}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            {!!product.variants?.length &&
                <>
                    <p className="font-medium text-xl">Variants</p>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Options</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {product.variants.map((variant, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>
                                        <div className="flex gap-2 items-center">
                                            <div className="relative flex items-center justify-center h-10 w-10 rounded-md border bg-gray-50 overflow-hidden">
                                                <Image
                                                    src={product.thumbnail}
                                                    alt={product.name}
                                                    height={50}
                                                    width={50}
                                                    quality={70}
                                                />
                                            </div>
                                            <span>{variant.title}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {variant.options.map(opt => `${opt.name}-${opt.value}`).join(', ')}
                                    </TableCell>
                                    <TableCell>
                                        {variant.quantity}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatCurrency(locale, currency, variant.price)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </>
            }
            {!!product.options?.length &&
                <>
                    <p className="font-medium text-xl">Options</p>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead className="text-right">Values</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {product.options.map((option, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>
                                        {option.name}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {option.values.join(', ')}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </>
            }
        </div>
    )
}

export default Page
