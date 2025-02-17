"use client"

import { EllipsisVertical } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { locale } from "@/lib/constants";
import { IProduct, IProductVariant } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const columns: ColumnDef<IProduct>[] = [
    {
        accessorKey: '_id',
        header: () => <span hidden>id</span>,
        cell: ({ row }) => <span hidden>{row.getValue('_id')}</span>
    },
    {
        accessorKey: 'thumbnail',
        header: () => <span hidden>thumbnail</span>,
        cell: ({ row }) => <span hidden>{row.getValue('thumbnail')}</span>
    },
    {
        accessorKey: 'name',
        header: () => <span>Name</span>,
        cell: ({ row }) => (
            <div className="flex gap-2 items-center">
                <div className="relative flex items-center justify-center h-10 w-10 rounded-md border bg-gray-50 overflow-hidden">
                    <Image
                        src={row.getValue('thumbnail')}
                        alt={row.getValue('name')}
                        height={50}
                        width={50}
                        quality={70}
                    />
                </div>
                <span>{row.getValue('name')}</span>
            </div>
        )
    },
    {
        accessorKey: 'type',
        header: () => <span>Type</span>,
        cell: ({ row }) => <span>{row.getValue('type')}</span>
    },
    {
        accessorKey: 'variants',
        header: () => <span>Variants</span>,
        cell: ({ row }) => <span>{(row.getValue('variants') as IProductVariant[] | null)?.length}</span>
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
                    <Link href={`/products/${row.getValue('_id')}`}>
                        Details
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={`/products/edit/${row.getValue('_id')}`}>
                        Edit
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    }
]
