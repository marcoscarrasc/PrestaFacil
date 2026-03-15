import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PrestaFácil | Préstamos Personales Online',
  description: 'Solicita tu préstamo personal 100% online, rápido y seguro. Cotiza ahora y obtén tu dinero en minutos.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-slate-50 text-slate-600`}>
        {children}
      </body>
    </html>
  )
}
