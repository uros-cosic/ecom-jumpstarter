import { STORE } from '@/lib/constants'
import { getCategories } from '@/lib/data/categories'
import { getCollections } from '@/lib/data/collections'
import { getCountryById } from '@/lib/data/countries'
import { getProducts } from '@/lib/data/products'
import { getRegions } from '@/lib/data/regions'

export default async function sitemap() {
    const regions = (await getRegions({ limit: 999 })) ?? []
    const availableCountries =
        regions?.map((region) => region.countries).flat() ?? []

    const allCountriesData = await Promise.all(
        availableCountries.map((c) => getCountryById(c))
    )

    const allCountries = allCountriesData.filter((c) => c !== null)

    const countryCodes = allCountries.map((c) => c.code.toLowerCase())

    const defaultRoutes = countryCodes
        .map((code) => {
            return [
                {
                    url: `${STORE.baseUrl}/${code}`,
                    lastModified: new Date(),
                },
                {
                    url: `${STORE.baseUrl}/${code}/categories`,
                    lastModified: new Date(),
                },
                {
                    url: `${STORE.baseUrl}/${code}/collections`,
                    lastModified: new Date(),
                },
                {
                    url: `${STORE.baseUrl}/${code}/sale`,
                    lastModified: new Date(),
                },
                {
                    url: `${STORE.baseUrl}/${code}/contact`,
                    lastModified: new Date(),
                },
                {
                    url: `${STORE.baseUrl}/${code}/login`,
                    lastModified: new Date(),
                },
                {
                    url: `${STORE.baseUrl}/${code}/policies/terms-of-use`,
                    lastModified: new Date(),
                },
                {
                    url: `${STORE.baseUrl}/${code}/policies/privacy`,
                    lastModified: new Date(),
                },
                {
                    url: `${STORE.baseUrl}/${code}/policies/refund`,
                    lastModified: new Date(),
                },
            ]
        })
        .flat()

    const categories = await getCategories({ limit: 999 })

    const categoryRoutes =
        categories
            ?.map((category) => {
                const region = regions.find((r) => r._id === category.region)

                if (!region) return null

                const countryCodes = []

                for (const id of region.countries) {
                    const country = allCountries.find((c) => c._id === id)
                    if (!country) continue

                    countryCodes.push(country.code)
                }

                return countryCodes.map((code) => ({
                    url: `${STORE.baseUrl}/${code}/categories/${category.handle}`,
                    lastModified: new Date(category.updatedAt),
                }))
            })
            .filter((c) => c !== null)
            .flat() ?? []

    const collections = await getCollections({ limit: 999 })

    const collectionRoutes =
        collections
            ?.map((collection) => {
                const region = regions.find((r) => r._id === collection.region)

                if (!region) return null

                const countryCodes = []

                for (const id of region.countries) {
                    const country = allCountries.find((c) => c._id === id)
                    if (!country) continue

                    countryCodes.push(country.code)
                }

                return countryCodes.map((code) => ({
                    url: `${STORE.baseUrl}/${code}/collections/${collection.handle}`,
                    lastModified: new Date(collection.updatedAt),
                }))
            })
            .filter((c) => c !== null)
            .flat() ?? []

    const products = await getProducts({ limit: 999 })

    const productRoutes =
        products
            ?.map((product) => {
                const region = regions.find((r) => r._id === product.region)

                if (!region) return null

                const countryCodes = []

                for (const id of region.countries) {
                    const country = allCountries.find((c) => c._id === id)
                    if (!country) continue

                    countryCodes.push(country.code)
                }

                return countryCodes.map((code) => ({
                    url: `${STORE.baseUrl}/${code}/products/${product.handle}`,
                    lastModified: new Date(product.updatedAt),
                }))
            })
            .filter((c) => c !== null)
            .flat() ?? []

    return [
        ...defaultRoutes,
        ...categoryRoutes,
        ...collectionRoutes,
        ...productRoutes,
    ]
}
