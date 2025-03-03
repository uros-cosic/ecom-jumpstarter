import { columns } from "@/components/tables/columns/users"
import { DataTable } from "@/components/tables/data-table"
import { getUsers } from "@/lib/data/user"

type Props = {
    searchParams: Promise<Record<string, string>>
}

const Page = async ({ searchParams }: Props) => {
    const query = await searchParams

    const users = await getUsers(query)

    return (
        <div className="w-full flex flex-col gap-5">
            <h1 className="font-[family-name:var(--font-montserrat)] font-medium text-2xl">Users</h1>
            <DataTable
                columns={columns}
                data={users ?? []}
            />
        </div>

    )
}

export default Page
