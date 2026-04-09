'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AIAssistant from '@/components/ui/AIAssistant'
import WaFloat from '@/components/ui/WaFloat'

/**
 * ClientLayout — wrapper client component untuk elemen yang butuh hooks (usePathname).
 * Memisahkan kebutuhan client-side dari root layout agar layout.js bisa tetap Server Component
 * dan metadata SEO bisa dirender di server.
 */
export default function ClientLayout({ children }) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')

  return (
    <>
      {!isAdminPage && <Navbar />}
      <main>{children}</main>
      {!isAdminPage && (
        <>
          <Footer />
          <AIAssistant />
          <WaFloat />
        </>
      )}
    </>
  )
}
