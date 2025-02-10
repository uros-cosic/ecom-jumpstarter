"use client"

import { useState } from "react"

import { IUser } from "@/lib/types"
import { Separator } from "../ui/separator"
import { Button } from "../ui/button"
import NameChangeForm from "../forms/name-change"
import EmailChangeForm from "../forms/email-change"
import PasswordChangeForm from "../forms/password-change"

type Props = {
    user: IUser
    nameLabel: string
    passwordLabel: string
    passwordNotShownText: string
    cancelLabel: string
    changeLabel: string
    submitLabel: string
    nameChangeSuccessMessage: string
    passwordChangeSuccessMessage: string
    emailChangeSuccessMessage: string
    passwordCurrentLabel: string
}

const ProfileInfo = ({ user, nameLabel, passwordLabel, passwordNotShownText, cancelLabel, changeLabel, submitLabel, nameChangeSuccessMessage, emailChangeSuccessMessage, passwordChangeSuccessMessage, passwordCurrentLabel }: Props) => {
    const [nameChangeActive, setNameChangeActive] = useState(false)
    const [emailChangeActive, setEmailChangeActive] = useState(false)
    const [passwordChangeActive, setPasswordChangeActive] = useState(false)

    return (
        <div className="flex flex-col gap-3 py-5">
            <div className="flex justify-between items-end gap-2">
                <div className="flex flex-col text-xs gap-2">
                    <span>{nameLabel}</span>
                    <span className="text-sm font-medium">{user.name}</span>
                </div>
                <Button variant={"outline"} type="button" onClick={() => setNameChangeActive(prev => !prev)}>
                    {nameChangeActive ? cancelLabel : changeLabel}
                </Button>
            </div>
            {nameChangeActive &&
                <NameChangeForm
                    className="py-3"
                    nameLabel={nameLabel}
                    submitLabel={submitLabel}
                    nameChangeSuccessMessage={nameChangeSuccessMessage}
                />}
            <Separator />
            <div className="flex justify-between items-end gap-2">
                <div className="flex flex-col text-xs gap-2">
                    <span>Email</span>
                    <span className="text-sm font-medium">{user.email}</span>
                </div>
                <Button variant={"outline"} type="button" onClick={() => setEmailChangeActive(prev => !prev)}>
                    {emailChangeActive ? cancelLabel : changeLabel}
                </Button>
            </div>
            {emailChangeActive &&
                <EmailChangeForm
                    className="py-3"
                    submitLabel={submitLabel}
                    emailChangeSuccessMessage={emailChangeSuccessMessage}
                />}
            <Separator />
            <div className="flex justify-between items-end gap-2">
                <div className="flex flex-col text-xs gap-2">
                    <span>{passwordLabel}</span>
                    <span className="text-sm">{passwordNotShownText}</span>
                </div>
                <Button variant={"outline"} type="button" onClick={() => setPasswordChangeActive(prev => !prev)}>
                    {passwordChangeActive ? cancelLabel : changeLabel}
                </Button>
            </div>
            {passwordChangeActive &&
                <PasswordChangeForm
                    className="py-3 w-fit"
                    passwordLabel={passwordLabel}
                    passwordCurrentLabel={passwordCurrentLabel}
                    passwordChangeSuccessMessage={passwordChangeSuccessMessage}
                    submitLabel={submitLabel}
                />
            }
        </div>
    )
}

export default ProfileInfo
