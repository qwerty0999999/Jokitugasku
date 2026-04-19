'use client'

import { motion } from 'framer-motion'
import { MessageCircle, Rocket, ArrowRight } from 'lucide-react'
import { WA_NUMBER } from '@/lib/constants'

export default function CTA({ onStartOrder }) {
  return (
    <section id="cta" className="py-24 relative overflow-hidden bg-slate-900">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-dots opacity-[0.1] pointer-events-none" aria-hidden="true" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 text-blue-300 border border-white/10 mb-8 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Gratis, Tanpa Komitmen
          </span>

          <h2 className="font-display text-4xl md:text-6xl font-black text-white leading-[1.1] mb-8 tracking-tight">
            Masih Ragu? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              Konsultasi Dulu Gratis!
            </span>
          </h2>

          <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Tim kami siap membantu 24/7. Tidak ada komitmen — chat dulu, tanya-tanya sepuasnya, baru putuskan kemudian.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button
              onClick={onStartOrder}
              id="cta-btn-order"
              className="group relative px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest text-slate-900 bg-white hover:bg-blue-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(255,255,255,0.2)] w-full sm:w-auto flex items-center justify-center gap-3 overflow-hidden"
            >
              <Rocket size={18} className="text-blue-600 group-hover:animate-bounce" />
              Order Lewat Web
              <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </button>

            <a
              href={`https://wa.me/${WA_NUMBER}?text=Halo%20Jokitugasku!%20Saya%20mau%20konsultasi%20gratis.`}
              target="_blank"
              rel="noopener noreferrer"
              id="cta-btn-wa"
              className="group px-8 py-5 rounded-2xl font-black text-sm uppercase tracking-widest text-white bg-[#25D366] hover:bg-[#20BA5A] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(37,211,102,0.3)] w-full sm:w-auto flex items-center justify-center gap-3"
            >
              <MessageCircle size={20} className="group-hover:rotate-12 transition-transform" />
              Chat WhatsApp
            </a>
          </div>
          
          <div className="mt-12 pt-12 border-t border-white/5 flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              Respon Cepat
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              Privasi Terjamin
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              Revisi Gratis
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
