import { getTranslations } from "next-intl/server"
import { Separator } from "../ui/separator"
import { getMe } from "@/lib/data/user"
import ProfileInfo from "./profile-info"

const AccountProfile = async () => {
    const user = await getMe()

    const t = await getTranslations("Account")

    return (
        <div className="flex flex-col">
            <div className="flex flex-col gap-2">
                <h1 className="font-[family-name:var(--font-montserrat)] text-xl font-medium">
                    {t("profile")}
                </h1>
                <p className="text-sm text-gray-500">
                    {t("profile-description")}
                </p>
            </div>
            <Separator className="my-4" />
            <ProfileInfo
                user={user!}
                changeLabel={t("change-label")}
                cancelLabel={t("cancel-label")}
                passwordNotShownText={t("password-not-shown-text")}
                passwordLabel={t("new-password-label")}
                nameLabel={t("name-label")}
                submitLabel={t("submit-label")}
                nameChangeSuccessMessage={t("success-change-message", { field: t("name-label") })}
                emailChangeSuccessMessage={t("success-change-message", { field: 'Email' })}
                passwordChangeSuccessMessage={t("success-change-message", { field: t("password-label") })}
                passwordCurrentLabel={t("password-current-label")}
            />
        </div>
    )
}

export default AccountProfile
