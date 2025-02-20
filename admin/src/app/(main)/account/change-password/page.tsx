import EditPasswordForm from "@/components/forms/edit-password"

const Page = async () => {
    return (
        <div className="w-full flex flex-col gap-5">
            <h1 className="font-[family-name:var(--font-montserrat)] font-medium text-2xl">Change password</h1>
            <EditPasswordForm />
        </div>
    )
}

export default Page
