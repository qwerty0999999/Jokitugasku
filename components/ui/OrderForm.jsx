'use client'

import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, AlertCircle, CheckCircle, Copy, Check, ExternalLink, ClipboardList, MessageSquare, Search } from 'lucide-react'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { WA_NUMBER } from '@/lib/constants'

import { calculateEstimatedPrice } from '@/lib/pricing-logic'
import { useEffect } from 'react'

const serviceOptions = [
  { value: 'Skripsi / Thesis', label: '🎓 Skripsi / Thesis' },
  { value: 'Analisis Data SPSS', label: '📈 Analisis Data SPSS' },
  { value: 'Makalah / Karya Tulis', label: '📝 Makalah / Karya Tulis' },
  { value: 'Pembuatan PPT', label: '📊 Pembuatan PPT' },
  { value: 'Coding / Website', label: '💻 Coding / Website' },
  { value: 'Joki Tugas (Resume/Laporan)', label: '📄 Joki Tugas (Resume/Laporan)' },
  { value: 'Lainnya', label: '🔖 Lainnya' },
]

const levelOptions = [
  { value: 'D3', label: 'Diploma (D3)' },
  { value: 'S1', label: 'Sarjana (S1)' },
  { value: 'S2', label: 'Magister (S2)' },
  { value: 'S3', label: 'Doktor (S3)' },
  { value: 'Umum', label: 'Umum / SMA' },
]

export default function OrderForm() {
  const [orderResult, setOrderResult] = useState(null)
  const [copied, setCopied] = useState(false)
  const [estimatedPrice, setEstimatedPrice] = useState(0)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      type: 'Skripsi / Thesis',
      level: 'S1'
    }
  })

  // Watch fields for price calculation
  const watchType = watch('type')
  const watchLevel = watch('level')
  const watchDeadline = watch('deadline')

  useEffect(() => {
    if (watchType && watchLevel && watchDeadline) {
      const deadlineDate = new Date(watchDeadline)
      const now = new Date()
      const diffTime = Math.max(0, deadlineDate - now)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      // Bersihkan string dari emoji untuk pencocokan harga
      const cleanService = watchType.replace(/[^\w\s/]/gi, '').trim()
      const price = calculateEstimatedPrice(cleanService, watchLevel, diffDays)
      setEstimatedPrice(price)
    } else {
      setEstimatedPrice(0)
    }
  }, [watchType, watchLevel, watchDeadline])

  const onSubmit = async (data) => {
    const { name, phone, type, level, desc, deadline } = data
    const orderCode = generateOrderCode()
    const finalPrice = estimatedPrice

    const message = encodeURIComponent(
      `Halo Jokitugasku! 👋\n\nSaya ingin order:\n\n` +
      `📌 *Nama:* ${name}\n` +
      `📞 *No. HP:* ${phone}\n` +
      `🎓 *Pendidikan:* ${level}\n` +
      `📄 *Layanan:* ${type}\n` +
      `📝 *Deskripsi:* ${desc}\n` +
      (deadline ? `⏰ *Deadline:* ${deadline}\n` : '') +
      `💰 *Estimasi:* ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(finalPrice)}\n` +
      `🔖 *Kode Order:* ${orderCode}\n` +
      `\nMohon konfirmasinya. Terima kasih!`
    )
    window.open(`https://wa.me/${WA_NUMBER}?text=${message}`, '_blank')

    try {
      const orderPayload = {
        order_code: orderCode,
        client_name: name,
        client_phone: phone,
        service: type,
        description: desc,
        deadline: deadline || null,
        price: finalPrice,
        progress: 0,
        status: 'pending',
      }

      await supabase.from('orders').insert(orderPayload)

      // Broadcast ke grup WA Admin via API internal
      fetch('/api/broadcast-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderData: orderPayload,
          type: 'NEW_ORDER'
        }),
      }).catch(err => console.error('Broadcast failed:', err))

    } catch (err) {
      console.warn('Order submission error:', err.message)
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

                {/* Level Pendidikan */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="f-level" className="text-sm font-semibold text-gray-700">
                    Tingkat Pendidikan <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="f-level"
                    className={`${inputClass(errors.level)} bg-white`}
                    {...register('level', { required: 'Pilih tingkat pendidikan' })}
                  >
                    {levelOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Deadline */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="f-deadline" className="text-sm font-semibold text-gray-700">
                    Deadline <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="f-deadline"
                    type="datetime-local"
                    className={`${inputClass(errors.deadline)} [color-scheme:light]`}
                    {...register('deadline', { required: 'Deadline wajib diisi untuk estimasi harga' })}
                  />
                  {errors.deadline && (
                    <span className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.deadline.message}
                    </span>
                  )}
                </div>

                {/* Estimasi Harga (Dinamis) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Estimasi Biaya</label>
                  <div className="h-full bg-blue-50 border-2 border-blue-100 rounded-xl px-4 py-3 flex items-center justify-between">
                    <span className="text-blue-700 font-bold text-lg">
                      {estimatedPrice > 0 
                        ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(estimatedPrice)
                        : 'Menghitung...'
                      }
                    </span>
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-white px-2 py-1 rounded-md border border-blue-100 shadow-sm">
                      Smart Price
                    </span>
                  </div>
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
