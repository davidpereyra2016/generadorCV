import type {Metadata} from "next";

import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "Generador de CV ",
  description: "Generador de CVs con Next.js y Mercado Pago",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html
      className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
      lang="es"
    >
      <body className="container mx-auto grid min-h-screen w-full grid-rows-[auto,1fr,auto] px-4 font-sans text-gray-800 antialiased dark:text-gray-100">
        <header className="mt-4 flex items-center justify-between rounded-lg bg-white/30 px-6 backdrop-blur-sm dark:bg-black/30">
          <Link className="text-xl font-bold leading-[4rem]" href="/">
            Generador de CV
          </Link>
        </header>
        <main className="my-4 rounded-lg bg-white/40 px-6 py-8 shadow-xl backdrop-blur-sm dark:bg-black/40">
          {children}
        </main>
        <footer className="py-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {new Date().getFullYear()} Generador de CV
        </footer>
      </body>
    </html>
  );
}
