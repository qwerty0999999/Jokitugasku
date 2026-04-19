'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import Hero from '@/components/sections/Hero'

// Dynamic imports untuk komponen di bawah fold agar JS tidak dimuat sekaligus
const Services = dynamic(() => import('@/components/sections/Services'), { ssr: true })
const About = dynamic(() => import('@/components/sections/About'), { ssr: true })
const HowItWorks = dynamic(() => import('@/components/sections/HowItWorks'), { ssr: true })
const Testimonials = dynamic(() => import('@/components/sections/Testimonials'), { ssr: true })
const Pricing = dynamic(() => import('@/components/sections/Pricing'), { ssr: true })
const Promo = dynamic(() => import('@/components/sections/Promo'), { ssr: true })
const FAQ = dynamic(() => import('@/components/sections/FAQ'), { ssr: true })
const CTA = dynamic(() => import('@/components/sections/CTA'), { ssr: true })
const OrderForm = dynamic(() => import('@/components/ui/OrderForm'), { ssr: false })

export default function HomePage() {
  const [showOrderForm, setShowOrderForm] = useState(false)

  // Cek hash saat pertama kali dimuat atau saat hash berubah
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#order-form') {
        setShowOrderForm(true)
        // Scroll ke paling atas agar form terlihat penuh
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 100)
      } else {
        setShowOrderForm(false)
      }
    }

    // Jalankan saat mount
    handleHashChange()

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleStartOrder = () => {
    window.location.hash = 'order-form'
  }

  return (
    <main className="min-h-screen">
      <AnimatePresence mode="wait">
        {!showOrderForm ? (
          <motion.div
            key="landing-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Hero onStartOrder={handleStartOrder} />
            <Services />
            <About />
            <HowItWorks />
            <Testimonials />
            <Pricing onStartOrder={handleStartOrder} />
            <Promo />
            <FAQ />
            <CTA onStartOrder={handleStartOrder} />
          </motion.div>
        ) : (
          <motion.div
            key="order-form-page"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, type: 'spring', damping: 25 }}
            className="pt-28 pb-20 bg-slate-50 min-h-screen relative overflow-hidden"
          >
             {/* Background Decor */}
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-50 to-transparent -z-10" />
            
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <div className="text-center mb-12">
                <span className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-200">
                  Form Pemesanan
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-6 mb-4">
                  Mulai Order <span className="text-gradient">Tugasmu</span>
                </h1>
                <p className="text-slate-500 text-lg max-w-xl mx-auto">
                  Isi detail tugas di bawah ini. Tim kami akan segera menghubungimu via WhatsApp.
                </p>
              </div>

              <OrderForm isStandalone={true} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
