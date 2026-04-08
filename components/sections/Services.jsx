'use client'

import { motion } from 'framer-motion'

const services = [
  {
    id: 'service-joki',
    icon: '📄',
    name: 'Joki Tugas',
    desc: 'Tugas kuliah, laporan, makalah, resume, rangkuman — dikerjakan cepat dan berkualitas.',
    tag: 'Mulai 20K',
    tagColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    iconBg: 'bg-emerald-50',
    iconRing: 'ring-emerald-100',
    gradientFrom: 'from-emerald-50',
    gradientTo: 'to-white',
    accentBar: 'bg-emerald-400',
    hoverBorder: 'hover:border-emerald-200',
    hoverShadow: 'hover:shadow-emerald-100/60',
  },
  {
    id: 'service-konsultasi',
    icon: '🧠',
    name: 'Konsultasi Skripsi',
    desc: 'Bimbingan proposal, bab 1–5, analisis data SPSS/Warp PLS, dan sidang skripsi.',
    tag: 'Konsultasi Gratis',
    tagColor: 'text-blue-700 bg-blue-50 border-blue-200',
    iconBg: 'bg-blue-50',
    iconRing: 'ring-blue-100',
    gradientFrom: 'from-blue-50',
    gradientTo: 'to-white',
    accentBar: 'bg-blue-400',
    hoverBorder: 'hover:border-blue-200',
    hoverShadow: 'hover:shadow-blue-100/60',
  },
  {
    id: 'service-ppt',
    icon: '📊',
    name: 'Pembuatan PPT',
    desc: 'Presentasi profesional, desain menarik, dan siap digunakan untuk sidang atau meeting.',
    tag: 'Mulai 30K',
    tagColor: 'text-purple-700 bg-purple-50 border-purple-200',
    iconBg: 'bg-purple-50',
    iconRing: 'ring-purple-100',
    gradientFrom: 'from-purple-50',
    gradientTo: 'to-white',
    accentBar: 'bg-purple-400',
    hoverBorder: 'hover:border-purple-200',
    hoverShadow: 'hover:shadow-purple-100/60',
  },
  {
    id: 'service-coding',
    icon: '💻',
    name: 'Coding & IT',
    desc: 'Website, aplikasi, program Python/Java/PHP, database, dan proyek coding lainnya.',
    tag: 'Custom Price',
    tagColor: 'text-orange-700 bg-orange-50 border-orange-200',
    iconBg: 'bg-orange-50',
    iconRing: 'ring-orange-100',
    gradientFrom: 'from-orange-50',
    gradientTo: 'to-white',
    accentBar: 'bg-orange-400',
    hoverBorder: 'hover:border-orange-200',
    hoverShadow: 'hover:shadow-orange-100/60',
  },
]

const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.13, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export default function Services() {
  return (
    <section id="services" className="py-28 relative overflow-hidden bg-slate-50">
      {/* Top border accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

      {/* Background decoration */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-20 right-0 w-80 h-80 bg-purple-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65 }}
          className="text-center mb-20"
        >
          <span className="section-badge mb-5">Layanan Kami</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mt-4 mb-4">
            Semua Kebutuhan Akademikmu<br />
            <span className="text-gradient">Ada di Sini</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            Dari tugas harian sampai skripsi, kami punya solusi terbaik untuk kamu.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              id={service.id}
              custom={i}
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              whileHover={{ y: -8, transition: { duration: 0.22 } }}
              className={`group relative bg-white rounded-3xl border-2 border-slate-100 ${service.hoverBorder} shadow-sm hover:shadow-xl ${service.hoverShadow} transition-all duration-300 overflow-hidden cursor-default flex flex-col`}
            >
              {/* Top accent bar */}
              <div className={`h-1 w-full ${service.accentBar} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              {/* Gradient bg */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradientFrom} ${service.gradientTo} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

              <div className="relative p-7 flex flex-col gap-5 flex-1">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl ${service.iconBg} ring-2 ${service.iconRing} flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm`}>
                  {service.icon}
                </div>

                <div className="flex-1">
                  <h3 className="font-display font-bold text-slate-900 text-lg mb-2.5">{service.name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{service.desc}</p>
                </div>

                <span className={`inline-flex items-center self-start px-3.5 py-1.5 rounded-full text-xs font-bold border ${service.tagColor}`}>
                  {service.tag}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-14"
        >
          <p className="text-slate-400 text-sm font-medium">
            Tidak yakin layanan apa yang kamu butuhkan?{' '}
            <a
              href={`https://wa.me/6289524894059?text=Halo!%20Saya%20mau%20konsultasi%20dulu.`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline underline-offset-2"
            >
              Konsultasi gratis →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
