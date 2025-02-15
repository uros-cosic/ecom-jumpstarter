"use client"

import { EllipsisVertical } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { locale } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { ISale } from "@/lib/types";

export const columns: ColumnDef<ISale>[] = [
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
        accessorKey: 'products',
        header: () => <span>Products</span>,
        cell: ({ row }) => <span>{(row.getValue('products') as string[]).length}</span>
    },
    {
        accessorKey: 'type',
        header: () => <span>Type</span>,
        cell: ({ row }) => <span>{row.getValue('type')}</span>
    },
    {
        accessorKey: 'startDate',
        header: () => <span>Start</span>,
        cell: ({ row }) => {
            const start = row.getValue('startDate')
            const text = !start ? '/' : formatDate(start as Date, locale)

            return <span>{text}</span>
        }
    },
    {
        accessorKey: 'endDate',
        header: () => <span>End</span>,
        cell: ({ row }) => {
            const end = row.getValue('endDate')
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



