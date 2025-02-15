import type { Metadata } from "next";
import { Montserrat, Roboto } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";

export const metadata: Metadata = {
    title: {
        default: "Admin",
        template: `%s | Admin`
    },
};

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

export default function RootLayout({
    children,
}: Props
) {
    return (
        <html lang="en">
            <body
                className={`${montserrat.variable} ${roboto.className} antialiased`}
            >
                {children}
                <Toaster position="top-right" />
            </body>
        </html>
    );
}
