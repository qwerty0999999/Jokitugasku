'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight, MessageCircle, ShieldCheck, Clock, Star, Tag } from 'lucide-react'
import { WA_NUMBER } from '@/lib/constants'
import { supabase } from '@/lib/supabase'

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
      <div className="text-2xl md:text-3xl font-bold font-display text-gray-900 tabular-nums">
        {count}{stat.suffix}
      </div>
      <div className="text-gray-400 text-xs mt-1 font-medium tracking-wide">{stat.label}</div>
    </div>
  )
}

const floatCards = [
  {
    icon: '✅',
    title: 'Tugas Selesai!',
    sub: 'Tepat waktu & rapi',
    delay: 0,
    pos: 'top-4 -left-8 md:-left-16',
  },
  {
    icon: '⭐',
    title: 'Rating 4.9/5',
    sub: '500+ ulasan positif',
    delay: 1.5,
    pos: 'top-16 -right-8 md:-right-12',
  },
  {
    icon: '⚡',
    title: 'Respon < 5 Menit',
    sub: 'Online 7 hari/minggu',
    delay: 0.8,
    pos: 'bottom-12 -left-6 md:-left-14',
  },
]

const trustBadges = [
  { icon: ShieldCheck, label: '100% Privasi Aman' },
  { icon: Clock, label: 'Tepat Deadline' },
  { icon: Star, label: 'Rating 4.9 / 5' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

export default function Hero({ onStartOrder }) {
  const [statsStarted, setStatsStarted] = useState(false)
  const [activePromo, setActivePromo] = useState(null)
  const statsRef = useRef(null)

  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const { data } = await supabase.from('system_settings').select('*').eq('key', 'PROMO_CODES_DB').single()
        if (data?.value) {
          const promos = JSON.parse(data.value)
          const keys = Object.keys(promos)
          if (keys.length > 0) {
            setActivePromo({ code: keys[0], ...promos[keys[0]] })
          }
        }
      } catch (e) {}
    }
    fetchPromo()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsStarted(true) },
      { threshold: 0.4 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-20 pb-20 overflow-hidden bg-white"
    >
      {/* Subtle dot background */}
      <div className="absolute inset-0 bg-dots opacity-50 pointer-events-none" />

      {/* Gradient blobs */}
      <div className="absolute -top-32 -right-32 w-[640px] h-[640px] bg-blue-50 rounded-full blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left: Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start"
          >
            {/* Live badge */}
            <motion.div variants={itemVariants} className="section-badge mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Jasa Terpercaya · Berpengalaman
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="font-display text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-gray-900 leading-[1.15] mb-5"
            >
              Tugas Numpuk?{' '}
              <span className="text-gradient">Kami Siap</span>
              <br />
              <span className="text-gray-700">Bantu Selesaikan.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={itemVariants} className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">
              Joki tugas profesional — cepat, aman, tepat waktu.
              Dari laporan harian sampai skripsi, kami handle dengan hasil terbaik.
            </motion.p>

            {/* Trust badges */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2.5 mb-8">
              {trustBadges.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-gray-200 text-gray-600 shadow-sm"
                >
                  <Icon size={12} className="text-blue-500" />
                  {label}
                </span>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mb-10">
              <button 
                onClick={onStartOrder}
                id="btn-mulai" 
                className="btn-primary shine"
              >
                Mulai Order Sekarang
                <ArrowRight size={17} />
              </button>
              <a
                href={`https://wa.me/${WA_NUMBER}?text=Halo!%20Saya%20mau%20konsultasi%20gratis.`}
                target="_blank"
                rel="noopener noreferrer"
                id="btn-konsultasi"
                className="btn-secondary"
              >
                <MessageCircle size={17} />
                Konsultasi Gratis
              </a>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              ref={statsRef}
              variants={itemVariants}
              className="flex items-center gap-6 md:gap-8 bg-white border border-gray-100 shadow-sm rounded-2xl px-6 py-4 divide-x divide-gray-100"
            >
              {stats.map((stat, i) => (
                <div key={i} className={i > 0 ? 'pl-6 md:pl-8' : ''}>
                  <StatItem stat={stat} started={statsStarted} />
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full max-w-lg mx-auto">
              {/* Glow ring */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl blur-2xl transform scale-105 opacity-70" />

              <div className="relative rounded-3xl overflow-hidden border border-gray-100 shadow-[0_20px_60px_rgba(59,130,246,0.12)]">
                <Image
                  src="/hero.png"
                  alt="Ilustrasi mahasiswa mengerjakan tugas"
                  width={540}
                  height={440}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>

              {/* Floating cards */}
              {floatCards.map((card, i) => (
                <motion.div
                  key={i}
                  aria-hidden="true"
                  className={`absolute ${card.pos} bg-white border border-gray-100 shadow-lg px-4 py-3 flex items-center gap-3 rounded-2xl`}
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 3.2,
                    delay: card.delay,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <span className="text-2xl">{card.icon}</span>
                  <div className="leading-tight">
                    <div className="text-gray-900 text-sm font-semibold">{card.title}</div>
                    <div className="text-gray-400 text-xs">{card.sub}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
