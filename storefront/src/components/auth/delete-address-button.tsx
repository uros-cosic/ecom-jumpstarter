"use client"

import { Trash } from "lucide-react"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { deleteAddress } from "@/lib/data/addresses"
import { IAddress } from "@/lib/types"

type Props = {
    addy: IAddress
    successMessage: string
    deleteLabel: string
}

const DeleteAddressButton = ({ successMessage, addy, deleteLabel }: Props) => {
    const handleDelete = async (id: string) => {
        const [, err] = await deleteAddress(id)

        if (err) {
            toast.error(err)
            return
        }

        toast.success(successMessage)
    }

    return (
        <Button
            variant={"ghost"}
            className="w-fit ml-auto py-0 px-2"
            onClick={() => handleDelete(addy._id)}
        >
            <Trash />
            {deleteLabel}
        </Button>
    )
}

export default DeleteAddressButton
