"use client"

import { EllipsisVertical } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { currency, locale } from "@/lib/constants";
import { IShippingMethod } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { deleteShippingMethod } from "@/lib/data/delivery";
import { toast } from "sonner";

export const columns: ColumnDef<IShippingMethod>[] = [
    {
        accessorKey: '_id',
        header: () => <span hidden>id</span>,
        cell: ({ row }) => <span hidden>{row.getValue('_id')}</span>
    },
    {
        accessorKey: 'name',
        header: () => <span>Name</span>,
        cell: ({ row }) => (
            <span>{row.getValue('name')}</span>
        )
    },
    {
        accessorKey: 'cost',
        header: () => <span>Cost</span>,
        cell: ({ row }) => <span>{formatCurrency(locale, currency, row.getValue('cost'))}</span>
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
        cell: ({ row }) => <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="w-fit ml-auto">
                    <EllipsisVertical size={18} />
                    <span className="sr-only">Menu</span>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem asChild>
                    <Link href={`/delivery/edit/${row.getValue('_id')}`}>
                        Edit
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={async () => {
                    const [, err] = await deleteShippingMethod(row.getValue('_id'))

                    if (err) {
                        toast.error(err)
                        return
                    }

                    toast.success('Delivery method deleted')
                }}>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    }
]




