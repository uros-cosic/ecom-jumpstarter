import type { Metadata, Viewport } from "next";
import { Montserrat, Roboto } from "next/font/google";
import { Toaster } from "sonner";
import { getLocale } from "next-intl/server";

import { STORE } from "@/lib/constants";
import "./globals.css"
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CartSheetProvider from "@/components/cart-sheet-provider"

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
                className={`${montserrat.variable} ${roboto.className} antialiased`}
            >
                <CartSheetProvider>
                    <Header />
                    {children}
                    <Footer />
                    <Toaster position="top-right" />
                </CartSheetProvider>
            </body>
        </html>
    );
}
