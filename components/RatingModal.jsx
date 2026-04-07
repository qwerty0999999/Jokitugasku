'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Send, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function RatingModal({ order, onClose }) {
  const [stars, setStars] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const activeStars = hovered || stars

  const handleSubmit = async () => {
    if (!stars) return
    setSubmitting(true)
    try {
      await supabase.from('ratings').insert({
        order_code: order.order_code,
        stars,
        comment: comment.trim() || null,
        service: order.service,
        client_name: order.client_name,
      })
      setDone(true)
      setTimeout(() => onClose(), 2200)
    } catch (err) {
      console.warn('Rating error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const starLabels = ['', 'Buruk', 'Kurang', 'Cukup', 'Bagus', 'Keren banget!']

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative"
        >
          {/* Header */}
          <div className="px-7 pt-7 pb-5 border-b border-gray-100">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>
            <div className="text-2xl mb-1">🎉</div>
            <h2 className="font-display font-bold text-gray-900 text-xl">Tugas Selesai!</h2>
            <p className="text-gray-500 text-sm mt-1">
              Bagaimana pengalamanmu dengan layanan kami?
            </p>
          </div>

          <div className="px-7 py-6">
            {done ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 py-4 text-center"
              >
                <CheckCircle size={48} className="text-green-500" />
                <p className="font-semibold text-gray-900">Terima kasih atas ulasanmu! ✨</p>
                <p className="text-sm text-gray-400">Ulasan tutup otomatis…</p>
              </motion.div>
            ) : (
              <>
                {/* Stars */}
                <div className="flex flex-col items-center gap-3 mb-6">
                  <div
                    className="flex items-center gap-1"
                    onMouseLeave={() => setHovered(0)}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onMouseEnter={() => setHovered(n)}
                        onClick={() => setStars(n)}
                        className="star-btn focus:outline-none"
                        aria-label={`${n} bintang`}
                      >
                        <Star
                          size={38}
                          className={`transition-all duration-100 ${
                            n <= activeStars
                              ? 'fill-amber-400 text-amber-400 scale-110'
                              : 'text-gray-200 fill-gray-200 hover:text-amber-300 hover:fill-amber-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <AnimatePresence mode="wait">
                    {activeStars > 0 && (
                      <motion.span
                        key={activeStars}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-sm font-semibold text-amber-500"
                      >
                        {starLabels[activeStars]}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Comment */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Ceritakan pengalamanmu <span className="text-gray-400 font-normal">(opsional)</span>
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    maxLength={300}
                    placeholder="Tulis ulasan singkat tentang layanan kami…"
                    className="input-base resize-none"
                  />
                  <div className="text-right text-xs text-gray-300 mt-1">{comment.length}/300</div>
                </div>

                {/* Order info */}
                <div className="bg-gray-50 rounded-xl px-4 py-3 mb-5 text-xs text-gray-500">
                  <span className="font-mono text-gray-400">{order.order_code}</span>
                  {' · '}
                  {order.service}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!stars || submitting}
                  id="btn-submit-rating"
                  className="w-full btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {submitting ? (
                    <svg className="animate-spin" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx={12} cy={12} r={10} strokeOpacity={0.25} />
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                  ) : (
                    <Send size={15} />
                  )}
                  {submitting ? 'Mengirim…' : 'Kirim Ulasan'}
                </button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
