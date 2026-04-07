'use client'

import './globals.css'
import Navbar from '@/components/Navbar'
import AIAssistant from '@/components/AIAssistant'
import { usePathname } from 'next/navigation'
import { Plus_Jakarta_Sans, Poppins } from 'next/font/google'

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  variable: '--font-plus-jakarta',
  display: 'swap',
})

const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
})

export default function RootLayout({ children }) {
  const pathname = usePathname()
  
  const isAdminPage = pathname && pathname.startsWith('/admin')

  return (
    <html lang="id" className={`scroll-smooth ${plusJakarta.variable} ${poppins.variable}`}>
      <head>
        <title>Jokitugasku — Solusi Cepat & Terpercaya untuk Tugas Akademik</title>
        <meta name="description" content="Jasa joki tugas, konsultasi skripsi, pembuatan PPT, dan coding terpercaya. Cepat, aman, dan berkualitas. Mulai dari Rp20.000!" />
      </head>
      <body className="bg-white text-slate-900 antialiased font-sans">
        {!isAdminPage && <Navbar />}
        <main>{children}</main>
        {!isAdminPage && <AIAssistant />}
      </body>
    </html>
  )
}
