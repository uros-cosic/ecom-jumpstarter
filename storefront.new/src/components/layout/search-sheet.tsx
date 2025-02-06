import { Search } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import SearchContainer from "./search-container"

const SearchSheet = async () => {
    const t = await getTranslations("Header.Navbar")
    const locale = await getLocale()

    return (
        <Sheet>
            <SheetTrigger className="hover:opacity-80 transition-opacity">
                <Search aria-label={t("search-label")} size={22} />
            </SheetTrigger>
            <SheetContent side="top">
                <SheetHeader>
                    <SheetTitle>
                        <span className="sr-only">{t("search-sheet-title")}</span>
                    </SheetTitle>
                    <SheetDescription>
                        <span className="sr-only">{t("search-sheet-title")}</span>
                    </SheetDescription>
                </SheetHeader>
                <SearchContainer locale={locale} searchInputLabel={t("search-input-label")} fromLabel={t("from-label")} />
            </SheetContent>
        </Sheet>

    )
}

export default SearchSheet
