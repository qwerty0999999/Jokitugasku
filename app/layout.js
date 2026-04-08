'use client'

import './globals.css'
import Navbar from '@/components/layout/Navbar'
import AIAssistant from '@/components/ui/AIAssistant'
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
        <meta name="keywords" content="joki tugas, joki skripsi, joki makalah, joki coding, jasa tugas kuliah, spss, jasa ppt, jokitugasku" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jokitugasku.com/" />
        <meta property="og:title" content="Jokitugasku — Solusi Cepat & Terpercaya" />
        <meta property="og:description" content="Jasa joki tugas, konsultasi skripsi, pembuatan PPT, dan coding terpercaya. Cepat, aman, dan berkualitas." />
        <meta property="og:image" content="https://jokitugasku.com/hero.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://jokitugasku.com/" />
        <meta property="twitter:title" content="Jokitugasku — Solusi Cepat & Terpercaya" />
        <meta property="twitter:description" content="Jasa joki tugas, konsultasi skripsi, pembuatan PPT, dan coding terpercaya. Cepat, aman, dan berkualitas." />
        <meta property="twitter:image" content="https://jokitugasku.com/hero.png" />

        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="bg-white text-slate-900 antialiased font-sans">
        {!isAdminPage && <Navbar />}
        <main>{children}</main>
        {!isAdminPage && <AIAssistant />}
      </body>
    </html>
  )
}
