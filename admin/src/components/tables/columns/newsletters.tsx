"use client"

import { EllipsisVertical } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { locale } from "@/lib/constants";
import { INewsletter } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export const columns: ColumnDef<INewsletter>[] = [
    {
        accessorKey: '_id',
        header: () => <span hidden>id</span>,
        cell: ({ row }) => <span hidden>{row.getValue('_id')}</span>
    },
    {
        accessorKey: 'email',
        header: () => <span>Name</span>,
        cell: ({ row }) => (
            <span>{row.getValue('name')}</span>
        )
    },
    {
        accessorKey: 'active',
        header: () => <span>Active</span>,
        cell: ({ row }) => {
            const active = !!row.getValue('active')

            return <span>{active ? 'Yes' : 'No'}</span>
        }
    },
    {
        accessorKey: 'canceledAt',
        header: () => <span>Canceled</span>,
        cell: ({ row }) => {
            const canceledAt = row.getValue('canceledAt')

            const text = !canceledAt ? '/' : formatDate(canceledAt as Date, locale)

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



