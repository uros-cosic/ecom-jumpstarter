import { getCategories } from "@/lib/data/categories"
import { IProductCategory, IRegion } from "@/lib/types"
import LocalizedLink from "../localized-link"

type Props = {
    region: IRegion
}

const SiteNavigation = async ({ region }: Props) => {
    const categories = await getCategories({
        region: region._id,
        limit: 999,
    })

    if (!categories || !categories.length) return null

    const map: Record<string, IProductCategory[]> = {}

    for (const category of categories) {
        if (category.parentCategory) {
            (map[category.parentCategory] ??= []).push(category);
        }
    }

    const items = Object.keys(map).map(key => {
        const parentCategory = categories.find(c => c._id === key)

        return {
            parentCategory: parentCategory!,
            childCategories: map[key]
        }
    })

    return (
        <section className="max-w-screen-2xl w-full px-2 mx-auto">
            <ul className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {
                    items.map(item => (
                        <li key={item.parentCategory._id} className="flex flex-col gap-2 mx-auto items-center lg:mx-0 lg:items-start">
                            <LocalizedLink href={`/categories/${item.parentCategory.handle}`} className="font-[family-name:var(--font-montserrat)] text-lg font-bold uppercase hover:underline w-fit">{item.parentCategory.name}</LocalizedLink>
                            <div className="flex flex-col gap-1">
                                {
                                    item.childCategories.map(ctg => (
                                        <LocalizedLink key={ctg._id} href={`/categories/${ctg.handle}`} className="hover:underline text-gray-500 font-medium w-fit">{ctg.name}</LocalizedLink>
                                    ))
                                }
                            </div>
                        </li>
                    ))
                }
            </ul>
        </section>
    )
}

export default SiteNavigation
