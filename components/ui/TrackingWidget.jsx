'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, CheckCircle2, Clock, Loader2, AlertCircle, RotateCcw, Star, CalendarClock, Download, Upload, Receipt } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import RatingModal from '@/components/ui/RatingModal'
import { toast } from 'sonner'

const statusConfig = {
  pending: {
    label: 'Menunggu Konfirmasi',
    color: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    icon: Clock,
    step: 0,
  },
  confirmed: {
    label: 'Order Dikonfirmasi',
    color: 'text-blue-700 bg-blue-50 border-blue-200',
    icon: CheckCircle2,
    step: 1,
  },
  in_progress: {
    label: 'Sedang Dikerjakan',
    color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    icon: Loader2,
    step: 2,
  },
  review: {
    label: 'Dalam Review',
    color: 'text-purple-700 bg-purple-50 border-purple-200',
    icon: RotateCcw,
    step: 3,
  },
  done: {
    label: 'Selesai! 🎉',
    color: 'text-green-700 bg-green-50 border-green-200',
    icon: CheckCircle2,
    step: 4,
  },
  revisi: {
    label: 'Dalam Revisi',
    color: 'text-orange-700 bg-orange-50 border-orange-200',
    icon: RotateCcw,
    step: 3,
  },
}

const steps = [
  { key: 'pending', label: 'Diterima', icon: '📥' },
  { key: 'confirmed', label: 'Dikonfirmasi', icon: '✅' },
  { key: 'in_progress', label: 'Dikerjakan', icon: '⚙️' },
  { key: 'review', label: 'Review', icon: '🔍' },
  { key: 'done', label: 'Selesai', icon: '🎉' },
]

