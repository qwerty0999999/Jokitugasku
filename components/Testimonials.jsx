'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const STATIC_FALLBACK = [
  {
    stars: 5,
    comment: 'Hasil tugasnya keren banget, rapi dan sesuai permintaan. Respon juga super cepat!',
    client_name: 'Rina S.',
    service: 'Makalah / Karya Tulis',
  },
  {
    stars: 5,
    comment: 'Skripsi saya selesai tepat waktu. Sangat profesional dan detail. Highly recommended!',
    client_name: 'Budi P.',
    service: 'Skripsi / Thesis',
  },
  {
    stars: 5,
    comment: 'Analisis SPSS-nya lengkap dan penjelasannya jelas. Nggak nyesel order di sini.',
    client_name: 'Dinda A.',
    service: 'Analisis Data SPSS',
  },
  {
    stars: 5,
    comment: 'PPT presentasi saya jadi kelihatan sangat profesional. Teman-teman sampai kagum!',
    client_name: 'Fajar R.',
    service: 'Pembuatan PPT',
  },
]

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

// Warna avatar berdasarkan karakter pertama
const avatarColors = [
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-green-100 text-green-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-indigo-100 text-indigo-700',
]

function getAvatarColor(name = '') {
  const idx = (name.charCodeAt(0) || 0) % avatarColors.length
  return avatarColors[idx]
}

function StarDisplay({ stars }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={13}
          className={i <= stars ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  )
}

function ReviewCard({ r }) {
  return (
    <div className="premium-card p-6 flex flex-col gap-4 h-full">
      <Quote size={24} className="text-blue-100 fill-blue-50 flex-shrink-0" />
      <p className="text-gray-600 text-sm leading-relaxed flex-1">{r.comment}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar inisial */}
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${getAvatarColor(r.client_name)}`}>
            {getInitials(r.client_name)}
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">{r.client_name}</div>
            <div className="text-gray-400 text-xs">{r.service}</div>
          </div>
        </div>
        <StarDisplay stars={r.stars} />
      </div>
    </div>
  )
}

export default function Testimonials() {
  const [reviews, setReviews] = useState(STATIC_FALLBACK)
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    async function fetchRatings() {
      try {
        const { data } = await supabase
          .from('ratings')
          .select('stars, comment, client_name, service')
          .gte('stars', 4)
          .not('comment', 'is', null)
          .order('created_at', { ascending: false })
          .limit(9)

        if (data && data.length >= 2) setReviews(data)
      } catch {
        // fallback ke static
      } finally {
        setLoading(false)
      }
    }
    fetchRatings()
  }, [])

  // Auto-advance carousel mobile
  useEffect(() => {
    if (reviews.length <= 1) return
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % reviews.length)
    }, 4500)
    return () => clearInterval(id)
  }, [reviews.length])

  const prev = () => setCurrent((c) => (c - 1 + reviews.length) % reviews.length)
  const next = () => setCurrent((c) => (c + 1) % reviews.length)

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1)
    : '5.0'

  return (
    <section id="testimonials" className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-badge">Testimoni Nyata</span>
          <h2 className="section-title">
            Dipercaya Ribuan{' '}
            <span className="text-gradient">Pelajar & Mahasiswa</span>
          </h2>
          {/* Aggregate rating */}
          <div className="inline-flex items-center gap-3 bg-white border border-amber-100 rounded-2xl px-5 py-3 mt-4 shadow-sm">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-bold text-amber-700 text-lg">{avg}</span>
            <span className="text-gray-400 text-sm">{reviews.length}+ ulasan</span>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={28} className="animate-spin text-gray-300" />
          </div>
        ) : (
          <>
            {/* Desktop: grid 3 kolom */}
            <div className="hidden md:grid grid-cols-3 gap-6">
              {reviews.slice(0, 3).map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <ReviewCard r={r} />
                </motion.div>
              ))}
            </div>

            {/* Baris kedua jika > 3 review */}
            {reviews.length > 3 && (
              <div className="hidden md:grid grid-cols-3 gap-6 mt-6">
                {reviews.slice(3, 6).map((r, i) => (
                  <motion.div
                    key={`b-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <ReviewCard r={r} />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Mobile: carousel */}
            <div className="md:hidden relative">
              <div className="overflow-hidden rounded-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ReviewCard r={reviews[current]} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Carousel controls */}
              <div className="flex items-center justify-center gap-4 mt-5">
                <button
                  onClick={prev}
                  className="p-2 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors"
                  aria-label="Sebelumnya"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex gap-1.5">
                  {reviews.slice(0, 6).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`rounded-full transition-all duration-300 ${
                        i === current ? 'w-5 h-2 bg-blue-500' : 'w-2 h-2 bg-gray-200'
                      }`}
                      aria-label={`Review ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={next}
                  className="p-2 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors"
                  aria-label="Berikutnya"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
