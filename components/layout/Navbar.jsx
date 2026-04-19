'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, Tag } from 'lucide-react'
import { WA_NUMBER } from '@/lib/constants'

const navLinks = [
  { href: '/services', label: 'Layanan' },
  { href: '/about', label: 'Tentang' },
  { href: '/how-it-works', label: 'Proses' },
  { href: '/testimonials', label: 'Testimoni' },
  { href: '/pricing', label: 'Harga' },
  { href: '/promo', label: 'Promo' },
  { href: '/faq', label: 'FAQ' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled
          ? 'py-3 bg-white/95 backdrop-blur-2xl border-b border-slate-200/60 shadow-lg shadow-slate-900/5'
          : 'py-5 bg-white/60 backdrop-blur-md border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Brand Logo - Optimized for LCP */}
          <Link
            href="/"
            aria-label="Kembali ke Beranda Jokitugasku"
            className="flex items-center gap-2.5 group shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
          >
            <div className="relative w-9 h-9 md:w-11 md:h-11 rounded-xl overflow-hidden shadow-lg shadow-blue-500/10 group-hover:scale-105 transition-all duration-300">
              <Image 
                src="/logo.png" 
                alt="" // Empty alt because the text next to it is the label
                fill 
                priority
                sizes="(max-width: 768px) 36px, 44px"
                className="object-cover" 
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display font-black text-slate-950 text-base md:text-xl tracking-tight uppercase">Jokitugasku</span>
              <span className="text-blue-600 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em]">Premium Service</span>
            </div>
          </Link>

          {/* Desktop Nav - Optimized Spacing */}
          <nav className="hidden lg:flex items-center gap-0.5 bg-slate-100/40 p-1 rounded-2xl border border-slate-200/50">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all duration-200 ${
                  pathname === link.href
                    ? 'text-blue-600 bg-white shadow-sm ring-1 ring-slate-200/50'
                    : 'text-slate-500 hover:text-slate-950 hover:bg-white/60'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/tracking"
              aria-label="Lacak pesanan saya"
              className={`hidden md:flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                pathname === '/tracking'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-slate-700 bg-white border border-slate-200 shadow-sm hover:bg-slate-50'
              }`}
            >
              <Search size={16} strokeWidth={3} aria-hidden="true" />
              Cek Order
            </Link>

            <Link
              href="/#order-form"
              className="hidden md:flex items-center px-6 py-2.5 rounded-2xl text-sm font-bold text-white bg-blue-600 shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Mulai Order
            </Link>

            {/* Mobile Menu Toggle - Large Tap Target (48px) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Tutup menu" : "Buka menu utama"}
              className="lg:hidden w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-950 hover:bg-slate-200 transition-colors focus:ring-2 focus:ring-blue-500 outline-none active:scale-95"
            >
              {menuOpen ? <X size={22} strokeWidth={3} /> : <Menu size={22} strokeWidth={3} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay - Accessibility & Mobile Perf Optimized */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-20 z-[101] lg:hidden"
          >
            <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-5 overflow-hidden">
              <div className="flex flex-col gap-1.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between px-6 py-4 rounded-2xl text-base font-bold transition-all ${
                      pathname === link.href ? 'bg-blue-50 text-blue-600' : 'text-slate-600 active:bg-slate-50'
                    }`}
                  >
                    {link.label}
                    {pathname === link.href && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                  </Link>
                ))}
                
                <div className="h-px bg-slate-100 my-3 mx-4" />
                
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/tracking"
                    className="flex items-center justify-center gap-2 p-4 rounded-2xl font-bold bg-slate-50 text-slate-900 border border-slate-200 active:scale-[0.97] transition-transform"
                  >
                    <Search size={18} strokeWidth={2.5} /> Cek Status
                  </Link>
                  <Link
                    href="/#order-form"
                    className="flex items-center justify-center gap-2 p-4 rounded-2xl font-bold bg-blue-600 text-white shadow-lg shadow-blue-600/20 active:scale-[0.97] transition-transform"
                  >
                    Order Sekarang
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
