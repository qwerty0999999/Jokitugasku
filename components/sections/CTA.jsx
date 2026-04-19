'use client'

import { motion } from 'framer-motion'
import { WA_NUMBER } from '@/lib/constants'

export default function CTA({ onStartOrder }) {
  return (
    <section id="cta" className="py-24 relative overflow-hidden">
      {/* ... (background tetap sama) */}

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-white/20 text-white border border-white/30 mb-6">
            💬 Gratis, Tanpa Komitmen
          </span>

          <h2 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
            Masih Ragu?{' '}
            <span className="text-yellow-300">Konsultasi Dulu Gratis!</span>
          </h2>

          <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Tim kami siap membantu 24/7. Tidak ada komitmen — chat dulu, putuskan kemudian.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartOrder}
              id="cta-btn-order"
              className="px-8 py-4 rounded-xl font-bold text-slate-900 text-lg bg-white hover:bg-blue-50 shadow-lg transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto justify-center flex items-center gap-2"
            >
              Order Lewat Web
            </button>

            <a
              href={`https://wa.me/${WA_NUMBER}?text=Halo%20Jokitugasku!%20Saya%20mau%20konsultasi%20gratis.`}
              target="_blank"
              rel="noopener noreferrer"
              id="cta-btn-wa"
              className="btn-wa w-full sm:w-auto"
            >
              {/* ... (svg wa tetap sama) */}
              Chat WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
