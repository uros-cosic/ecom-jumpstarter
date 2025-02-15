"use client";

import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
}

export function DataTablePagination<TData>({
    table,
}: DataTablePaginationProps<TData>) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const handleLimitChange = (val: string) => {
        table.setPageSize(Number(val));
        const params = new URLSearchParams(searchParams);
        params.set("limit", val);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handlePageChange = (val: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", val);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="flex items-center justify-between px-2">
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Row/s per page</p>
                    <Select
                        value={searchParams.get("limit") || "10"}
                        onValueChange={handleLimitChange}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => handlePageChange("1")}
                        disabled={[null, "1"].includes(searchParams.get("page"))}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() =>
                            handlePageChange(
                                String(Number(searchParams.get("page") || 2) - 1)
                            )
                        }
                        disabled={[null, "1"].includes(searchParams.get("page"))}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() =>
                            handlePageChange(
                                String(Number(searchParams.get("page") || 1) + 1)
                            )
                        }
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight />
                    </Button>
                </div>
            </div>
        </div>
    );
}
