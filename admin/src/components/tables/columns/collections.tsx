"use client"

import { EllipsisVertical } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { locale } from "@/lib/constants";
import { IProductCollection } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { deleteCollection } from "@/lib/data/collection";
import { toast } from "sonner";
import Link from "next/link";

export const columns: ColumnDef<IProductCollection>[] = [
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
        accessorKey: 'keywords',
        header: () => <span>Keywords</span>,
        cell: ({ row }) => <span>{(row.getValue('keywords') as string[]).length}</span>
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
                    <Link href={`/collections/edit/${row.getValue('_id')}`}>
                        Edit
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={async () => {
                    const [, err] = await deleteCollection(row.getValue('_id'))

                    if (err) {
                        toast.error(err)
                        return
                    }

                    toast.success('Collection deleted')
                }}>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    }
]



