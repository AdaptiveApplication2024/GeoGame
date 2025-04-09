import "./globals.css";
import type { Metadata } from "next";
import UserContextProvider from "./userContext";


export const metadata: Metadata = {
    title: "Geographiac",
};

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="h-full w-full">
            <UserContextProvider>
                <body className="flex flex-col h-full w-full overflow-hidden">
                    {children}
                </body>
            </UserContextProvider>
        </html>
    );
}
