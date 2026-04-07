'use client'

import { motion } from 'framer-motion'

const services = [
  {
    id: 'service-joki',
    icon: '📄',
    name: 'Joki Tugas',
    desc: 'Tugas kuliah, laporan, makalah, resume, rangkuman — dikerjakan cepat dan berkualitas.',
    tag: 'Mulai 20K',
    tagColor: 'text-green-700 bg-green-50 border-green-200',
    iconBg: 'bg-green-50',
    iconBorder: 'border-green-100',
    accent: 'group-hover:border-green-300',
  },
  {
    id: 'service-konsultasi',
    icon: '🧠',
    name: 'Konsultasi Skripsi',
    desc: 'Bimbingan proposal, bab 1–5, analisis data SPSS/Warp PLS, dan sidang skripsi.',
    tag: 'Konsultasi Gratis',
    tagColor: 'text-blue-700 bg-blue-50 border-blue-200',
    iconBg: 'bg-blue-50',
    iconBorder: 'border-blue-100',
    accent: 'group-hover:border-blue-300',
  },
  {
    id: 'service-ppt',
    icon: '📊',
    name: 'Pembuatan PPT',
    desc: 'Presentasi profesional, desain menarik, dan siap digunakan untuk sidang atau meeting.',
    tag: 'Mulai 30K',
    tagColor: 'text-purple-700 bg-purple-50 border-purple-200',
    iconBg: 'bg-purple-50',
    iconBorder: 'border-purple-100',
    accent: 'group-hover:border-purple-300',
  },
  {
    id: 'service-coding',
    icon: '💻',
    name: 'Coding & IT',
    desc: 'Website, aplikasi, program Python/Java/PHP, database, dan proyek coding lainnya.',
    tag: 'Custom Price',
    tagColor: 'text-orange-700 bg-orange-50 border-orange-200',
    iconBg: 'bg-orange-50',
    iconBorder: 'border-orange-100',
    accent: 'group-hover:border-orange-300',
  },
]

const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' },
  }),
}

export default function Services() {
  return (
    <section id="services" className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Top border accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-badge">Layanan Kami</span>
          <h2 className="section-title">
            Semua Kebutuhan Akademikmu<br />Ada di Sini
          </h2>
          <p className="section-sub">Dari tugas harian sampai skripsi, kami punya solusinya.</p>
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
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`light-card p-6 flex flex-col gap-4 cursor-default group border-2 border-gray-100 ${service.accent} transition-all duration-300`}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl ${service.iconBg} border ${service.iconBorder} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300`}>
                {service.icon}
              </div>

              <div className="flex-1">
                <h3 className="font-display font-bold text-gray-900 text-lg mb-2">{service.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
              </div>

              <span className={`inline-flex items-center self-start px-3 py-1 rounded-full text-xs font-semibold border ${service.tagColor}`}>
                {service.tag}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
