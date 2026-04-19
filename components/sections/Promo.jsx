'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Ticket, Sparkles, Zap, Gift, Stars, Percent } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function Promo() {
  const [promos, setPromos] = useState({})
  const [loading, setLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState('')

  useEffect(() => {
    const fetchPromos = async () => {
      const { data } = await supabase.from('system_settings').select('*').eq('key', 'PROMO_CODES_DB').single()
      if (data?.value) {
        setPromos(JSON.parse(data.value))
      }
      setLoading(false)
    }
    fetchPromos()
  }, [])

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success(`Mantap! Kode ${code} siap digunakan.`, {
      icon: <Gift className="text-indigo-500" size={16} />,
    })
    setTimeout(() => setCopiedCode(''), 3000)
  }

  if (!loading && Object.keys(promos).length === 0) return null

  return (
    <section id="promo" className="py-24 bg-white relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-[11px] font-black uppercase tracking-[0.25em] mb-8 shadow-xl shadow-indigo-200"
          >
            <Stars size={14} className="animate-pulse" /> Penawaran Terbatas
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6 leading-[1.1]">
            Hemat Lebih Banyak,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
              Hasil Tetap Terbaik.
            </span>
          </h2>
          
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            Jangan biarkan tugas menumpuk dan dompet tipis. Pilih promo favoritmu dan amankan slot pengerjaan sekarang!
          </p>
        </div>

        {/* Promo Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {Object.entries(promos).map(([code, data], i) => (
            <motion.div
              key={code}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              {/* Card Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-[2.5rem] blur opacity-0 group-hover:opacity-20 transition duration-500" />
              
              <div className="relative bg-white rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col sm:flex-row overflow-hidden h-full min-h-[220px]">
                
                {/* Left Side: Value */}
                <div className="relative w-full sm:w-1/3 bg-slate-900 flex flex-col items-center justify-center p-8 text-white overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-400 via-transparent to-transparent" />
                  
                  <motion.div 
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="relative z-10 w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 border border-white/20"
                  >
                    {data.type === 'percentage' ? <Percent size={24} /> : <Zap size={24} className="fill-yellow-400 text-yellow-400" />}
                  </motion.div>
                  
                  <div className="relative z-10 text-center">
                    <div className="text-4xl font-black font-display mb-1">
                      {data.type === 'percentage' ? `${data.value * 100}%` : `${data.value / 1000}K`}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">POTONGAN</div>
                  </div>
                  
                  {/* Decorative Ticket Circles */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full hidden sm:block" />
                  <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-white rounded-full hidden sm:block" />
                </div>

                {/* Right Side: Info & Action */}
                <div className="flex-1 p-8 flex flex-col justify-between relative">
                  {/* Dashed Separator for Mobile */}
                  <div className="sm:hidden absolute top-0 left-8 right-8 border-t-2 border-dashed border-slate-100" />
                  
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest">Limited Offer</span>
                      <div className="h-1 w-1 rounded-full bg-slate-200" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Best Deal</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{data.label}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                      {data.description || 'Klaim potongan ini sekarang juga! Berlaku untuk semua jenis layanan joki tugas.'}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-full relative group/code">
                      <div className="absolute inset-0 bg-slate-100 rounded-2xl group-hover/code:bg-indigo-50 transition-colors" />
                      <div className="relative px-5 py-3.5 flex items-center justify-between">
                        <span className="font-mono font-black text-lg text-slate-800 tracking-wider uppercase">{code}</span>
                        <div className="w-px h-6 bg-slate-200 mx-3" />
                        <button
                          onClick={() => copyToClipboard(code)}
                          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-black text-xs uppercase tracking-widest transition-all"
                        >
                          {copiedCode === code ? (
                            <><Check size={14} strokeWidth={3} /> Copied</>
                          ) : (
                            <><Copy size={14} /> Copy</>
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => window.location.href = '/#order-form'}
                      className="w-full sm:w-auto whitespace-nowrap px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.15em] shadow-lg shadow-indigo-100 transition-all active:scale-95"
                    >
                      Gunakan 🚀
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating Decoration */}
        <div className="mt-20 flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl">🎓</div>
             <span className="text-sm font-bold text-slate-400">Untuk Mahasiswa</span>
           </div>
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl">⚡</div>
             <span className="text-sm font-bold text-slate-400">Instan Klaim</span>
           </div>
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl">🛡️</div>
             <span className="text-sm font-bold text-slate-400">100% Terverifikasi</span>
           </div>
        </div>
      </div>
    </section>
  )
}
