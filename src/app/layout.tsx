import type {Metadata} from "next";
import { Inter, Roboto_Mono } from 'next/font/google';
import "./globals.css";
import {ThemeProvider} from "next-themes";
import StoreProvider from "@/store/store-provider";
import {Toaster} from "sonner"

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
  })
  
  const robotoMono = Roboto_Mono({
    subsets: ['latin'],
    variable: '--font-roboto-mono',
  })

export const metadata: Metadata = {
    title: "IPZE education system",
    description: "IPZE education system",
    icons: {
        icon: "/logo.svg",
    },
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={`${inter.variable} ${robotoMono.variable}`}
        >
        <StoreProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                    {children}
                <Toaster richColors expand={true}/>
            </ThemeProvider>
        </StoreProvider>
        </body>
        </html>
    );
}
