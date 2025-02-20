import EditAccountForm from "@/components/forms/edit-account"
import { getMe } from "@/lib/data/user"

const Page = async () => {
    const user = await getMe()

    return (
        <div className="w-full flex flex-col gap-5">
            <h1 className="font-[family-name:var(--font-montserrat)] font-medium text-2xl">Account</h1>
            <EditAccountForm
                user={user!}
            />
        </div>
    )
}

export default Page
