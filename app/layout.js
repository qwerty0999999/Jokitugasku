import './globals.css'
import ClientLayout from '@/components/layout/ClientLayout'
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

export const metadata = {
  title: 'Jokitugasku — Solusi Cepat & Terpercaya untuk Tugas Akademik',
  description: 'Jasa joki tugas, konsultasi skripsi, pembuatan PPT, dan coding terpercaya. Cepat, aman, dan berkualitas. Mulai dari Rp20.000!',
  keywords: 'joki tugas, joki skripsi, joki makalah, joki coding, jasa tugas kuliah, spss, jasa ppt, jokitugasku',
  metadataBase: new URL('https://jokitugasku.id'), // Sesuaikan dengan domain asli
  openGraph: {
    type: 'website',
    url: '/',
    title: 'Jokitugasku — Solusi Cepat & Terpercaya',
    description: 'Jasa joki tugas, konsultasi skripsi, pembuatan PPT, dan coding terpercaya. Cepat, aman, dan berkualitas.',
    siteName: 'Jokitugasku',
    images: [
      {
        url: '/hero.png',
        width: 1200,
        height: 630,
        alt: 'Jokitugaku Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jokitugasku — Solusi Cepat & Terpercaya',
    description: 'Jasa joki tugas, konsultasi skripsi, pembuatan PPT, dan coding terpercaya. Cepat, aman, dan berkualitas.',
    images: ['/hero.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png',
  },
}

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Jokitugasku",
    "description": "Jasa pengerjaan tugas akademik, skripsi, coding, dan analisis data profesional.",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Jokitugasku ID",
      "image": "https://jokitugasku.id/logo.png",
      "priceRange": "$$"
    },
    "areaServed": "Indonesia",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Layanan Akademik",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Joki Skripsi / Thesis"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Analisis Data SPSS"
          }
        }
      ]
    }
  }

  return (
    <html lang="id" className={`scroll-smooth ${plusJakarta.variable} ${poppins.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-white text-slate-900 antialiased font-sans">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
