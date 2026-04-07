'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Users, Star, Trophy } from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Tim Profesional',
    desc: 'Dikerjakan oleh lulusan terbaik dari berbagai universitas ternama.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Star,
    title: 'Kualitas Terjamin',
    desc: 'Hasil pengerjaan rapi, bebas plagiasi, dan sesuai instruksi dosen.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    icon: Trophy,
    title: 'Berpengalaman',
    desc: 'Telah menangani ribuan tugas mahasiswa dari berbagai jurusan.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
]

export default function About() {
  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-badge mb-6">Tentang Kami</div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
              Solusi Terpercaya untuk <span className="text-gradient">Kesuksesan Akademikmu</span>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              Jokitugasku hadir sebagai mitra belajar bagi mahasiswa yang membutuhkan bantuan dalam menyelesaikan berbagai tugas akademik. Kami berkomitmen memberikan hasil terbaik, tepat waktu, dan dengan harga yang tetap ramah di kantong pelajar.
            </p>

            <div className="space-y-4 mb-10">
              {[
                'Pengerjaan Cepat & Tepat Waktu',
                'Privasi & Kerahasiaan Terjamin',
                'Revisi Gratis Sampai Puas',
                'Layanan Pelanggan 24/7'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                    <CheckCircle2 size={16} className="text-blue-600" />
                  </div>
                  <span className="text-slate-700 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
               <div className="flex -space-x-3 overflow-hidden">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                    U{i}
                  </div>
                ))}
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} fill="currentColor" />)}
                </div>
                <p className="text-xs text-slate-500 font-bold">500+ Mahasiswa Puas</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:pl-10">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`p-8 rounded-[2rem] border border-slate-100 bg-white shadow-soft transition-all duration-300 hover:shadow-floating hover:-translate-y-2 ${i === 1 ? 'sm:mt-8' : ''}`}
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
            
            {/* Stat Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-8 rounded-[2rem] bg-slate-950 text-white shadow-xl shadow-slate-200 flex flex-col items-center justify-center text-center"
            >
              <div className="text-4xl font-black mb-2 text-blue-400">99%</div>
              <div className="text-sm font-bold tracking-widest uppercase opacity-60">Tingkat Kelulusan</div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-gradient-to-tl from-blue-50/50 to-transparent pointer-events-none" />
    </section>
  )
}
