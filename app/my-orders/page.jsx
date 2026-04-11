'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, ArrowRight, Package, Clock, CheckCircle2, History, AlertCircle, Receipt, Download } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

const statusConfig = {
  pending: { label: 'Antrian', color: 'text-rose-600 bg-rose-50 border-rose-100' },
  confirmed: { label: 'Dikonfirmasi', color: 'text-blue-600 bg-blue-50 border-blue-100' },
  in_progress: { label: 'Dikerjakan', color: 'text-amber-600 bg-amber-50 border-amber-100' },
  review: { label: 'Review', color: 'text-purple-600 bg-purple-50 border-purple-100' },
  done: { label: 'Selesai', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  revisi: { label: 'Revisi', color: 'text-orange-600 bg-orange-50 border-orange-100' },
}

export default function MyOrdersPage() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const savedPhone = localStorage.getItem('jokitugasku_phone')
    if (savedPhone) {
      setPhone(savedPhone)
      fetchOrders(savedPhone)
    }
  }, [])

  const fetchOrders = async (targetPhone) => {
    if (!targetPhone) return
    setLoading(true)
    setHasSearched(true)
    try {
      const res = await fetch(`/api/my-orders?phone=${encodeURIComponent(targetPhone)}`)
      const data = await res.json()
      if (res.ok) {
        setOrders(data.orders)
        localStorage.setItem('jokitugasku_phone', targetPhone)
      } else {
        toast.error(data.error || 'Gagal memuat riwayat.')
      }
    } catch {
      toast.error('Koneksi bermasalah.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchOrders(phone)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount || 0)
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase tracking-widest mb-4"
          >
            <History size={14} /> User Dashboard
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3"
          >
            Riwayat Pesanan Anda
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 max-w-md mx-auto text-sm font-medium"
          >
            Masukkan nomor WhatsApp yang digunakan saat order untuk melihat semua tiket pengerjaan Anda.
          </motion.p>
        </div>

        {/* Search Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-4 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 mb-10"
        >
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: 0895..."
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-700"
              />
            </div>
            <button 
              disabled={loading || !phone}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
              Cari Pesanan
            </button>
          </form>
        </motion.div>

        {/* Result List */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400"
              >
                <Loader2 className="animate-spin text-blue-500" size={40} />
                <p className="text-sm font-bold uppercase tracking-widest">Mencari data...</p>
              </motion.div>
            ) : orders && orders.length > 0 ? (
              <motion.div 
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 gap-4"
              >
                {orders.map((order, idx) => (
                  <motion.div
                    key={order.order_code}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white border border-slate-100 rounded-[1.5rem] p-5 sm:p-6 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <Package size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">#{order.order_code}</span>
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${statusConfig[order.status]?.color || 'text-slate-500 bg-slate-50'}`}>
                              {statusConfig[order.status]?.label || order.status}
                            </span>
                          </div>
                          <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">{order.service}</h3>
                          <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
                            <span className="flex items-center gap-1"><Clock size={12}/> {formatDate(order.created_at)}</span>
                            <span className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md">{formatCurrency(order.price)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Link 
                          href={`/tracking?code=${order.order_code}`}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95"
                        >
                          Lacak <ArrowRight size={14} />
                        </Link>
                        {order.is_paid && (
                          <Link 
                            href={`/invoice/${order.order_code}`}
                            target="_blank"
                            className="w-12 h-12 flex items-center justify-center bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                            title="Download Invoice"
                          >
                            <Receipt size={20} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : hasSearched ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-16 text-center bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem]"
              >
                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Tidak Ada Pesanan</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto mb-6">
                  Kami tidak menemukan pesanan dengan nomor tersebut. Pastikan nomor yang dimasukkan benar.
                </p>
                <Link href="/#order-form" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-all">
                  Buat Order Baru <ArrowRight size={16} />
                </Link>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Info Card */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 bg-blue-600 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 className="font-bold text-lg">Keamanan Data Terjamin</h4>
              <p className="text-blue-100 text-xs">Akses riwayat pesanan hanya melalui nomor WhatsApp terdaftar.</p>
            </div>
          </div>
          <a href="https://wa.me/6289524894059" target="_blank" rel="noreferrer" className="px-6 py-3 bg-white text-blue-600 font-black rounded-xl text-xs uppercase tracking-widest hover:bg-blue-50 transition-all">
            Bantuan Admin
          </a>
        </motion.div>

      </div>
    </main>
  )
}
