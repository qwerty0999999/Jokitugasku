'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search } from 'lucide-react'
import { WA_NUMBER } from '@/lib/constants'

const navLinks = [
  { href: '#services', label: 'Layanan' },
  { href: '#about', label: 'Tentang Kami' },
  { href: '#how-it-works', label: 'Cara Kerja' },
  { href: '#testimonials', label: 'Testimoni' },
  { href: '#pricing', label: 'Harga' },
  { href: '#faq', label: 'FAQ' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (pathname !== '/') {
      setActiveSection('')
      return
    }

    const NAV_HEIGHT = 88

    const getActiveSection = () => {
      const scrollY = window.scrollY + NAV_HEIGHT + 40

      // Cek dari bawah ke atas supaya section yang paling dekat viewport dipilih
      const sectionIds = navLinks.map(l => l.href) // e.g. '#services'
      let current = ''

      for (const href of sectionIds) {
        const el = document.querySelector(href)
        if (el && el.offsetTop <= scrollY) {
          current = href
        }
      }

      setActiveSection(current)
    }

    // Run once on mount
    getActiveSection()

    window.addEventListener('scroll', getActiveSection, { passive: true })
    return () => window.removeEventListener('scroll', getActiveSection)
  }, [pathname])

  const scrollTo = (e, href) => {
    if (pathname !== '/') {
      // If not on home page, let the default Link behavior handle it
      setMenuOpen(false)
      return
    }

    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      const navH = 80
      window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' })
    }
    setMenuOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled
          ? 'py-3 bg-white/80 backdrop-blur-2xl border-b border-slate-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Brand */}
          <Link
            href="/#hero"
            onClick={(e) => scrollTo(e, '#hero')}
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
                href={`/${link.href}`}
                onClick={(e) => scrollTo(e, link.href)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeSection === link.href
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

            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-bold text-white bg-blue-600 shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-300"
            >
              Hubungi Kami
            </a>

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
                  href={`/${link.href}`}
                  onClick={(e) => scrollTo(e, link.href)}
                  className={`px-5 py-4 rounded-2xl text-base font-bold transition-all ${
                    activeSection === link.href ? 'bg-blue-50 text-blue-600' : 'text-slate-600 active:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-slate-100 my-2" />
              <Link
                href="/tracking"
                onClick={() => setMenuOpen(false)}
                className={`flex items-center justify-center gap-2 p-4 rounded-2xl font-bold border transition-all ${
                  pathname === '/tracking'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-50 text-slate-900 border-slate-200'
                }`}
              >
                <Search size={18} /> Cek Status Order
              </Link>
              <a href={`https://wa.me/${WA_NUMBER}`} className="flex items-center justify-center gap-2 p-4 rounded-2xl font-bold bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                Konsultasi Sekarang
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
