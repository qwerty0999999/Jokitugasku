'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, Zap, Star } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const WA_NUMBER = '6289524894059'

const defaultPrices = {
  starter: { price: 'Rp 20K', unit: 'per tugas' },
  pro: { price: 'Rp 50K', unit: 'per bab / halaman' },
  custom: { price: 'Custom', unit: 'sesuai kebutuhan' }
}

export default function Pricing({ onStartOrder }) {
  const [prices, setPrices] = useState(defaultPrices)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const { data } = await supabase.from('system_settings').select('*').eq('key', 'LANDING_PRICES').single()
        if (data && data.value) {
          setPrices(JSON.parse(data.value))
        }
      } catch (e) {
        console.warn("Pricing fetch error")
      }
    }
    fetchPrices()
  }, [])

  const pricingTiers = [
    {
      id: 'price-starter',
      tier: 'Dasar',
      name: 'Tugas Ringan',
      priceLabel: 'Mulai dari',
      price: prices.starter.price,
      unit: prices.starter.unit,
      featured: false,
      features: [
        'Resume & Rangkuman',
        'Jawab soal essay',
        'Laporan singkat',
        'Revisi 1x gratis',
        'Pengerjaan < 24 jam',
      ],
      cta: 'Pesan Sekarang',
      cardBg: 'bg-white',
      borderClass: 'border-slate-200 hover:border-blue-400',
      tierBadge: 'bg-slate-100 text-slate-600',
    },
    {
      id: 'price-pro',
      tier: 'Populer',
      name: 'Makalah & Skripsi',
      priceLabel: 'Mulai dari',
      price: prices.pro.price,
      unit: prices.pro.unit,
      featured: true,
      badge: '🔥 Terpopuler',
      features: [
        'Makalah ilmiah lengkap',
        'Proposal & skripsi',
        'Analisis SPSS / data',
        'Revisi unlimited',
        'Konsultasi via WA',
      ],
      cta: 'Pesan Sekarang',
      cardBg: 'bg-slate-900',
      borderClass: 'border-slate-800 shadow-2xl shadow-blue-900/20',
      tierBadge: 'bg-white/10 text-white/90',
    },
    {
      id: 'price-custom',
      tier: 'Premium',
      name: 'Coding & IT',
      priceLabel: 'Estimasi',
      price: prices.custom.price,
      unit: prices.custom.unit,
      featured: false,
      features: [
        'Website & aplikasi',
        'Python / Java / DSA',
        'Database & API',
        'Revisi unlimited',
        'Source code included',
      ],
      cta: 'Konsultasi Dulu',
      ctaHref: `https://wa.me/${WA_NUMBER}?text=Halo!%20Saya%20ingin%20tanya%20harga%20project%20coding.`,
      ctaExternal: true,
      cardBg: 'bg-white',
      borderClass: 'border-slate-200 hover:border-blue-400',
      tierBadge: 'bg-slate-100 text-slate-600',
    },
  ]

  return (
    <section id="pricing" className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" aria-hidden="true" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="section-badge mb-6">Investasi Masa Depan</span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            Harga Jujur & <br className="md:hidden" /> <span className="text-blue-600">Ramah Mahasiswa</span>
          </h2>
          <p className="text-slate-500 text-base md:text-lg mt-6 max-w-xl mx-auto leading-relaxed">
            Tidak ada biaya tersembunyi. Bayar sesuai tingkat kesulitan dan sisa waktu pengerjaan.
          </p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 items-stretch">
          {pricingTiers.map((tier, i) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-[2.5rem] border-2 ${tier.borderClass} ${tier.cardBg} p-8 flex flex-col transition-all duration-300 ${tier.featured ? 'md:scale-105 z-10 ring-4 ring-blue-500/5' : 'hover:shadow-xl'}`}
            >
              {tier.badge && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center" aria-hidden="true">
                  <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest">
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className="mb-8">
                <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${tier.tierBadge} mb-4`}>
                  {tier.tier}
                </span>
                <h3 className={`text-2xl font-black ${tier.featured ? 'text-white' : 'text-slate-900'}`}>{tier.name}</h3>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${tier.featured ? 'text-slate-400' : 'text-slate-400'}`}>{tier.priceLabel}</span>
                  <span className={`text-4xl font-black ${tier.featured ? 'text-white' : 'text-slate-900'} tabular-nums`}>{tier.price}</span>
                </div>
                <div className={`text-xs mt-1 font-medium ${tier.featured ? 'text-slate-400' : 'text-slate-500'}`}>{tier.unit}</div>
              </div>

              <div className={`h-px w-full mb-8 ${tier.featured ? 'bg-white/10' : 'bg-slate-100'}`} aria-hidden="true" />

              <ul className="space-y-4 mb-10 flex-1" aria-label={`Fitur paket ${tier.name}`}>
                {tier.features.map((feat, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${tier.featured ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-600'}`} aria-hidden="true">
                      <Check size={12} strokeWidth={4} />
                    </div>
                    <span className={`text-sm font-medium leading-tight ${tier.featured ? 'text-slate-300' : 'text-slate-600'}`}>{feat}</span>
                  </li>
                ))}
              </ul>

              {tier.ctaExternal ? (
                <a
                  href={tier.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Konsultasi via WhatsApp untuk ${tier.name}`}
                  className="w-full py-4 bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all text-center active:scale-95"
                >
                  {tier.cta}
                </a>
              ) : (
                <button
                  onClick={onStartOrder}
                  aria-label={`Pesan paket ${tier.name} sekarang`}
                  className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl ${tier.featured ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-900/20' : 'bg-slate-900 text-white hover:bg-blue-600 shadow-slate-900/10'}`}
                >
                  {tier.cta}
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Accessibility Note */}
        <p className="text-center mt-12 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center justify-center gap-3">
          <Star size={12} className="text-amber-400 fill-amber-400" />
          Rating 4.9/5 Berdasarkan 500+ Ulasan Mahasiswa
          <Star size={12} className="text-amber-400 fill-amber-400" />
        </p>
      </div>
    </section>
  )
}
