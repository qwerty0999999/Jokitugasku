'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight, MessageCircle, ShieldCheck, Clock, Star } from 'lucide-react'
import { WA_NUMBER } from '@/lib/constants'

function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

const stats = [
  { target: 500, suffix: '+', label: 'Tugas Selesai' },
  { target: 98, suffix: '%', label: 'Kepuasan Klien' },
  { target: 24, suffix: 'H', label: 'Respon Cepat' },
]

function StatItem({ stat, started }) {
  const count = useCountUp(stat.target, 1800, started)
  return (
    <div className="text-center px-2">
      <div className="text-xl md:text-3xl font-black font-display text-slate-900 tabular-nums leading-none">
        {count}{stat.suffix}
      </div>
      <div className="text-slate-400 text-[9px] md:text-xs mt-1.5 font-bold uppercase tracking-wider">{stat.label}</div>
    </div>
  )
}

const trustBadges = [
  { icon: ShieldCheck, label: 'Privasi Aman' },
  { icon: Clock, label: 'Tepat Deadline' },
  { icon: Star, label: 'Rating 4.9' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function Hero({ onStartOrder }) {
  const [statsStarted, setStatsStarted] = useState(false)
  const statsRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsStarted(true) },
      { threshold: 0.2 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-white"
    >
      {/* Background patterns - Opacity lowered for better text contrast */}
      <div className="absolute inset-0 bg-dots opacity-[0.2] pointer-events-none" aria-hidden="true" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-50/50 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-50/50 rounded-full blur-[80px] pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center lg:items-start text-center lg:text-left relative z-10"
          >
            {/* Live badge */}
            <motion.div variants={itemVariants} className="section-badge mb-6 inline-flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Layanan Terpercaya 2026
            </motion.div>

            {/* Main Heading - Optimized for LCP & Mobile Typography */}
            <motion.h1
              variants={itemVariants}
              className="font-display text-[2.5rem] md:text-5xl lg:text-[3.8rem] font-black text-slate-900 leading-[1.05] mb-6 tracking-tight"
            >
              Tugas Numpuk?{' '}
              <span className="text-blue-600 block sm:inline">Kami Siap</span>
              <br className="hidden sm:block" />
              <span className="text-slate-800/80">Bantu Selesaikan.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={itemVariants} className="text-slate-500 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
              Joki tugas profesional — cepat, aman, tepat waktu.
              Dari laporan harian sampai skripsi, kami handle dengan hasil terbaik.
            </motion.p>

            {/* CTA Buttons - Large Tap Targets for Mobile (48px+) */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 mb-12 w-full sm:w-auto">
              <button 
                onClick={onStartOrder}
                aria-label="Mulai memesan tugas sekarang"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                Mulai Order Sekarang
                <ArrowRight size={18} strokeWidth={3} />
              </button>
              <a
                href={`https://wa.me/${WA_NUMBER}?text=Halo!%20Saya%20mau%20konsultasi%20gratis.`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Hubungi kami via WhatsApp untuk konsultasi gratis"
                className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-100 hover:border-blue-200 text-slate-700 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <MessageCircle size={18} strokeWidth={3} className="text-emerald-500" />
                Konsultasi Gratis
              </a>
            </motion.div>

            {/* Trust badges - Visual reinforcement */}
            <motion.div variants={itemVariants} className="flex flex-wrap justify-center lg:justify-start gap-4 mb-12">
              {trustBadges.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400"
                >
                  <Icon size={14} className="text-blue-500" />
                  {label}
                </div>
              ))}
            </motion.div>

            {/* Stats strip - Desktop Only or Minimal on Mobile */}
            <motion.div
              ref={statsRef}
              variants={itemVariants}
              className="flex items-center gap-4 sm:gap-12 bg-slate-50 p-6 sm:px-10 sm:py-6 rounded-3xl border border-slate-100"
            >
              {stats.map((stat, i) => (
                <StatItem key={i} stat={stat} started={statsStarted} />
              ))}
            </motion.div>
          </motion.div>

          {/* Right Visual - Hidden on mobile for faster loading, visible on tablet+ */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full max-w-lg mx-auto">
              <div className="absolute inset-0 bg-blue-100/30 rounded-[3rem] blur-3xl transform scale-110" aria-hidden="true" />
              <div className="relative rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl">
                <Image
                  src="/hero.png"
                  alt="Ilustrasi mahasiswa produktif mengerjakan tugas"
                  width={540}
                  height={540}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
