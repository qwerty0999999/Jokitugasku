'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    id: 'step-1',
    number: '01',
    icon: '📤',
    title: 'Kirim Tugas',
    desc: 'Kirim detail tugas & deadline melalui form atau WhatsApp kami.',
    color: 'bg-blue-500',
    textAccent: 'text-blue-600',
    bgLight: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    id: 'step-2',
    number: '02',
    icon: '💬',
    title: 'Diskusi Harga',
    desc: 'Kami akan konfirmasi harga yang fair sesuai kesulitan dan deadline tugasmu.',
    color: 'bg-violet-500',
    textAccent: 'text-violet-600',
    bgLight: 'bg-violet-50',
    border: 'border-violet-100',
  },
  {
    id: 'step-3',
    number: '03',
    icon: '⚙️',
    title: 'Proses Pengerjaan',
    desc: 'Tim kami langsung mengerjakan dengan teliti dan berkualitas tinggi.',
    color: 'bg-cyan-500',
    textAccent: 'text-cyan-600',
    bgLight: 'bg-cyan-50',
    border: 'border-cyan-100',
  },
  {
    id: 'step-4',
    number: '04',
    icon: '🎉',
    title: 'Revisi & Selesai!',
    desc: 'Hasil dikirim tepat waktu. Revisi gratis sampai kamu puas!',
    color: 'bg-emerald-500',
    textAccent: 'text-emerald-600',
    bgLight: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-100 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-badge">Cara Kerja</span>
          <h2 className="section-title">Proses Mudah & Transparan</h2>
          <p className="section-sub">Cukup 4 langkah simpel untuk mendapatkan bantuan terbaik.</p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-0.5 bg-gradient-to-r from-blue-200 via-violet-200 to-emerald-200 pointer-events-none" />

          {steps.map((step, i) => (
            <motion.div
              key={step.id}
              id={step.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="flex flex-col items-center text-center relative"
            >
              {/* Icon circle */}
              <div className={`relative w-20 h-20 rounded-2xl ${step.bgLight} border-2 ${step.border} flex flex-col items-center justify-center mb-6 z-10 shadow-sm`}>
                <div className="text-3xl leading-none">{step.icon}</div>
                <div className={`${step.textAccent} text-xs font-bold mt-0.5`}>{step.number}</div>
              </div>

              <h3 className="font-display font-bold text-gray-900 text-lg mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-[200px]">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
