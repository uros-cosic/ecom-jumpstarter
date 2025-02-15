import { LoginForm } from "@/components/forms/login"

const Page = () => {
    return (
        <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-sm">
                <LoginForm />
            </div>
        </main>
    )
}

export default Page
