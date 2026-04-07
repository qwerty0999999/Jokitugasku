'use client'

import { motion } from 'framer-motion'
import { Check, Zap, Star } from 'lucide-react'

const WA_NUMBER = '6289524894059'

const pricingTiers = [
  {
    id: 'price-starter',
    tier: 'Dasar',
    name: 'Tugas Ringan',
    priceLabel: 'Mulai dari',
    price: 'Rp 20K',
    unit: 'per tugas',
    featured: false,
    features: [
      'Resume & Rangkuman',
      'Jawab soal essay',
      'Laporan singkat',
      'Revisi 1x gratis',
      'Pengerjaan < 24 jam',
    ],
    cta: 'Pesan Sekarang',
    ctaHref: '#order-form',
    ctaExternal: false,
    cardBg: 'bg-white',
    borderClass: 'border-slate-100 hover:border-blue-200',
    tierBadge: 'bg-slate-100 text-slate-600',
  },
  {
    id: 'price-pro',
    tier: 'Populer',
    name: 'Makalah & Skripsi',
    priceLabel: 'Mulai dari',
    price: 'Rp 50K',
    unit: 'per bab / halaman',
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
    ctaHref: '#order-form',
    ctaExternal: false,
    cardBg: 'bg-slate-900',
    borderClass: 'border-slate-800',
    tierBadge: 'bg-white/10 text-white/70',
  },
  {
    id: 'price-custom',
    tier: 'Premium',
    name: 'Coding & IT',
    priceLabel: 'Harga',
    price: 'Custom',
    unit: 'sesuai kebutuhan',
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
    borderClass: 'border-slate-100 hover:border-blue-200',
    tierBadge: 'bg-slate-100 text-slate-600',
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-28 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-100 to-transparent" />

      {/* Background blobs */}
      <div className="absolute -top-24 right-1/4 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65 }}
          className="text-center mb-20"
        >
          <span className="section-badge mb-5">Harga</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-4 mb-4">
            Harga Transparan &{' '}
            <span className="text-gradient">Terjangkau</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-lg mx-auto">
            Tidak ada biaya tersembunyi. Harga sesuai kantong mahasiswa.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {pricingTiers.map((tier, i) => (
            <motion.div
              key={tier.id}
              id={tier.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65, delay: i * 0.13 }}
              className={`relative rounded-3xl border-2 ${tier.borderClass} ${tier.cardBg} ${
                tier.featured
                  ? 'shadow-2xl shadow-slate-900/20 md:scale-105 md:-mt-4'
                  : 'shadow-sm hover:shadow-lg'
              } transition-all duration-300 overflow-hidden flex flex-col`}
            >
              {/* Featured glow */}
              {tier.featured && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/15 to-transparent pointer-events-none" />
              )}

              {/* Popular badge */}
              {tier.badge && (
                <div className="absolute -top-px left-0 right-0 flex justify-center">
                  <span className="bg-blue-500 text-white text-xs font-black px-5 py-1.5 rounded-b-2xl shadow-sm shadow-blue-500/30">
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className="relative p-8 flex flex-col gap-7 flex-1">
                {/* Header */}
                <div className={tier.badge ? 'mt-4' : ''}>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${tier.tierBadge} mb-3`}>
                    {tier.tier}
                  </span>
                  <h3 className={`font-display font-black text-2xl ${tier.featured ? 'text-white' : 'text-slate-900'}`}>
                    {tier.name}
                  </h3>
                </div>

                {/* Price */}
                <div>
                  <div className={`text-xs font-medium ${tier.featured ? 'text-slate-400' : 'text-slate-400'}`}>
                    {tier.priceLabel}
                  </div>
                  <div className={`text-5xl font-black font-display mt-1.5 leading-none ${tier.featured ? 'text-white' : 'text-slate-900'}`}>
                    {tier.price}
                  </div>
                  <div className={`text-sm mt-2 font-medium ${tier.featured ? 'text-slate-400' : 'text-slate-400'}`}>
                    {tier.unit}
                  </div>
                </div>

                {/* Divider */}
                <div className={`h-px ${tier.featured ? 'bg-white/10' : 'bg-slate-100'}`} />

                {/* Features */}
                <ul className="flex flex-col gap-3.5 flex-1">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        tier.featured ? 'bg-blue-500/30 text-blue-300' : 'bg-blue-50 text-blue-500'
                      }`}>
                        <Check size={11} strokeWidth={3.5} />
                      </span>
                      <span className={tier.featured ? 'text-slate-300' : 'text-slate-600'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {tier.ctaExternal ? (
                  <a
                    href={tier.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    id={`btn-${tier.id}`}
                    className={`w-full text-center py-3.5 px-6 rounded-2xl font-bold transition-all duration-300 text-sm ${
                      tier.featured
                        ? 'bg-white text-slate-900 hover:bg-slate-100 shadow-lg shadow-white/10'
                        : 'bg-slate-900 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5'
                    }`}
                  >
                    {tier.cta}
                  </a>
                ) : (
                  <a
                    href={tier.ctaHref}
                    id={`btn-${tier.id}`}
                    className={`w-full text-center py-3.5 px-6 rounded-2xl font-bold transition-all duration-300 text-sm ${
                      tier.featured
                        ? 'bg-white text-slate-900 hover:bg-slate-100 shadow-lg shadow-white/10'
                        : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5'
                    }`}
                  >
                    {tier.cta}
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust note */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            Sudah dipercaya 500+ mahasiswa dari seluruh Indonesia
            <Star size={14} className="text-amber-400 fill-amber-400" />
          </p>
        </motion.div>
      </div>
    </section>
  )
}
