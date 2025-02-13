import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

export default getRequestConfig(async () => {
    const cookieStore = await cookies()

    const locale =
        cookieStore.get('i18n')?.value ??
        cookieStore.get('i18next')?.value ??
        cookieStore.get('lng')?.value ??
        cookieStore.get('locale')?.value ??
        'en'

    return {
        locale,
        messages: (
            await import(
                `../../messages/${locale.split('-')[0].toLowerCase()}.json`
            )
        ).default,
    }
})
