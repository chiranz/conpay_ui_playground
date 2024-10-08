import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import ClientThemeWrapper from "@/components/ClientThemeWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Web3 Escrow Dapp",
  description: "A decentralized escrow application",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientThemeWrapper>
          <div className="flex flex-col min-h-screen">
            <NavbarWrapper />
            <main className="container flex-grow px-4 py-8 mx-auto">{children}</main>
            <footer className="py-4 text-sm text-center text-gray-400 bg-gray-800 bg-opacity-50">
              © 2023 Web3 Escrow Dapp. All rights reserved.
            </footer>
          </div>
        </ClientThemeWrapper>
      </body>
    </html>
  );
}
