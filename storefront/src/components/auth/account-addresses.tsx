import { getTranslations } from "next-intl/server"
import { Separator } from "../ui/separator"
import { getMyAddresses } from "@/lib/data/addresses"
import AddressesInfo from "./addresses-info"

const AccountAddresses = async () => {
    const addresses = await getMyAddresses()

    const t = await getTranslations("Account")

    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-col gap-2">
                <h1 className="font-[family-name:var(--font-montserrat)] text-xl font-medium">
                    {t("addresses")}
                </h1>
                <p className="text-sm text-gray-500">
                    {t("addresses-description")}
                </p>
            </div>
            <Separator className="my-4" />
            <AddressesInfo
                addresses={addresses}
            />
        </div>
    )
}

export default AccountAddresses