function ProgressBar({ progress }) {
  return (
    <div className="relative w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ background: 'linear-gradient(90deg, #3B82F6, #6366f1)' }}
      />
      {/* Shimmer */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '300%' }}
        transition={{ duration: 2, delay: 1.5, ease: 'easeInOut' }}
        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

function StepIndicator({ currentStatus }) {
  const currentStep = statusConfig[currentStatus]?.step ?? 0
  return (
    <div className="flex items-center w-full gap-1 sm:gap-2">
      {steps.map((step, i) => {
        const done = i <= currentStep
        const active = i === currentStep
        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: active ? 1.15 : 1 }}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold border-2 flex-shrink-0 transition-all duration-500
                ${done
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'bg-white border-gray-200 text-gray-400'
                }
                ${active ? 'ring-4 ring-blue-100' : ''}
              `}
            >
              {done && !active ? <CheckCircle2 size={12} className="sm:w-[14px] sm:h-[14px]" /> : i + 1}
            </motion.div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-0.5 sm:mx-1 transition-all duration-700 ${i < currentStep ? 'bg-blue-400' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function DeadlineCountdown({ deadline }) {
  const [timeLeft, setTimeLeft] = useState('')
  const [isUrgent, setIsUrgent] = useState(false)
  const [isPast, setIsPast] = useState(false)

  useEffect(() => {
    if (!deadline) return
    const calc = () => {
      const targetDate = new Date(deadline)
      if (isNaN(targetDate.getTime())) {
        setTimeLeft('Format deadline salah')
        return
      }
      
      const diff = targetDate - new Date()
      if (diff <= 0) {
        setIsPast(true)
        setTimeLeft('Deadline terlewat')
        return
      }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const d = Math.floor(h / 24)
      setIsUrgent(h < 24)
      setTimeLeft(d > 0 ? `${d}d ${h % 24}h lagi` : `${h}h ${m}m lagi`)
    }
    calc()
    const id = setInterval(calc, 60000)
    return () => clearInterval(id)
  }, [deadline])

  if (!deadline) return null

  return (
    <div className={`flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl text-xs sm:text-sm font-medium border
      ${isPast
        ? 'bg-red-50 border-red-200 text-red-700'
        : isUrgent
          ? 'bg-amber-50 border-amber-200 text-amber-700'
          : 'bg-blue-50 border-blue-100 text-blue-700'
      }`}>
      <CalendarClock size={14} className="flex-shrink-0 sm:w-[15px] sm:h-[15px]" />
      <span className="truncate">
        Deadline:{' '}
        <strong className="whitespace-nowrap">
          {(() => {
            const d = new Date(deadline)
            return isNaN(d.getTime()) ? 'Invalid Date' : d.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
          })()}
        </strong>
        {' '}
        <span className="opacity-70">— {timeLeft}</span>
      </span>
      {isUrgent && !isPast && <span className="animate-pulse flex-shrink-0">⚠️</span>}
    </div>
  )
}

export default function TrackingWidget({ initialCode = '' }) {
  const [inputCode, setInputCode] = useState(initialCode)
  const [order, setOrder] = useState(null)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploadingPayment, setUploadingPayment] = useState(false)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)
  const [existingRating, setExistingRating] = useState(null)
  const [showRating, setShowRating] = useState(false)
  const inputRef = useRef(null)

  const getLogIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={14} className="text-amber-500" />
      case 'confirmed': return <CheckCircle2 size={14} className="text-blue-500" />
      case 'in_progress': return <Loader2 size={14} className="text-indigo-500 animate-spin" />
      case 'review': return <Search size={14} className="text-purple-500" />
      case 'done': return <CheckCircle2 size={14} className="text-emerald-500" />
      case 'revisi': return <RotateCcw size={14} className="text-orange-500" />
      default: return <Clock size={14} className="text-gray-400" />
    }
  }

  const isSupabaseReady = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  useEffect(() => {
    // Focus input on mount
    if (inputRef.current && !initialCode) {
      inputRef.current.focus()
    }
  }, [initialCode])

  const fetchOrder = useCallback(async (searchCode, background = false) => {
    const trimmed = searchCode.trim().toUpperCase()
    if (!trimmed) return
    
    if (!background) {
      setLoading(true)
      setError('')
      setExistingRating(null)
    }

    try {
      const response = await fetch(`/api/track-order?code=${trimmed}`)
      const result = await response.json()

      if (!response.ok) {
        if (!background) {
          setError(result.error || 'Terjadi kesalahan sistem.')
          setOrder(null)
        }
      } else {
        setOrder(result.order)
        setLogs(result.logs || [])
        setLastUpdated(new Date())
        setExistingRating(result.rating)
        setError('')
      }
    } catch {
      if (!background) {
        setError('Koneksi terputus. Silakan coba lagi.')
        setOrder(null)
      }
    } finally {
      if (!background) setLoading(false)
    }
  }, [])

  // ── SISTEM REAL-TIME (Supabase Channel) ───────────────────────────
  useEffect(() => {
    if (!order?.order_code || !isSupabaseReady) return

    const channel = supabase
      .channel(`order-changes-${order.order_code}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `order_code=eq.${order.order_code}`,
        },
        (payload) => {
          setOrder(payload.new)
          setLastUpdated(new Date())
          toast.info('Status pesanan diperbarui!', { icon: '🔄' })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [order?.order_code, isSupabaseReady])

  // Polling cadangan tetap ada (setiap 1 menit saja) jika Real-time terputus
  useEffect(() => {
    if (!order) return
    const interval = setInterval(() => {
      fetchOrder(order.order_code, true)
    }, 60000)
    return () => clearInterval(interval)
  }, [order, fetchOrder])

  // Auto-fetch if code in URL
  useEffect(() => {
    if (initialCode) fetchOrder(initialCode)
  }, [initialCode, fetchOrder])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchOrder(inputCode)
  }

  const handlePaymentUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !order) return

    setUploadingPayment(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${order.order_code}_receipt_${Math.random().toString(36).substring(7)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('payment-receipts')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: downloadData } = supabase.storage
        .from('payment-receipts')
        .getPublicUrl(fileName)
      
      const publicUrl = downloadData.publicUrl

      const res = await fetch('/api/payment-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_code: order.order_code, payment_receipt_url: publicUrl })
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)

      setOrder(prev => ({ ...prev, payment_receipt_url: publicUrl }))
      toast.success('Bukti pembayaran berhasil diunggah. Menunggu verifikasi admin.')
    } catch (err) {
      console.error(err)
      toast.error('Gagal mengunggah bukti pembayaran: ' + err.message)
      setError('Gagal mengunggah bukti pembayaran: ' + err.message)
    } finally {
      setUploadingPayment(false)
    }
  }

  const cfg = order ? (statusConfig[order.status] ?? statusConfig.pending) : null

  const renderStars = (n) => {
    const starCount = typeof n === 'number' ? Math.max(0, Math.min(5, n)) : 0
    return (
      <span className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} size={14} className={i <= starCount ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'} />
        ))}
      </span>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Rating Modal */}
      {showRating && order && (
        <RatingModal
          order={order}
          onClose={() => {
            setShowRating(false)
            // Re-fetch rating after modal close
            if (isSupabaseReady) {
              supabase.from('ratings').select('*').eq('order_code', order.order_code).single()
                .then(({ data }) => { if (data) setExistingRating(data) })
                .catch(() => {})
            }
          }}
        />
      )}

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={inputRef}
              id="tracking-input"
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Masukkan kode order..."
              className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 focus:border-blue-400 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !inputCode.trim()}
            id="btn-cek-order"
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-blue-600/20 active:scale-95"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            Cek Status
          </button>
        </div>
      </form>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-6"
          >
            <AlertCircle size={16} className="flex-shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence mode="wait">
        {order && cfg && (
          <motion.div
            key={order.order_code}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
          >
            {/* Color accent top bar */}
            <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

            <div className="p-5 sm:p-8 flex flex-col gap-5 sm:gap-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-xs text-gray-400 font-mono mb-1 tracking-wider truncate">{order.order_code}</div>
                  <h3 className="font-display font-bold text-gray-900 text-lg sm:text-xl truncate">{order.service}</h3>
                  <div className="text-gray-400 text-xs sm:text-sm mt-0.5 truncate">
                    Atas nama: <span className="font-medium text-gray-700">{order.client_name}</span>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold border ${cfg.color} flex-shrink-0`}>
                  <cfg.icon size={10} className={`${order.status === 'in_progress' ? 'animate-spin' : ''} sm:w-[12px] sm:h-[12px]`} />
                  {cfg.label}
                </span>
              </div>

              {/* Deadline countdown */}
              {order.deadline && <DeadlineCountdown deadline={order.deadline} />}

              {/* Progress bar */}
              <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50 shadow-inner">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Progress Pengerjaan</span>
                  <motion.span
                    key={order.progress}
                    initial={{ scale: 1.3, color: '#3B82F6' }}
                    animate={{ scale: 1, color: '#2563EB' }}
                    className="text-2xl font-black font-display text-blue-600 tabular-nums"
                  >
                    {order.progress}%
                  </motion.span>
                </div>
                <ProgressBar progress={order.progress} />
              </div>

              {/* Milestone Timeline (Detailed Logs) - MOVED UP and styled better */}
              {logs && logs.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                    <div className="text-xs font-black text-gray-800 tracking-widest uppercase">Riwayat & Milestone</div>
                  </div>
                  <div className="space-y-6 relative">
                    {/* Continuous vertical line */}
                    <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-100 via-gray-100 to-transparent" />
                    
                    {logs.map((log, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={log.id} 
                        className="flex gap-4 relative z-10"
                      >
                        <div className="mt-1 w-6 h-6 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center shadow-sm">
                          {getLogIcon(log.status)}
                        </div>
                        <div className="flex-1 min-w-0 bg-gray-50/30 hover:bg-gray-50 p-3 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                          <div className="flex justify-between items-center mb-1">
                            <div className="text-[11px] font-black text-gray-900 uppercase tracking-tight">
                              {statusConfig[log.status]?.label || log.status}
                            </div>
                            <div className="text-[9px] text-gray-400 font-bold bg-white px-2 py-0.5 rounded-full border border-gray-100 shadow-sm">
                              {new Date(log.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          {log.notes && (
                            <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                              {log.notes}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step timeline */}
              <div className="px-2">
                <div className="text-[10px] text-gray-400 mb-4 font-bold tracking-widest uppercase text-center">Tahapan Utama Pesanan</div>
                <StepIndicator currentStatus={order.status} />
                <div className="flex justify-between mt-3">
                  {steps.map((step, i) => (
                    <div key={step.key} className="flex-1 text-center">
                      <span className={`text-[9px] font-bold uppercase tracking-tighter ${i <= (statusConfig[order.status]?.step ?? 0) ? 'text-blue-600' : 'text-gray-300'}`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <AlertCircle size={40} className="text-amber-500" />
                  </div>
                  <div className="text-[10px] font-black text-amber-600 mb-2 flex items-center gap-1.5 uppercase tracking-widest">
                    📌 Catatan Khusus Admin
                  </div>
                  <p className="text-gray-700 text-xs sm:text-sm leading-relaxed font-medium relative z-10">{order.notes}</p>
                </div>
              )}

              {/* Payment Upload Section */}
              {!order.is_paid && order.status !== 'pending' && order.status !== 'done' && (
                <div className="mt-2 p-4 sm:p-5 bg-indigo-50 border border-indigo-100 rounded-2xl flex flex-col gap-3 shadow-sm">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 bg-indigo-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
                      <Receipt size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-indigo-900">Konfirmasi Pembayaran</div>
                      <div className="text-[10px] text-indigo-600 font-medium">Unggah bukti transfer untuk mempercepat proses</div>
                    </div>
                  </div>
                  
                  {order.payment_receipt_url ? (
                    <div className="bg-white/60 rounded-xl p-3 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-semibold text-indigo-800">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-500" /> Menunggu verifikasi admin
                      </span>
                      <a href={order.payment_receipt_url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-700 underline text-center sm:text-left">Lihat file terunggah</a>
                    </div>
                  ) : (
                    <div className="relative mt-1">
                      <input 
                        type="file" 
                        accept="image/*,.pdf"
                        onChange={handlePaymentUpload} 
                        disabled={uploadingPayment}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                      />
                      <div className={`w-full p-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${uploadingPayment ? 'bg-indigo-100 border-indigo-300' : 'bg-white border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/50'}`}>
                        {uploadingPayment ? (
                          <Loader2 size={24} className="animate-spin text-indigo-500" />
                        ) : (
                          <Upload size={24} className="text-indigo-400" />
                        )}
                        <span className="text-xs font-bold text-indigo-700 text-center">
                          {uploadingPayment ? 'Sedang Mengunggah...' : 'Pilih File Bukti Transfer (Gambar/PDF)'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Rating section — hanya tampil jika status = done */}
              {order.status === 'done' && (
                <div className="border-t border-gray-100 pt-4 sm:pt-5">
                  {existingRating ? (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                      {renderStars(existingRating.stars)}
                      <span className="text-gray-500 italic">&quot;Ulasanmu sudah diterima — terima kasih!&quot; 🙏</span>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="font-semibold text-gray-800 text-xs sm:text-sm">Puas dengan layanan kami?</div>
                        <div className="text-gray-400 text-[10px] sm:text-xs mt-0.5">Berikan ulasan singkat untuk tim kami</div>
                      </div>
                      <button
                        onClick={() => setShowRating(true)}
                        id="btn-beri-rating"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs sm:text-sm font-semibold hover:bg-amber-100 transition-colors"
                      >
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        Beri Rating
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Result Download Section */}
              {order.file_url && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-emerald-900">Hasil Pengerjaan Tersedia</div>
                      <div className="text-[10px] text-emerald-600 font-medium uppercase tracking-wider">Silakan unduh file final Anda</div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    {order.is_paid && (
                      <button 
                        onClick={() => window.open(`/invoice/${order.order_code}`, '_blank')}
                        className="px-4 py-3 bg-white border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
                      >
                        <Receipt size={16} /> Invoice
                      </button>
                    )}
                    <a 
                      href={order.file_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex-1 sm:flex-none px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-emerald-200 flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Download size={16} /> UNDUH HASIL
                    </a>
                  </div>
                </motion.div>
              )}

              {/* Live indicator */}
              <div className="flex items-center justify-between text-[10px] text-gray-400 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                  Realtime
                </div>
                {lastUpdated && (
                  <span>Update: {lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
