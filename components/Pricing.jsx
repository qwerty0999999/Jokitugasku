'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const WA_NUMBER = '6281234567890'

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
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-100 to-transparent" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-badge">Harga</span>
          <h2 className="section-title">Harga Transparan & Terjangkau</h2>
          <p className="section-sub">
            Tidak ada biaya tersembunyi. Harga sesuai kantong mahasiswa.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {pricingTiers.map((tier, i) => (
            <motion.div
              key={tier.id}
              id={tier.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className={`relative rounded-2xl p-8 flex flex-col gap-6 transition-all duration-300
                ${tier.featured
                  ? 'bg-gray-900 border-2 border-gray-900 shadow-2xl shadow-gray-900/20 md:scale-105'
                  : 'bg-white border-2 border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md'
                }`}
            >
              {/* Featured badge */}
              {tier.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                    {tier.badge}
                  </span>
                </div>
              )}

              {/* Header */}
              <div>
                <span className={`text-xs font-semibold uppercase tracking-widest ${tier.featured ? 'text-gray-400' : 'text-gray-400'}`}>
                  {tier.tier}
                </span>
                <h3 className={`font-display font-bold text-xl mt-1 ${tier.featured ? 'text-white' : 'text-gray-900'}`}>
                  {tier.name}
                </h3>
              </div>

              {/* Price */}
              <div>
                <div className={`text-xs ${tier.featured ? 'text-gray-400' : 'text-gray-400'}`}>{tier.priceLabel}</div>
                <div className={`text-4xl font-bold font-display mt-1 ${tier.featured ? 'text-white' : 'text-gray-900'}`}>
                  {tier.price}
                </div>
                <div className={`text-sm mt-1 ${tier.featured ? 'text-gray-400' : 'text-gray-400'}`}>{tier.unit}</div>
              </div>

              {/* Divider */}
              <div className={`h-px ${tier.featured ? 'bg-white/10' : 'bg-gray-100'}`} />

              {/* Features */}
              <ul className="flex flex-col gap-3 flex-1">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
                      ${tier.featured ? 'bg-white/10 text-white' : 'bg-blue-50 text-blue-500'}`}>
                      <Check size={11} strokeWidth={3} />
                    </span>
                    <span className={tier.featured ? 'text-gray-300' : 'text-gray-600'}>{feature}</span>
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
                  className={`w-full text-center py-3 px-6 rounded-xl font-semibold transition-all duration-300 text-sm
                    ${tier.featured
                      ? 'bg-white text-gray-900 hover:bg-gray-100'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                >
                  {tier.cta}
                </a>
              ) : (
                <a
                  href={tier.ctaHref}
                  id={`btn-${tier.id}`}
                  className={`w-full text-center py-3 px-6 rounded-xl font-semibold transition-all duration-300 text-sm
                    ${tier.featured
                      ? 'bg-white text-gray-900 hover:bg-gray-100'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                  {tier.cta}
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
