"use client"

import { EllipsisVertical } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { locale } from "@/lib/constants";
import { IOrder, ORDER_FULFILLMENT_STATUS, ORDER_STATUS } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { updateOrder } from "@/lib/data/order";
import { toast } from "sonner";

export const columns: ColumnDef<IOrder>[] = [

    {
        accessorKey: '_id',
        header: () => <span hidden>id</span>,
        cell: ({ row }) => <span hidden>{row.getValue('_id')}</span>
    },
    {
        accessorKey: 'status',
        header: () => <span>Status</span>,
        cell: ({ row }) => <span>{row.getValue('status')}</span>
    },
    {
        accessorKey: 'fulfillmentStatus',
        header: () => <span>Fulfillment</span>,
        cell: ({ row }) => <span>{row.getValue('fulfillmentStatus')}</span>
    },
    {
        accessorKey: 'createdAt',
        header: () => <span>Created</span>,
        cell: ({ row }) => <span>{formatDate(row.getValue('createdAt'), locale)}</span>
    },
    {
        accessorKey: 'updatedAt',
        header: () => <span>Updated</span>,
        cell: ({ row }) => <span>{formatDate(row.getValue('updatedAt'), locale)}</span>
    },
    {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
            const handleUpdate = async (values: Partial<IOrder>, id: IOrder['_id']) => {
                const [, err] = await updateOrder(values, id)

                if (err) toast.error(err)
            }

            return <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="w-fit ml-auto">
                        <EllipsisVertical size={18} />
                        <span className="sr-only">Menu</span>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                        <Link href={`/orders/${row.getValue('_id')}`}>
                            Details
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => { handleUpdate({ status: ORDER_STATUS.COMPLETED }, row.getValue("_id")) }}>
                        Mark as {ORDER_STATUS.COMPLETED}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { handleUpdate({ status: ORDER_STATUS.CANCELED }, row.getValue("_id")) }}>
                        Mark as {ORDER_STATUS.CANCELED}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => { handleUpdate({ fulfillmentStatus: ORDER_FULFILLMENT_STATUS.FULFILLED }, row.getValue("_id")) }}>
                        Mark as {ORDER_FULFILLMENT_STATUS.FULFILLED}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { handleUpdate({ fulfillmentStatus: ORDER_FULFILLMENT_STATUS.PARTIALLY_FULFILLED }, row.getValue("_id")) }}>
                        Mark as {ORDER_FULFILLMENT_STATUS.PARTIALLY_FULFILLED}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { handleUpdate({ fulfillmentStatus: ORDER_FULFILLMENT_STATUS.NOT_FULFILLED }, row.getValue("_id")) }}>
                        Mark as {ORDER_FULFILLMENT_STATUS.NOT_FULFILLED}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { handleUpdate({ fulfillmentStatus: ORDER_FULFILLMENT_STATUS.SHIPPED }, row.getValue("_id")) }}>
                        Mark as {ORDER_FULFILLMENT_STATUS.SHIPPED}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { handleUpdate({ fulfillmentStatus: ORDER_FULFILLMENT_STATUS.PARTIALLY_SHIPPED }, row.getValue("_id")) }}>
                        Mark as {ORDER_FULFILLMENT_STATUS.PARTIALLY_SHIPPED}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { handleUpdate({ fulfillmentStatus: ORDER_FULFILLMENT_STATUS.RETURNED }, row.getValue("_id")) }}>
                        Mark as {ORDER_FULFILLMENT_STATUS.RETURNED}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { handleUpdate({ fulfillmentStatus: ORDER_FULFILLMENT_STATUS.PARTIALLY_RETURNED }, row.getValue("_id")) }}>
                        Mark as {ORDER_FULFILLMENT_STATUS.PARTIALLY_RETURNED}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        }
    }
]

