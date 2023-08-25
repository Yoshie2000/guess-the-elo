import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Provider from "@/app/_trpc/Provider";
import {Toaster} from "@/components/ui/toaster";
import {cn} from "@/lib/utils";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Guess The Elo by Yoshie2000",
  description: "Play Guess The Elo with your friends",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "dark")}>
        <Provider>
          {children}
          <Toaster/>
        </Provider>
      </body>
    </html>
  )
}
