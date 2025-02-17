import { notFound } from "next/navigation"

import { getOrderById } from "@/lib/data/order"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { getPaymentById } from "@/lib/data/payment"
import { formatCurrency, formatDate } from "@/lib/utils"
import { currency, locale } from "@/lib/constants"
import { getCartById } from "@/lib/data/cart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { getPaymentMethodById } from "@/lib/data/payment-method"
import { getShippingMethodById } from "@/lib/data/delivery"
import { getAddressById } from "@/lib/data/address"

type Props = {
    params: Promise<{ id: string }>
}

const Page = async ({ params }: Props) => {
    const { id } = await params

    const order = await getOrderById(id)

    if (!order) notFound()

    const cart = await getCartById(order.cart)

    if (!cart) return notFound()

    const payment = (order.payment && await getPaymentById(order.payment)) || null

    const paymentMethod = await getPaymentMethodById(cart.paymentMethod!)
    const shippingMethod = await getShippingMethodById(cart.shippingMethod!)
    const address = await getAddressById(cart.address!)

    return (
        <div className="grid gap-10">
            <div className="grid gap-2">
                <Link href="/orders" className="flex gap-1 items-center font-medium text-sm text-foreground/80 w-fit hover:underline">
                    <ArrowLeft size={16} />
                    Go back
                </Link>
                <h1 className="font-[family-name:var(--font-montserrat)] font-medium text-2xl">Order - {order._id}</h1>
            </div>
            <ul className="text-sm grid grid-cols-3 lg:grid-cols-4 gap-10">
                <li className="flex flex-col">
                    <span className="font-bold">Status</span>
                    {order.status}
                </li>
                <li className="flex flex-col">
                    <span className="font-bold">Fulfillment status</span>
                    {order.fulfillmentStatus}
                </li>
                {payment &&
                    <li className="flex flex-col">
                        <span className="font-bold">Payment status</span>
                        {payment.status}
                    </li>
                }
                <li className="flex flex-col">
                    <span className="font-bold">Created</span>
                    {formatDate(order.createdAt, locale)}
                </li>
                <li className="flex flex-col">
                    <span className="font-bold">Updated</span>
                    {formatDate(order.updatedAt, locale)}
                </li>
            </ul>
            <Separator />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Is variant?</TableHead>
                        <TableHead className="text-right">Link</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {cart.items.map((item, idx) => (
                        <TableRow key={idx}>
                            <TableCell>
                                <div className="flex gap-2 items-center">
                                    <div className="relative flex items-center justify-center h-10 w-10 rounded-md border bg-gray-50 overflow-hidden">
                                        <Image
                                            src={item.product.thumbnail}
                                            alt={item.product.name}
                                            height={50}
                                            width={50}
                                            quality={70}
                                        />
                                    </div>
                                    <span>{!item.variant ? item.product.name : item.product.variants!.find(v => v._id === item.variant)!.title}</span>
                                </div>
                            </TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>
                                {item.variant ? 'Yes' : 'No'}
                            </TableCell>
                            <TableCell className="text-right">
                                <Link href={`/products/${item.product._id}`}>
                                    <Button variant={"link"} className="p-0 text-blue-500">View product</Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Separator />
            <div className="flex items-center justify-between text-lg">
                <span className="font-medium">Total price:</span>
                <span>{formatCurrency(locale, currency, cart.totalPrice)}</span>
            </div>
            <Separator />
            <ul className="text-sm grid grid-cols-3 lg:grid-cols-5 gap-10">
                <li className="flex flex-col">
                    <span className="font-bold">Payment method</span>
                    {paymentMethod?.name ?? 'N/A'}
                </li>
                <li className="flex flex-col">
                    <span className="font-bold">Shipping method</span>
                    {shippingMethod?.name ?? 'N/A'}
                </li>
                <li className="flex flex-col">
                    <span className="font-bold">Updated</span>
                    {formatDate(cart.updatedAt, locale)}
                </li>
                {address && <>
                    <li className="flex flex-col">
                        <span className="font-bold">Address</span>
                        <span>{`${address.firstName} ${address.lastName}`}</span>
                        {!!address.company && <span>{address.company}</span>}
                        <span>{address.address}</span>
                        <span>{`${address.postalCode}, ${address.city}`}</span>
                    </li>
                    <li className="flex flex-col">
                        <span className="font-bold">Contact</span>
                        <span>{address.phone}</span>
                        <span>{cart.email}</span>
                    </li>
                </>
                }
            </ul>
        </div>
    )
}

export default Page

