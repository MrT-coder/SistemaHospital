import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '../components/ui/sonner'
import Navbar from './navbar'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sistema Hospital',
  description: 'Sistema de gestión hospitalaria',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} flex h-screen`}>
        <Navbar />
        <main className="flex-1 overflow-auto p-6 bg-white">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}
