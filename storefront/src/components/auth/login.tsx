import LogInForm from "../forms/log-in"

type Props = {
    loginLabel: string
    passwordLabel: string
    submitLabel: string
    noAccountLabel: string
    registerLabel: string
}

const LogIn = ({ loginLabel, passwordLabel, submitLabel, noAccountLabel, registerLabel }: Props) => {
    return (
        <div className="w-full min-h-[70vh] rounded-md bg-gray-50 border p-5 flex flex-col gap-10 items-center justify-center text-center">
            <h1 className="font-[family-name:var(--font-montserrat)] text-3xl font-medium">
                {loginLabel}
            </h1>
            <LogInForm
                passwordLabel={passwordLabel}
                submitLabel={submitLabel}
                noAccountLabel={noAccountLabel}
                registerLabel={registerLabel}
            />
        </div>
    )
}

export default LogIn
