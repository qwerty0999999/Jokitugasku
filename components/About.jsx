'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Users, Star, Trophy, Zap } from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Tim Profesional',
    desc: 'Dikerjakan oleh lulusan terbaik dari berbagai universitas ternama.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    ringColor: 'ring-blue-100',
    accentDot: 'bg-blue-500',
  },
  {
    icon: Star,
    title: 'Kualitas Terjamin',
    desc: 'Hasil pengerjaan rapi, bebas plagiasi, dan sesuai instruksi dosen.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    ringColor: 'ring-amber-100',
    accentDot: 'bg-amber-500',
  },
  {
    icon: Trophy,
    title: 'Berpengalaman',
    desc: 'Telah menangani ribuan tugas mahasiswa dari berbagai jurusan.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    ringColor: 'ring-emerald-100',
    accentDot: 'bg-emerald-500',
  },
]

const checkList = [
  'Pengerjaan Cepat & Tepat Waktu',
  'Privasi & Kerahasiaan Terjamin',
  'Revisi Gratis Sampai Puas',
  'Layanan Pelanggan 24/7',
]

export default function About() {
  return (
    <section id="about" className="py-28 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-gradient-to-tl from-slate-50/80 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">

          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-badge mb-6">Tentang Kami</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-4 mb-6 leading-[1.15]">
              Solusi Terpercaya untuk{' '}
              <span className="text-gradient">Kesuksesan Akademikmu</span>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-10">
              Jokitugasku hadir sebagai mitra belajar bagi mahasiswa yang membutuhkan bantuan dalam menyelesaikan berbagai tugas akademik. Kami berkomitmen memberikan hasil terbaik, tepat waktu, dan dengan harga ramah di kantong pelajar.
            </p>

            {/* Checklist */}
            <div className="space-y-3.5 mb-10">
              {checkList.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="flex items-center gap-3.5"
                >
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-50 ring-2 ring-blue-100 flex items-center justify-center">
                    <CheckCircle2 size={15} className="text-blue-600" />
                  </div>
                  <span className="text-slate-700 font-semibold text-sm">{item}</span>
                </motion.div>
              ))}
            </div>

            {/* Social proof strip */}
            <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-2xl border border-slate-100 w-fit">
              <div className="flex -space-x-2.5">
                {['U1', 'U2', 'U3', 'U4'].map((u, i) => (
                  <div
                    key={i}
                    className="inline-flex h-10 w-10 rounded-full ring-2 ring-white bg-gradient-to-br from-blue-100 to-blue-200 items-center justify-center text-[10px] font-bold text-blue-700"
                  >
                    {u}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={13} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs text-slate-500 font-bold leading-none">500+ Mahasiswa Puas</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                className={`group relative p-7 rounded-3xl border-2 border-slate-100 bg-white shadow-sm hover:shadow-lg hover:-translate-y-2 hover:border-slate-200 transition-all duration-300 ${i === 1 ? 'sm:mt-8' : ''}`}
              >
                {/* Accent dot */}
                <div className={`absolute top-5 right-5 w-2 h-2 rounded-full ${feature.accentDot}`} />

                <div className={`w-14 h-14 rounded-2xl ${feature.bg} ring-2 ${feature.ringColor} ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon size={26} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2.5">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}

            {/* Stat Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.35 }}
              className="relative p-7 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl shadow-slate-200 flex flex-col items-center justify-center text-center overflow-hidden"
            >
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent pointer-events-none" />
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500/10 rounded-full blur-xl" />

              <div className="relative">
                <div className="text-5xl font-black text-blue-400 mb-1 leading-none">99%</div>
                <Zap size={16} className="text-blue-300 mx-auto mb-2" />
                <div className="text-xs font-bold tracking-widest uppercase text-slate-400">Tingkat Kelulusan</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
