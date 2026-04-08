'use client'

import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, AlertCircle, CheckCircle, Copy, Check, ExternalLink, ClipboardList, MessageSquare, Search } from 'lucide-react'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const WA_NUMBER = '6289524894059'

const serviceOptions = [
  { value: 'Joki Tugas (Resume/Laporan)', label: '📄 Joki Tugas (Resume/Laporan)' },
  { value: 'Makalah / Karya Tulis', label: '📝 Makalah / Karya Tulis' },
  { value: 'Skripsi / Thesis', label: '🎓 Skripsi / Thesis' },
  { value: 'Pembuatan PPT', label: '📊 Pembuatan PPT' },
  { value: 'Coding / Website', label: '💻 Coding / Website' },
  { value: 'Analisis Data SPSS', label: '📈 Analisis Data SPSS' },
  { value: 'Lainnya', label: '🔖 Lainnya' },
]

const steps = [
  { icon: ClipboardList, label: 'Isi Form', desc: 'Isi detail tugas' },
  { icon: MessageSquare, label: 'Kirim WA', desc: 'Konfirmasi via WhatsApp' },
  { icon: Search, label: 'Lacak', desc: 'Pantau progress' },
]

function generateOrderCode() {
  const date = new Date()
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `JTK-${ymd}-${rand}`
}

export default function OrderForm() {
  const [orderResult, setOrderResult] = useState(null)
  const [copied, setCopied] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data) => {
    const { name, phone, type, desc, deadline } = data
    const orderCode = generateOrderCode()

    const message = encodeURIComponent(
      `Halo Jokitugasku! 👋\n\nSaya ingin order:\n\n` +
      `📌 *Nama:* ${name}\n` +
      `📞 *No. HP:* ${phone}\n` +
      `📄 *Jenis Layanan:* ${type}\n` +
      `📝 *Deskripsi:* ${desc}\n` +
      (deadline ? `⏰ *Deadline:* ${deadline}\n` : '') +
      `🔖 *Kode Order:* ${orderCode}\n` +
      `\nMohon bantuan konfirmasinya. Terima kasih!`
    )
    window.open(`https://wa.me/${WA_NUMBER}?text=${message}`, '_blank')

    try {
      await supabase.from('orders').insert({
        order_code: orderCode,
        client_name: name,
        client_phone: phone,
        service: type,
        description: desc,
        deadline: deadline || null,
        progress: 0,
        status: 'pending',
      })
    } catch (err) {
      console.warn('Supabase insert skipped:', err.message)
    }

    setOrderResult({ code: orderCode, name })
    reset()
  }

  const copyCode = () => {
    navigator.clipboard.writeText(orderResult.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const inputClass = (hasError) =>
    `w-full bg-white border-2 ${hasError ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-blue-400'}
     rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 text-sm
     focus:outline-none focus:ring-2 focus:ring-blue-500/10
     transition-all duration-200`

  return (
    <section id="order-form" className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="section-badge">Form Order</span>
          <h2 className="section-title">Pesan Sekarang, Mudah & Cepat</h2>
          <p className="section-sub">
            Isi form dan kami langsung hubungimu via WhatsApp.
          </p>
        </motion.div>

        {/* Step indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center justify-center gap-0 mb-10"
        >
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-sm shadow-blue-500/30">
                    <Icon size={16} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">{step.label}</span>
                  <span className="text-xs text-gray-400 hidden sm:block">{step.desc}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-12 sm:w-20 h-px bg-gray-200 mx-2 mb-6" />
                )}
              </div>
            )
          })}
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 md:p-10">

            {/* Success State */}
            <AnimatePresence>
              {orderResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl"
                >
                  <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
                    <CheckCircle size={18} />
                    Order terkirim ke WhatsApp, {orderResult.name}!
                  </div>
                  <p className="text-green-700/80 text-sm mb-4">
                    Simpan kode ini untuk melacak progress tugasmu:
                  </p>
                  <div className="flex items-center gap-3 bg-white border-2 border-green-200 rounded-xl px-4 py-3">
                    <code className="font-mono font-bold text-gray-900 text-base flex-1 tracking-wider">
                      {orderResult.code}
                    </code>
                    <button
                      onClick={copyCode}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium transition-colors"
                    >
                      {copied ? <><Check size={12} />Copied!</> : <><Copy size={12} />Copy</>}
                    </button>
                  </div>
                  <a
                    href={`/tracking?code=${orderResult.code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <ExternalLink size={14} />
                    Cek progress order di sini
                  </a>
                </motion.div>
              )}
            </AnimatePresence>

            <form id="order-form-el" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">

                {/* Nama */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="f-name" className="text-sm font-semibold text-gray-700">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="f-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Contoh: Budi Santoso"
                    className={inputClass(errors.name)}
                    {...register('name', { required: 'Nama wajib diisi' })}
                  />
                  {errors.name && (
                    <span className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.name.message}
                    </span>
                  )}
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="f-phone" className="text-sm font-semibold text-gray-700">
                    No. WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="f-phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="08xxxxxxxxxx"
                    className={inputClass(errors.phone)}
                    {...register('phone', {
                      required: 'Nomor HP wajib diisi',
                      pattern: { value: /^[0-9]{10,15}$/, message: 'Format nomor tidak valid' },
                    })}
                  />
                  {errors.phone && (
                    <span className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.phone.message}
                    </span>
                  )}
                </div>

                {/* Service Type */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="f-type" className="text-sm font-semibold text-gray-700">
                    Jenis Layanan <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="f-type"
                    className={`${inputClass(errors.type)} bg-white`}
                    {...register('type', { required: 'Pilih jenis layanan' })}
                  >
                    <option value="">-- Pilih Layanan --</option>
                    {serviceOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {errors.type && (
                    <span className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.type.message}
                    </span>
                  )}
                </div>

                {/* Deadline */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="f-deadline" className="text-sm font-semibold text-gray-700">
                    Deadline <span className="text-gray-400 font-normal">(opsional)</span>
                  </label>
                  <input
                    id="f-deadline"
                    type="datetime-local"
                    className={`${inputClass(false)} [color-scheme:light]`}
                    {...register('deadline')}
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label htmlFor="f-desc" className="text-sm font-semibold text-gray-700">
                    Deskripsi Tugas <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="f-desc"
                    rows={4}
                    placeholder="Jelaskan detail tugasmu: topik, jumlah halaman, panduan khusus, dll..."
                    className={inputClass(errors.desc)}
                    {...register('desc', { required: 'Deskripsi tugas wajib diisi' })}
                  />
                  {errors.desc && (
                    <span className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.desc.message}
                    </span>
                  )}
                </div>

              </div>

              <button
                type="submit"
                id="btn-order-submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-white text-base
                           bg-[#25D366] hover:bg-[#22c55e]
                           shadow-lg shadow-green-500/20 hover:shadow-green-500/30
                           transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <svg className="animate-spin" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx={12} cy={12} r={10} strokeOpacity={0.25} />
                    <path d="M12 2a10 10 0 0 1 10 10" />
                  </svg>
                ) : (
                  <Send size={18} />
                )}
                {isSubmitting ? 'Mengirim...' : 'Kirim via WhatsApp'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
