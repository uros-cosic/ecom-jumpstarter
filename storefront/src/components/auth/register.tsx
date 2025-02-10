"use client"

import { IRegion } from "@/lib/types"
import RegisterForm from "../forms/register"

type Props = {
    region: IRegion
    registerLabel: string
    alreadyRegisteredLabel: string
    submitLabel: string
    loginLabel: string
    passwordConfirmLabel: string
    nameLabel: string
    passwordLabel: string
}

const Register = ({ loginLabel, alreadyRegisteredLabel, registerLabel, submitLabel, region, passwordConfirmLabel, nameLabel, passwordLabel }: Props) => {
    return (
        <div className="w-full min-h-[70vh] rounded-md bg-gray-50 border p-5 flex flex-col gap-10 items-center justify-center text-center">
            <h1 className="font-[family-name:var(--font-montserrat)] text-3xl font-medium">
                {registerLabel}
            </h1>
            <RegisterForm
                region={region}
                alreadyRegisteredLabel={alreadyRegisteredLabel}
                submitLabel={submitLabel}
                loginLabel={loginLabel}
                passwordConfirmLabel={passwordConfirmLabel}
                passwordLabel={passwordLabel}
                nameLabel={nameLabel}
            />
        </div>
    )
}

export default Register
