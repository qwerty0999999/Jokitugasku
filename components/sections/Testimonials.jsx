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
  {
    stars: 5,
    comment: 'Order mepet deadline berhasil selesai tepat waktu! Kualitasnya mantap banget.',
    client_name: 'Syifa M.',
    service: 'Tugas Pemrograman',
  },
  {
    stars: 5,
    comment: 'Sangat memuaskan! Tim-nya sabar meladeni revisi dan hasilnya melampaui ekspektasi.',
    client_name: 'Rizky A.',
    service: 'Laporan Praktikum',
  },
]

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

const avatarGradients = [
  'from-blue-400 to-blue-600',
  'from-purple-400 to-purple-600',
  'from-emerald-400 to-emerald-600',
  'from-amber-400 to-amber-600',
  'from-rose-400 to-rose-600',
  'from-indigo-400 to-indigo-600',
]

function getAvatarGradient(name = '') {
  const idx = (name.charCodeAt(0) || 0) % avatarGradients.length
  return avatarGradients[idx]
}

function StarDisplay({ stars }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={i <= stars ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'}
        />
      ))}
    </div>
  )
}

function ReviewCard({ r }) {
  return (
    <div className="group relative bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-slate-200 transition-all duration-300 p-7 flex flex-col gap-5 h-full overflow-hidden">
      {/* Top accent */}
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

      {/* Quote icon */}
      <div className="flex items-start justify-between">
        <Quote size={28} className="text-blue-100 fill-blue-50 flex-shrink-0" />
        <StarDisplay stars={r.stars} />
      </div>

      {/* Comment */}
      <p className="text-slate-600 text-sm leading-relaxed flex-1 italic">
        &quot;{r.comment}&quot;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(r.client_name)} flex items-center justify-center text-white text-xs font-black flex-shrink-0 shadow-sm`}>
          {getInitials(r.client_name)}
        </div>
        <div>
          <div className="font-bold text-slate-900 text-sm leading-tight">{r.client_name}</div>
          <div className="text-slate-400 text-xs mt-0.5">{r.service}</div>
        </div>
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

        if (data && data.length >= 1) setReviews(data)
      } catch {
        // fallback ke static
      } finally {
        setLoading(false)
      }
    }

    fetchRatings()

    // Real-time subscription untuk rating baru
    const channel = supabase
      .channel('public:ratings')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'ratings' },
        (payload) => {
          const newReview = payload.new
          // Hanya masukkan jika bintang >= 4 dan ada komentar
          if (newReview.stars >= 4 && newReview.comment) {
            setReviews(prev => {
              // Hindari duplikasi jika ada
              const exists = prev.find(r => r.id === newReview.id)
              if (exists) return prev
              return [newReview, ...prev].slice(0, 9)
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
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
    <section id="testimonials" className="py-28 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      {/* Background blobs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-50 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65 }}
          className="text-center mb-16"
        >
          <span className="section-badge mb-5">Testimoni Nyata</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-4 mb-6">
            Dipercaya Ribuan{' '}
            <span className="text-gradient">Pelajar & Mahasiswa</span>
          </h2>

          {/* Aggregate rating */}
          <div className="inline-flex items-center gap-3 bg-white border border-amber-100 rounded-2xl px-6 py-3 shadow-sm">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-black text-amber-700 text-xl">{avg}</span>
            <span className="text-slate-400 text-sm border-l border-slate-200 pl-3">{reviews.length}+ ulasan</span>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={32} className="animate-spin text-slate-300" />
          </div>
        ) : (
          <>
            {/* Desktop: masonry-style grid */}
            <div className="hidden md:grid grid-cols-3 gap-5">
              {reviews.slice(0, 3).map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.55, delay: i * 0.1 }}
                >
                  <ReviewCard r={r} />
                </motion.div>
              ))}
            </div>

            {/* Baris kedua jika > 3 review */}
            {reviews.length > 3 && (
              <div className="hidden md:grid grid-cols-3 gap-5 mt-5">
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
              <div className="overflow-hidden rounded-3xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ReviewCard r={reviews[current]} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Carousel controls */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={prev}
                  className="p-2.5 rounded-2xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                  aria-label="Sebelumnya"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex gap-2">
                  {reviews.slice(0, 6).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`rounded-full transition-all duration-300 ${
                        i === current ? 'w-6 h-2.5 bg-blue-500' : 'w-2.5 h-2.5 bg-slate-200 hover:bg-slate-300'
                      }`}
                      aria-label={`Review ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={next}
                  className="p-2.5 rounded-2xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
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
