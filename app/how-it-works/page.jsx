'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import HowItWorks from '@/components/sections/HowItWorks'

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-all"
          >
            <ArrowLeft size={18} />
            Kembali ke Beranda
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HowItWorks />
        </motion.div>
      </div>
    </main>
  )
}
