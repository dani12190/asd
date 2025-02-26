import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Dawn OMSZ Kalkulátor",
  description: "Dawn OMSZ Kalkulátor és Jelentéskezelő Rendszer",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hu">
      <head>
        {/* Add reCAPTCHA script */}
        <script src="https://www.google.com/recaptcha/api.js" async defer></script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}



import './globals.css'