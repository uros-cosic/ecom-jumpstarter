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
        header: () => <span>Email</span>,
        cell: ({ row }) => (
            <span>{row.getValue('email')}</span>
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
        header: () => <div className="text-right">Updated</div>,
        cell: ({ row }) => <div className="text-right">{formatDate(row.getValue('updatedAt'), locale)}</div>
    }
]
