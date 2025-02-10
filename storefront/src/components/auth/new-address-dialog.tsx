"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Plus } from "lucide-react"
import NewAddressForm from "../forms/new-address"
import { IUser } from "@/lib/types"

type Props = {
    createLabel: string
    dialogTitleLabel: string
    dialogDescriptionLabel: string
    firstNameLabel: string
    postalCodeLabel: string
    provinceLabel: string
    lastNameLabel: string
    companyLabel: string
    addressLabel: string
    phoneLabel: string
    cityLabel: string
    submitLabel: string
    countryLabel: string
    successMessage: string
    user: IUser
}

const NewAddressDialog = ({ user, countryLabel, createLabel, dialogTitleLabel, dialogDescriptionLabel, submitLabel, cityLabel, phoneLabel, addressLabel, companyLabel, lastNameLabel, provinceLabel, postalCodeLabel, firstNameLabel, successMessage }: Props) => {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-fit">
                    <Plus />
                    {createLabel}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{dialogTitleLabel}</DialogTitle>
                    <DialogDescription>{dialogDescriptionLabel}</DialogDescription>
                </DialogHeader>
                <NewAddressForm
                    user={user}
                    firstNameLabel={firstNameLabel}
                    postalCodeLabel={postalCodeLabel}
                    provinceLabel={provinceLabel}
                    lastNameLabel={lastNameLabel}
                    companyLabel={companyLabel}
                    addressLabel={addressLabel}
                    phoneLabel={phoneLabel}
                    cityLabel={cityLabel}
                    submitLabel={submitLabel}
                    setOpen={setOpen}
                    successMessage={successMessage}
                    countryLabel={countryLabel}
                />
            </DialogContent>
        </Dialog>
    )
}

export default NewAddressDialog
