"use client"

import { IRegion } from "@/lib/types"
import { useSearchParams } from "next/navigation"
import LogIn from "./login"
import Register from "./register"

type Props = {
    region: IRegion
    loginLabel: string
    passwordLabel: string
    submitLabel: string
    noAccountLabel: string
    registerLabel: string
    alreadyRegisteredLabel: string
    passwordConfirmLabel: string
    nameLabel: string
}

const AuthTemplate = ({ region, loginLabel, submitLabel, passwordLabel, noAccountLabel, registerLabel, alreadyRegisteredLabel, nameLabel, passwordConfirmLabel }: Props) => {
    const params = useSearchParams()

    return (
        <div className="max-w-xl mx-auto w-full">
            {params.get('mode') === 'register' ?
                <Register
                    region={region}
                    registerLabel={registerLabel}
                    alreadyRegisteredLabel={alreadyRegisteredLabel}
                    submitLabel={submitLabel}
                    loginLabel={loginLabel}
                    passwordLabel={passwordLabel}
                    passwordConfirmLabel={passwordConfirmLabel}
                    nameLabel={nameLabel}
                />
                :
                <LogIn
                    loginLabel={loginLabel}
                    submitLabel={submitLabel}
                    passwordLabel={passwordLabel}
                    noAccountLabel={noAccountLabel}
                    registerLabel={registerLabel}
                />}
        </div>
    )
}

export default AuthTemplate
