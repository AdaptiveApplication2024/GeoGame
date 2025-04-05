import type { Metadata } from "next";
import "./globals.css";

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
      <body className="flex flex-col h-full w-full overflow-hidden">
        <div className="flex h-18 bg-[#EFEBCE] p-2 border-b-1 border-black/50">
          <h1 className="text-5xl text-[#EFEBCE] drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)]">Geographiac</h1>
        </div>
        {children}
      </body>
    </html>
  );
}
