'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import TrackingWidget from '@/components/ui/TrackingWidget'
import Link from 'next/link'
import { MessageCircle, HelpCircle, ArrowRight } from 'lucide-react'

const WA_NUMBER = '6289524894059'

function TrackingContent() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code') || ''
  return <TrackingWidget initialCode={code} />
}

export default function TrackingPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-20">
      {/* Subtle bg */}
      <div className="fixed inset-0 bg-dots opacity-30 pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100 mb-5">
            📦 Tracking Order
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Cek Progress Tugasmu
          </h1>
          <p className="text-gray-400 text-base max-w-sm mx-auto">
            Masukkan kode order yang kamu dapatkan setelah submit form untuk melihat status real-time.
          </p>
        </motion.div>

        {/* Widget */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
        >
          <Suspense fallback={
            <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
              <svg className="animate-spin" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx={12} cy={12} r={10} strokeOpacity={0.25} />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              Memuat...
            </div>
          }>
            <TrackingContent />
          </Suspense>
        </motion.div>

        {/* Helper cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {/* Belum punya kode */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <HelpCircle size={18} className="text-blue-500" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm mb-1">Belum punya kode?</div>
                <p className="text-gray-400 text-xs leading-relaxed mb-3">
                  Kode order dikirim otomatis setelah kamu submit form order.
                </p>
                <Link
                  href="/#order-form"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Buat order sekarang <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>

          {/* Hubungi admin */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                <MessageCircle size={18} className="text-green-500" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm mb-1">Ada kendala?</div>
                <p className="text-gray-400 text-xs leading-relaxed mb-3">
                  Hubungi admin kami langsung via WhatsApp, siap membantu 7 hari/minggu.
                </p>
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=Halo!%20Saya%20butuh%20bantuan%20mengenai%20order%20saya.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 hover:text-green-700 transition-colors"
                >
                  Chat via WhatsApp <ArrowRight size={12} />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
