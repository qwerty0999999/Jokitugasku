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

const floatCards = [
  {
    icon: '✅',
    title: 'Tugas Selesai!',
    sub: 'Tepat waktu & rapi',
    delay: 0,
    pos: 'top-4 -left-12 md:-left-20',
  },
  {
    icon: '⭐',
    title: 'Rating 4.9/5',
    sub: '500+ ulasan positif',
    delay: 0.5,
    pos: 'top-24 -right-10 md:-right-12',
  },
  {
    icon: '⚡',
    title: 'Respon < 5 Menit',
    sub: 'Online 24/7',
    delay: 1,
    pos: 'bottom-20 -left-8 md:-left-16',
  },
]

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
      <div className="absolute inset-0 bg-dots opacity-[0.2] pointer-events-none" aria-hidden="true" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-50/50 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-50/50 rounded-full blur-[80px] pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center lg:items-start text-center lg:text-left relative z-10"
          >
            <motion.div variants={itemVariants} className="section-badge mb-6 inline-flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Layanan Terpercaya 2026
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-display text-[2.5rem] md:text-5xl lg:text-[3.8rem] font-black text-slate-900 leading-[1.05] mb-6 tracking-tight"
            >
              Tugas Numpuk?{' '}
              <span className="text-blue-600 block sm:inline">Kami Siap</span>
              <br className="hidden sm:block" />
              <span className="text-slate-800/80">Bantu Selesaikan.</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-slate-500 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
              Joki tugas profesional — cepat, aman, tepat waktu.
              Dari laporan harian sampai skripsi, kami handle dengan hasil terbaik.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 mb-12 w-full sm:w-auto">
              <button 
                onClick={onStartOrder}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                Mulai Order Sekarang
                <ArrowRight size={18} strokeWidth={3} />
              </button>
              <a
                href={`https://wa.me/${WA_NUMBER}?text=Halo!%20Saya%20mau%20konsultasi%20gratis.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-100 hover:border-blue-200 text-slate-700 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <MessageCircle size={18} strokeWidth={3} className="text-emerald-500" />
                Konsultasi Gratis
              </a>
            </motion.div>

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

          <div className="relative hidden lg:block perspective-1000">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-2xl mx-auto flex items-center justify-center"
            >
              <div className="absolute w-[130%] h-[130%] bg-gradient-to-br from-blue-100/60 to-indigo-100/40 rounded-full blur-[120px] transform -rotate-12 animate-pulse" aria-hidden="true" />
              <div className="absolute w-[520px] h-[520px] border-2 border-dashed border-blue-200 rounded-full animate-[spin_30s_linear_infinite]" aria-hidden="true" />

              {/* Main Image (hero.png) - Smoother Corners */}
              <div className="relative z-10 w-[580px] h-[620px] rounded-[4rem] overflow-hidden shadow-2xl shadow-blue-900/10 border-4 border-white/50 backdrop-blur-sm">
                <div className="absolute inset-10 bg-blue-600/10 rounded-full blur-3xl" />
                <Image
                  src="/hero.png"
                  alt="Jokitugaku Expert Visual"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-transparent to-transparent z-20" />
              </div>

              {/* Floating Info Cards */}
              {floatCards.map((card, i) => (
                <motion.div
                  key={i}
                  aria-hidden="true"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: [0, -10],
                  }}
                  transition={{
                    opacity: { duration: 0.8, delay: 0.8 + (i * 0.2) },
                    y: { 
                      duration: 2.5 + i, 
                      repeat: Infinity, 
                      repeatType: "reverse", 
                      ease: "easeInOut",
                      delay: i * 0.5
                    }
                  }}
                  className={`absolute ${card.pos} z-30 bg-white/95 backdrop-blur-sm border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] px-6 py-4 flex items-center gap-4 rounded-[1.5rem] min-w-[210px] will-change-transform`}
                >
                  <span className="text-3xl">{card.icon}</span>
                  <div className="leading-tight">
                    <div className="text-slate-950 text-[13px] font-black uppercase tracking-wider leading-none mb-1.5">{card.title}</div>
                    <div className="text-slate-500 text-[11px] font-bold">{card.sub}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
