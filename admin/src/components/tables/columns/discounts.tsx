"use client"

import { EllipsisVertical } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { locale } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { IDiscount } from "@/lib/types";
import Link from "next/link";
import { deleteDiscount } from "@/lib/data/discount";
import { toast } from "sonner";

export const columns: ColumnDef<IDiscount>[] = [
    {
        accessorKey: '_id',
        header: () => <span hidden>id</span>,
        cell: ({ row }) => <span hidden>{row.getValue('_id')}</span>
    },
    {
        accessorKey: 'code',
        header: () => <span>Code</span>,
        cell: ({ row }) => (
            <span>{row.getValue('code')}</span>
        )
    },
    {
        accessorKey: 'type',
        header: () => <span>Type</span>,
        cell: ({ row }) => <span>{row.getValue('type')}</span>
    },
    {
        accessorKey: 'usageCount',
        header: () => <span>Usages</span>,
        cell: ({ row }) => <span>{row.getValue('usageCount')}</span>
    },
    {
        accessorKey: 'usageLimit',
        header: () => <span>Limit</span>,
        cell: ({ row }) => <span>{row.getValue('usageLimit')}</span>
    },
    {
        accessorKey: 'validFrom',
        header: () => <span>From</span>,
        cell: ({ row }) => {
            const start = row.getValue('validFrom')
            const text = !start ? '/' : formatDate(start as Date, locale)

            return <span>{text}</span>
        }
    },
    {
        accessorKey: 'validTo',
        header: () => <span>To</span>,
        cell: ({ row }) => {
            const end = row.getValue('validTo')
            const text = !end ? '/' : formatDate(end as Date, locale)

            return <span>{text}</span>
        }
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
                    <Link href={`/discounts/edit/${row.getValue('_id')}`}>
                        Edit
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={async () => {
                    const [, err] = await deleteDiscount(row.getValue('_id'))

                    if (err) {
                        toast.error(err)
                        return
                    }

                    toast.success('Discount deleted')
                }}>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    }
]




