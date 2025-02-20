"use client";

import React from "react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { handleDownload } from "@/lib/data/newsletter";
import { toast } from "sonner";

const DownloadDropdown = () => {
    const handleDownloadClick = async (format: "txt" | "csv") => {
        const [url, err] = await handleDownload(format);

        if (err) {
            toast.error(err)
            return
        }

        const link = document.createElement("a");

        link.href = url!
        link.target = "_blank"
        link.setAttribute("download", `newsletter_emails.${format}`)

        document.body.appendChild(link)

        link.click()
        link.remove()
        return

    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"outline"} className="flex gap-2 items-center">
                    <Download />
                    <span>Mail list</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem
                    className="flex gap-2 items-center"
                    onClick={() => handleDownloadClick("csv")}
                >
                    <Download />
                    <span>as CSV</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="flex gap-2 items-center"
                    onClick={() => handleDownloadClick("txt")}
                >
                    <Download />
                    <span>as TXT</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default DownloadDropdown;
