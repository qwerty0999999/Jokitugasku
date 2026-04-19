'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, History, Tag } from 'lucide-react'
import { WA_NUMBER } from '@/lib/constants'
import { supabase } from '@/lib/supabase'

const navLinks = [
  { href: '/services', label: 'Layanan' },
  { href: '/about', label: 'Tentang Kami' },
  { href: '/how-it-works', label: 'Cara Kerja' },
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
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled
          ? 'py-3 bg-white/90 backdrop-blur-2xl border-b border-slate-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
          : 'py-5 bg-white/40 backdrop-blur-md border-b border-white/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="relative w-10 h-10 md:w-11 md:h-11 rounded-2xl overflow-hidden shadow-lg shadow-blue-500/10 group-hover:scale-105 transition-all duration-300">
              <Image src="/logo.png" alt="Logo" fill className="object-cover" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-black text-slate-900 text-lg md:text-xl tracking-tight">Jokitugasku</span>
              <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em]">Premium Service</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50 backdrop-blur-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                  pathname === link.href
                    ? 'text-blue-600 bg-white shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/tracking"
              className={`hidden md:flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                pathname === '/tracking'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-slate-700 bg-white border border-slate-200 shadow-sm hover:bg-slate-50'
              }`}
            >
              <Search size={16} strokeWidth={3} />
              Cek Order
            </Link>

            <Link
              href="/#order-form"
              className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-bold text-white bg-blue-600 shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-300"
            >
              Mulai Order
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-3 rounded-2xl bg-slate-100 text-slate-900 hover:bg-slate-200 transition-colors"
            >
              {menuOpen ? <X size={20} strokeWidth={3} /> : <Menu size={20} strokeWidth={3} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="absolute top-full left-4 right-4 mt-4 bg-white rounded-[2rem] border border-slate-200 shadow-2xl p-6 lg:hidden z-[101]"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-5 py-4 rounded-2xl text-base font-bold transition-all ${
                    pathname === link.href ? 'bg-blue-50 text-blue-600' : 'text-slate-600 active:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-slate-100 my-2" />
              <Link
                href="/order"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 p-4 rounded-2xl font-bold bg-blue-600 text-white shadow-lg shadow-blue-600/20"
              >
                Mulai Order Sekarang
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
