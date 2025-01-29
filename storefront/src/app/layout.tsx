import { Montserrat, Roboto } from "next/font/google";
import type { Metadata } from "next";

import "./globals.css";
import { BASE_URL, STORE_NAME } from "@/lib/constants";

const montserratFont = Montserrat({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
    variable: "--font-montserrat",
    subsets: ["latin"],
});

const robotoFont = Roboto({
    weight: ["100", "300", "400", "500", "700", "900"],
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    title: {
        default: STORE_NAME,
        template: `%s | ${STORE_NAME}`
    },
    description: "Description",
    twitter: {
        card: 'summary_large_image'
    },
    openGraph: {
        title: STORE_NAME,
        description: 'Description'
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${robotoFont.className} ${montserratFont.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
