'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, Clock, MessageSquare } from 'lucide-react'
import OrderForm from '@/components/ui/OrderForm'

export default function OrderPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-50 to-transparent -z-10" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Top Navigation */}
        <div className="mb-10 flex items-center justify-between">
          <Link 
            href="/"
            className="group flex items-center gap-2.5 text-slate-500 hover:text-blue-600 font-bold transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
              <ArrowLeft size={18} />
            </div>
            Kembali
          </Link>

          <div className="hidden sm:flex items-center gap-6">
            <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <ShieldCheck size={14} className="text-blue-500" />
              100% Aman
            </div>
            <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <Clock size={14} className="text-blue-500" />
              Tepat Waktu
            </div>
          </div>
        </div>

        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-200">
            Secure Checkout
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-6 mb-4">
            Mulai Order <span className="text-gradient">Tugasmu</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Isi detail tugas di bawah ini. Tim kami akan segera menghubungimu via WhatsApp untuk konfirmasi pengerjaan.
          </p>
        </motion.div>

        {/* The Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          <OrderForm isStandalone={true} />
        </motion.div>

        {/* Footer Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-8 border-t border-slate-200 text-center"
        >
          <p className="text-slate-400 text-sm flex items-center justify-center gap-3">
            <MessageSquare size={16} />
            Butuh bantuan sebelum order? 
            <a 
              href="https://wa.me/6289524894059" 
              className="text-blue-600 font-bold hover:underline"
            >
              Chat Admin CS
            </a>
          </p>
        </motion.div>

      </div>
    </main>
  )
}
