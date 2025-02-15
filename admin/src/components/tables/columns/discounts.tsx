"use client"

import { EllipsisVertical } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { locale } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { IDiscount } from "@/lib/types";

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
            const end = row.getValue('validrTo')
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
                <DropdownMenuItem>
                    Details
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    }
]




