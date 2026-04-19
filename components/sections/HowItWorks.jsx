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
    border: 'border-blue-200',
    ring: 'ring-blue-100',
    connectorColor: 'from-blue-300',
    numberBg: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'step-2',
    number: '02',
    icon: '💬',
    title: 'Diskusi Harga',
    desc: 'Kami konfirmasi harga yang fair sesuai kesulitan dan deadline tugasmu.',
    color: 'bg-violet-500',
    textAccent: 'text-violet-600',
    bgLight: 'bg-violet-50',
    border: 'border-violet-200',
    ring: 'ring-violet-100',
    connectorColor: 'from-violet-300',
    numberBg: 'bg-violet-100 text-violet-700',
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
    border: 'border-cyan-200',
    ring: 'ring-cyan-100',
    connectorColor: 'from-cyan-300',
    numberBg: 'bg-cyan-100 text-cyan-700',
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
    border: 'border-emerald-200',
    ring: 'ring-emerald-100',
    connectorColor: '',
    numberBg: 'bg-emerald-100 text-emerald-700',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      
      {/* Background shapes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-50/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65 }}
          className="text-center mb-20"
        >
          <span className="section-badge mb-5">Cara Kerja</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-4 mb-4">
            Proses Mudah &{' '}
            <span className="text-gradient">Transparan</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-lg mx-auto leading-relaxed">
            Cukup 4 langkah simpel untuk mendapatkan bantuan terbaik dari kami.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
          {steps.map((step, i) => (
            <motion.div
              key={step.id}
              id={step.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group relative flex flex-col items-center text-center"
            >
              {/* Connector line (desktop) */}
              {i < steps.length - 1 && (
                <div
                  className={`hidden lg:block absolute top-10 left-[calc(50%+2.5rem)] right-[calc(-50%+2.5rem)] h-0.5 bg-gradient-to-r ${step.connectorColor} to-transparent pointer-events-none`}
                  aria-hidden="true"
                />
              )}

              {/* Step number badge */}
              <div className={`absolute -top-2.5 left-1/2 -translate-x-1/2 sm:static sm:translate-x-0 sm:mb-0 z-10`}>
                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black ${step.numberBg} mb-3`}>
                  {step.number}
                </span>
              </div>

              {/* Icon circle - Premium look */}
              <motion.div
                whileHover={{ scale: 1.12, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                className={`relative w-24 h-24 rounded-3xl ${step.bgLight} border-2 ${step.border} ring-4 ${step.ring} flex flex-col items-center justify-center mb-7 z-10 shadow-sm group-hover:shadow-md transition-shadow duration-300`}
              >
                <div className="text-4xl leading-none">{step.icon}</div>
              </motion.div>

              <h3 className={`font-display font-bold text-slate-900 text-lg mb-2.5 group-hover:${step.textAccent} transition-colors duration-200`}>
                {step.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-[200px]">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-16"
        >
          <a
            href="/#order-form"
            className="btn-primary inline-flex"
          >
            Mulai Sekarang →
          </a>
        </motion.div>
      </div>
    </section>
  )
}
