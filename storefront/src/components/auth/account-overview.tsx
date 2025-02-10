import { getLatestOrders } from "@/lib/data/orders"
import { getMe } from "@/lib/data/user"
import { getLocale, getTranslations } from "next-intl/server"
import { Separator } from "../ui/separator"
import { formatDate } from "@/lib/utils"
import LocalizedLink from "../localized-link"

const AccountOverview = async () => {
    const user = await getMe()

    const latestOrders = await getLatestOrders()

    const t = await getTranslations("Account")
    const locale = await getLocale()

    return (
        <div className="flex flex-col w-full">
            <div className="flex items-end justify-between gap-5">
                <h1 className="font-[family-name:var(--font-montserrat)] text-xl font-medium">
                    {t("hello-label")} {user!.name.split(" ")[0]}
                </h1>
                <p className="text-xs">{t("signed-in-as")}: <span className="font-bold">{user!.email}</span></p>
            </div>
            <Separator className="my-4" />
            <div className="flex flex-col gap-5">
                <h2 className="font-[family-name:var(--font-montserrat)] text-lg font-medium">
                    {t("recent-orders")}
                </h2>
                {
                    !!latestOrders?.length ?
                        <ul className="flex flex-col gap-3 text-xs lg:text-sm">
                            {latestOrders.map(order => (
                                <li key={order._id} className="w-full">
                                    <LocalizedLink href={`/orders/${order._id}`} className="grid grid-cols-3 gap-2 w-full rounded-md border bg-gray-100 p-2 hover:bg-gray-200">
                                        <div className="flex flex-col gap-2">
                                            <span className="font-medium">{t("order-status")}</span>
                                            <span>{order.status}</span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <span className="font-medium">{t("fulfillment-status")}</span>
                                            <span>{order.fulfillmentStatus}</span>
                                        </div>
                                        <div className="flex flex-col gap-2 justify-end text-right">
                                            <span className="font-medium">{t("date")}</span>
                                            <span>{formatDate(order.createdAt, locale)}</span>
                                        </div>
                                    </LocalizedLink>
                                </li>
                            ))}
                        </ul>
                        : <p className="py-2">{t("no-recent-orders")}</p>
                }
            </div>
        </div>
    )
}

export default AccountOverview
