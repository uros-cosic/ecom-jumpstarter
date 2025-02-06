import type { Metadata, Viewport } from "next";
import { Montserrat, Roboto } from "next/font/google";

import { STORE } from "@/lib/constants";
import "./globals.css"
import { getLocale } from "next-intl/server";
import Header from "@/components/layout/header";

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#ffffff"
};

export const generateMetadata = async (): Promise<Metadata> => {
    const locale = await getLocale();

    return {
        metadataBase: new URL(STORE.baseUrl),
        title: {
            default: STORE.name,
            template: `%s | ${STORE.name}`
        },
        applicationName: STORE.name,
        appleWebApp: {
            title: STORE.name,
            statusBarStyle: 'default',
            capable: true
        },
        openGraph: {
            siteName: STORE.name,
            type: 'website',
            locale
        }
    }
}

const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin"],
});

const roboto = Roboto({
    variable: "--font-roboto",
    subsets: ["latin"],
    weight: ["100", "300", "400", "500", "700", "900"]
});

type Props = {
    children: Readonly<React.ReactNode>,
}

export default async function RootLayout({
    children,
}: Props
) {
    const locale = await getLocale();

    return (
        <html lang={locale}>
            <body
                className={`${montserrat.variable} ${roboto.className} antialiased pt-16`}
            >
                <Header />
                {children}
            </body>
        </html>
    );
}
