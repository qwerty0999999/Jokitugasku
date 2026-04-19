'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react'

const faqs = [
  {
    id: 'faq-1',
    q: 'Berapa lama waktu pengerjaan tugas?',
    a: 'Tergantung jenis dan kompleksitas tugas. Tugas ringan (resume, rangkuman) bisa selesai dalam 2–6 jam. Makalah dan skripsi umumnya 1–3 hari. Kami selalu prioritaskan deadline yang kamu berikan.',
  },
  {
    id: 'faq-2',
    q: 'Apakah hasil tugas dijamin original/tidak plagiat?',
    a: 'Ya, semua tugas dikerjakan dari awal dan merupakan karya orisinal. Kami tidak menggunakan copy-paste dari internet. Jika diminta, kami bisa menyertakan laporan similarity rendah.',
  },
  {
    id: 'faq-3',
    q: 'Bagaimana cara pembayaran?',
    a: 'Pembayaran dilakukan melalui transfer bank, e-wallet (GoPay, OVO, DANA), atau QRIS. Kami menggunakan sistem DP (uang muka) sebelum pengerjaan dan pelunasan setelah selesai.',
  },
  {
    id: 'faq-4',
    q: 'Apakah ada garansi revisi?',
    a: 'Tentu! Semua paket sudah termasuk revisi gratis. Paket Ringan: 1x revisi. Paket Menengah & Premium: revisi unlimited sampai kamu puas.',
  },
  {
    id: 'faq-5',
    q: 'Apakah privasi saya terjaga?',
    a: '100% ya. Data dan tugas kamu bersifat rahasia dan tidak akan dibagikan ke pihak mana pun. Kami menjaga kepercayaan klien sebagai prioritas utama.',
  },
  {
    id: 'faq-6',
    q: 'Bagaimana cara melacak progress tugas saya?',
    a: 'Setelah order, kamu akan mendapatkan kode unik (contoh: JTK-20240401-ABC12). Masukkan kode tersebut di halaman Cek Order kami untuk melihat progress secara realtime.',
  },
  {
    id: 'faq-7',
    q: 'Apakah bisa order mendadak/mepet deadline?',
    a: 'Bisa! Kami melayani order urgent dengan biaya tambahan sesuai tingkat urgensi. Hubungi kami via WhatsApp untuk konfirmasi ketersediaan tim.',
  },
]

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <motion.div
      layout
      className={`rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
        isOpen
          ? 'border-blue-200 bg-blue-50/40 shadow-sm'
          : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
      }`}
    >
      <button
        id={item.id}
        onClick={onToggle}
        className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 group"
        aria-expanded={isOpen}
      >
        <span className={`font-bold text-base leading-snug transition-colors duration-200 ${
          isOpen ? 'text-blue-700' : 'text-slate-800 group-hover:text-slate-900'
        }`}>
          {item.q}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 ${
            isOpen ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
          }`}
        >
          <ChevronDown size={17} strokeWidth={2.5} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
          >
            <div className="px-6 pb-6 text-slate-600 leading-relaxed text-sm border-t border-blue-100/60 pt-4">
              {item.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  const [openId, setOpenId] = useState('faq-1')

  const toggle = (id) => setOpenId(prev => prev === id ? null : id)

  return (
    <section id="faq" className="py-28 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-100 to-transparent" />

      {/* Background decoration */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-blue-50 rounded-full blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65 }}
          className="text-center mb-14"
        >
          <span className="section-badge mb-5">
            <HelpCircle size={13} />
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-4 mb-4">
            Pertanyaan yang{' '}
            <span className="text-gradient">Sering Ditanyakan</span>
          </h2>
          <p className="text-slate-500 text-lg">
            Masih bingung? Temukan jawaban dari pertanyaan umum berikut.
          </p>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3"
        >
          {faqs.map((item) => (
            <FAQItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => toggle(item.id)}
            />
          ))}
        </motion.div>

        {/* CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-10 p-7 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white text-center relative overflow-hidden"
        >
          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-black text-lg mb-2">Tidak menemukan jawaban yang kamu cari?</h3>
            <p className="text-slate-400 text-sm mb-5">Tim kami siap membantu kamu 24/7 via WhatsApp</p>
            <a
              href="/#order-form"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-bold text-sm bg-white text-slate-900 hover:bg-blue-50 hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-black/20"
            >
              <MessageCircle size={17} />
              Tanya Langsung via WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
