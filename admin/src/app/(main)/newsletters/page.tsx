import { columns } from "@/components/tables/columns/newsletters"
import { DataTable } from "@/components/tables/data-table"
import { getNewsletters } from "@/lib/data/newsletter"

type Props = {
    searchParams: Promise<Record<string, string>>
}

const Page = async ({ searchParams }: Props) => {
    const query = await searchParams

    const newsletters = await getNewsletters(query)

    return (
        <div className="w-full flex flex-col gap-5">
            <h1 className="font-[family-name:var(--font-montserrat)] font-medium text-2xl">Newsletters</h1>
            <DataTable
                columns={columns}
                data={newsletters ?? []}
            />
        </div>

    )
}

export default Page



