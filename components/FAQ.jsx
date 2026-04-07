'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'

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
      className={`border-2 rounded-2xl overflow-hidden transition-colors duration-300 ${
        isOpen ? 'border-blue-200 bg-blue-50/50' : 'border-gray-100 bg-white hover:border-gray-200'
      }`}
    >
      <button
        id={item.id}
        onClick={onToggle}
        className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
        aria-expanded={isOpen}
      >
        <span className={`font-semibold text-base ${isOpen ? 'text-blue-700' : 'text-gray-900'}`}>
          {item.q}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isOpen ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
          }`}
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="px-6 pb-5 text-gray-600 leading-relaxed text-sm border-t border-blue-100 pt-4">
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
    <section id="faq" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-100 to-transparent" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-badge">
            <HelpCircle size={14} />
            FAQ
          </span>
          <h2 className="section-title">Pertanyaan yang Sering Ditanyakan</h2>
          <p className="section-sub">
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

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-10 text-center"
        >
          <p className="text-gray-500 mb-4">Tidak menemukan jawaban yang kamu cari?</p>
          <a
            href="https://wa.me/6281234567890?text=Halo%20Jokitugasku%21%20Saya%20punya%20pertanyaan."
            target="_blank"
            rel="noopener noreferrer"
            id="faq-wa-btn"
            className="btn-primary inline-flex"
          >
            💬 Tanya Langsung via WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  )
}
