'use client'

import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, AlertCircle, CheckCircle, Copy, Check, ExternalLink, ClipboardList, MessageSquare, Search, Tag, Loader2, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { WA_NUMBER } from '@/lib/constants'
import { calculateEstimatedPrice } from '@/lib/pricing-logic'
import { toast } from 'sonner'

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

const generateOrderCode = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `JTK-${year}${month}${day}-${random}`
}

export default function OrderForm({ isStandalone = false }) {
  const [orderResult, setOrderResult] = useState(null)
  const [copied, setCopied] = useState(false)
  const [estimatedPrice, setEstimatedPrice] = useState({ original: 0, discount: 0, total: 0 })
  const [dynamicPromos, setDynamicPromos] = useState(null)

  // Fetch dynamic promos on mount
  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const { data } = await supabase.from('system_settings').select('*').eq('key', 'PROMO_CODES_DB').single()
        if (data?.value) {
          setDynamicPromos(JSON.parse(data.value))
        }
      } catch (err) {
        console.warn('Failed to fetch dynamic promos:', err)
      }
    }
    fetchPromos()
  }, [])

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      type: 'Skripsi / Thesis',
      level: 'S1',
      referral: ''
    }
  })

  // Watch fields for price calculation
  const watchType = watch('type')
  const watchLevel = watch('level')
  const watchDeadline = watch('deadline')
  const watchReferral = watch('referral')

  useEffect(() => {
    if (watchType && watchLevel && watchDeadline) {
      const deadlineDate = new Date(watchDeadline)
      const now = new Date()
      const diffTime = Math.max(0, deadlineDate - now)
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
      
      let mappedService = 'Lainnya'
      if (watchType.includes('Skripsi')) mappedService = 'Skripsi/Tesis'
      else if (watchType.includes('SPSS')) mappedService = 'Analisis Data SPSS'
      else if (watchType.includes('Makalah')) mappedService = 'Tugas Makalah'
      else if (watchType.includes('PPT')) mappedService = 'PowerPoint Premium'
      else if (watchType.includes('Coding')) mappedService = 'Pemrograman/Coding'
      
      const priceResult = calculateEstimatedPrice(mappedService, watchLevel, diffHours, watchReferral, dynamicPromos)
      setEstimatedPrice(priceResult)
    } else {
      setEstimatedPrice({ original: 0, discount: 0, total: 0 })
    }
  }, [watchType, watchLevel, watchDeadline, watchReferral, dynamicPromos])

  const onSubmit = async (data) => {
    const { name, phone, email, type, level, desc, deadline, referral } = data
    const orderCode = generateOrderCode()
    const finalPrice = estimatedPrice.total
    const discount = estimatedPrice.discount

    try {
      const orderPayload = {
        order_code: orderCode,
        client_name: name,
        client_phone: phone,
        client_email: email || null,
        service: type,
        description: desc,
        deadline: deadline || null,
        price: finalPrice,
        discount_amount: discount,
        referral_code: referral || null,
        progress: 0,
        status: 'pending',
      }

      const { error: dbError } = await supabase.from('orders').insert(orderPayload)
      if (dbError) throw dbError

      setOrderResult({ code: orderCode, name })
      reset()

      const message = encodeURIComponent(
        `Halo Jokitugasku! 👋\n\nSaya ingin order:\n\n` +
        `📌 *Nama:* ${name}\n` +
        `📞 *No. HP:* ${phone}\n` +
        (email ? `📧 *Email:* ${email}\n` : '') +
        `🎓 *Pendidikan:* ${level}\n` +
        `📄 *Layanan:* ${type}\n` +
        `📝 *Deskripsi:* ${desc}\n` +
        (deadline ? `⏰ *Deadline:* ${deadline}\n` : '') +
        `💰 *Estimasi:* ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(finalPrice)}\n` +
        `🔖 *Kode Order:* ${orderCode}\n` +
        `\nMohon konfirmasinya. Terima kasih!`
      )
      window.open(`https://wa.me/${WA_NUMBER}?text=${message}`, '_blank')

      fetch('/api/broadcast-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderData: orderPayload, type: 'NEW_ORDER' }),
      }).catch(() => {})

    } catch (err) {
      toast.error('Gagal mengirim pesanan. Silakan coba lagi.')
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(orderResult.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Optimized styles for Mobile & Accessibility
  const inputClass = (hasError) =>
    `w-full bg-white border-2 ${hasError ? 'border-red-400 focus:border-red-400' : 'border-slate-200 focus:border-blue-500'}
     rounded-2xl px-5 py-4 text-slate-900 placeholder-slate-400 text-base md:text-sm
     focus:outline-none focus:ring-4 focus:ring-blue-500/5
     transition-all duration-200 shadow-sm`

  return (
    <section 
      id="order-form" 
      className={`${isStandalone ? 'py-0 bg-transparent' : 'py-20 bg-slate-50'} relative overflow-hidden`}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isStandalone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="section-badge mb-4">Form Order</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Pesan Cepat Lewat Web</h2>
            <p className="text-slate-500 mt-4 max-w-lg mx-auto">Isi detail tugasmu dan tim kami akan segera menghubungimu via WhatsApp.</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2.5rem] p-6 sm:p-10 border border-slate-200 shadow-2xl shadow-slate-900/5"
        >
          <AnimatePresence mode="wait">
            {!orderResult ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
                noValidate
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Nama Lengkap */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="f-name" className="text-sm font-black text-slate-700 uppercase tracking-wider ml-1">
                      Nama Lengkap <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="f-name"
                      type="text"
                      placeholder="Masukkan nama Anda"
                      className={inputClass(errors.name)}
                      {...register('name', { required: 'Nama wajib diisi' })}
                    />
                    {errors.name && <span className="text-xs font-bold text-rose-500 flex items-center gap-1 mt-1"><AlertCircle size={12}/> {errors.name.message}</span>}
                  </div>

                  {/* Nomor WhatsApp */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="f-phone" className="text-sm font-black text-slate-700 uppercase tracking-wider ml-1">
                      Nomor HP/WA <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="f-phone"
                      type="tel"
                      inputMode="numeric"
                      placeholder="Contoh: 0812345..."
                      className={inputClass(errors.phone)}
                      {...register('phone', { 
                        required: 'Nomor WA wajib diisi',
                        pattern: { value: /^[0-9+]{8,15}$/, message: 'Nomor tidak valid' }
                      })}
                    />
                    {errors.phone && <span className="text-xs font-bold text-rose-500 flex items-center gap-1 mt-1"><AlertCircle size={12}/> {errors.phone.message}</span>}
                  </div>

                  {/* Jenis Layanan */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="f-service" className="text-sm font-black text-slate-700 uppercase tracking-wider ml-1">
                      Jenis Layanan <span className="text-rose-500">*</span>
                    </label>
                    <select id="f-service" className={inputClass(false)} {...register('type')}>
                      {serviceOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>

                  {/* Pendidikan */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="f-level" className="text-sm font-black text-slate-700 uppercase tracking-wider ml-1">
                      Tingkat Pendidikan <span className="text-rose-500">*</span>
                    </label>
                    <select id="f-level" className={inputClass(false)} {...register('level')}>
                      {levelOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>

                  {/* Deskripsi Tugas */}
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <label htmlFor="f-desc" className="text-sm font-black text-slate-700 uppercase tracking-wider ml-1">
                      Deskripsi Tugas <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="f-desc"
                      placeholder="Jelaskan detail tugas Anda secara singkat..."
                      rows={4}
                      className={inputClass(errors.desc)}
                      {...register('desc', { required: 'Deskripsi wajib diisi' })}
                    />
                    {errors.desc && <span className="text-xs font-bold text-rose-500 flex items-center gap-1 mt-1"><AlertCircle size={12}/> {errors.desc.message}</span>}
                  </div>

                  {/* Deadline */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="f-deadline" className="text-sm font-black text-slate-700 uppercase tracking-wider ml-1">
                      Batas Waktu (Deadline)
                    </label>
                    <input
                      id="f-deadline"
                      type="datetime-local"
                      className={inputClass(false)}
                      {...register('deadline')}
                    />
                  </div>

                  {/* Promo Code */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="f-referral" className="text-sm font-black text-slate-700 uppercase tracking-wider ml-1">
                      Kode Promo / Referral
                    </label>
                    <div className="relative">
                      <input
                        id="f-referral"
                        type="text"
                        placeholder="Contoh: MAHASISWA"
                        className={`${inputClass(false)} uppercase font-black tracking-widest`}
                        {...register('referral')}
                      />
                      <Tag className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    </div>
                  </div>
                </div>

                {/* Pricing Summary - Mobile Friendly */}
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Estimasi Biaya</span>
                    <span className="text-[10px] font-black bg-white px-3 py-1 rounded-full border border-slate-200 text-slate-400">PREVIEW</span>
                  </div>
                  
                  <div className="space-y-2">
                    {estimatedPrice.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Harga Normal</span>
                        <span className="line-through text-slate-400">Rp {estimatedPrice.original.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-end">
                      <span className="text-base font-bold text-slate-900">Total Pembayaran</span>
                      <span className="text-3xl font-black text-blue-600 tabular-nums">
                        Rp {estimatedPrice.total.toLocaleString()}
                      </span>
                    </div>
                    {estimatedPrice.promoLabel && (
                      <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-2 flex items-center gap-1.5">
                        <Sparkles size={12} /> {estimatedPrice.promoLabel} Aktif!
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button - Large Tap Target */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <><Loader2 size={20} className="animate-spin" /> Memproses...</>
                  ) : (
                    <><Send size={20} /> Kirim ke WhatsApp Sekarang</>
                  )}
                </button>

                <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  🛡️ 100% Privasi & Data Terlindungi
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100">
                  <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Terima Kasih, {orderResult.name}!</h3>
                <p className="text-slate-500 mb-8">Pesananmu sudah masuk antrian. Klik tombol di bawah jika WhatsApp tidak terbuka otomatis.</p>
                
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 mb-8 max-w-sm mx-auto">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Kode Tiket Anda</div>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-xl font-black text-slate-900 font-mono tracking-wider">{orderResult.code}</span>
                    <button 
                      onClick={copyCode}
                      className="p-2 hover:bg-white rounded-lg transition-colors text-blue-600"
                    >
                      {copied ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => window.location.href = '/tracking'}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Search size={18} /> Lacak Status Tiket
                  </button>
                  <button
                    onClick={() => setOrderResult(null)}
                    className="w-full py-4 bg-white text-slate-500 border border-slate-200 rounded-2xl font-black text-sm uppercase tracking-widest active:scale-95 transition-all"
                  >
                    Buat Order Baru
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
