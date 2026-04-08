'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, CheckCircle2, Clock, Loader2, AlertCircle, RotateCcw, Star, CalendarClock } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import RatingModal from '@/components/ui/RatingModal'

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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)
  const [existingRating, setExistingRating] = useState(null)
  const [showRating, setShowRating] = useState(false)
  const inputRef = useRef(null)

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

  // Smart Polling (Setiap 15 detik) untuk menggantikan koneksi Realtime yang berisiko
  useEffect(() => {
    if (!order) return
    
    const interval = setInterval(() => {
      fetchOrder(order.order_code, true)
    }, 15000)

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
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">Progress Pengerjaan</span>
                  <motion.span
                    key={order.progress}
                    initial={{ scale: 1.3, color: '#3B82F6' }}
                    animate={{ scale: 1, color: '#2563EB' }}
                    className="text-xl sm:text-2xl font-bold font-display text-blue-600 tabular-nums"
                  >
                    {order.progress}%
                  </motion.span>
                </div>
                <ProgressBar progress={order.progress} />
                <div className="flex justify-between mt-1.5 text-[10px] text-gray-400">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Step timeline */}
              <div>
                <div className="text-[10px] text-gray-400 mb-3 font-semibold tracking-widest uppercase">Tahapan</div>
                <StepIndicator currentStatus={order.status} />
                <div className="flex justify-between mt-2 overflow-hidden">
                  {steps.map((step, i) => (
                    <div key={step.key} className="flex-1 text-center first:text-left last:text-right">
                      <span className="text-[9px] sm:text-[10px] text-gray-400 whitespace-nowrap">{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 sm:p-4">
                  <div className="text-[10px] sm:text-xs font-semibold text-blue-600 mb-1 flex items-center gap-1.5">
                    💬 Catatan Tim
                  </div>
                  <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{order.notes}</p>
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
