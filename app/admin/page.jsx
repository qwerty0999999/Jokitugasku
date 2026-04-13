'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Toaster, toast } from 'sonner'
import {
  LogIn, LogOut, RefreshCw, CheckCircle, Clock, Loader2,
  RotateCcw, Search, ChevronDown, Save, Star, TrendingUp,
  Package, Activity, LayoutDashboard, Users, Settings,
  DollarSign, Check, X, Plus, Edit3, Shield, AlertCircle,
  Hash, User, Briefcase, Key, Trash2, MessageCircle, FileUp, Download, Receipt, CalendarClock
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

// ── KONFIGURASI ──────────────────────────────────────────────
const statusOptions = [
  { value: 'pending', label: 'Antrian Baru', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
  { value: 'confirmed', label: 'Dikonfirmasi', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { value: 'in_progress', label: 'Dikerjakan', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  { value: 'review', label: 'Siap Review', icon: Search, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  { value: 'done', label: 'Selesai', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { value: 'revisi', label: 'Revisi', icon: RotateCcw, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
]

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Fungsi pembantu untuk generate OTP acak berbasis waktu (Sinkron Owner & Admin)
const generateSecureOTP = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const date = now.getDate()
  const minute = now.getMinutes()
  
  // Rumus matematika untuk mengacak angka berdasarkan waktu (Seed)
  // Menghasilkan 6 digit yang tampak acak tapi pasti sama di menit yang sama
  const seed = (year * 1000000) + (month * 10000) + (date * 100) + minute
  const scrambled = (seed * 1664525 + 1013904223) % 1000000
  return scrambled.toString().padStart(6, '0')
}

function StatusBadge({ status }) {
  const option = statusOptions.find(o => o.value === status) || statusOptions[0]
  const Icon = option.icon
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border uppercase tracking-wide ${option.color} ${option.bg} ${option.border}`}>
      <Icon size={12} strokeWidth={2.5} />
      {option.label}
    </span>
  )
}

// ── KOMPONEN LOGIN ───────────────────────────────────────────
function LoginForm({ onLogin, onLoginStart }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [userName, setUserName] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const isSupabaseReady = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!isSupabaseReady) {
      setError('Sistem belum terhubung ke database. Periksa Environment Variables di Vercel.')
      setLoading(false)
      return
    }
    
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
      
      if (err) {
        setError('Akses ditolak. Periksa email & password.')
        setLoading(false)
      } else if (data?.user) {
        if (onLoginStart) onLoginStart()
        const name = data.user.user_metadata?.full_name || 'Admin'
        setUserName(name)
        setLoginSuccess(true)
        // Beri waktu lebih untuk menikmati animasi premium (3 detik)
        setTimeout(() => {
          onLogin(data.session)
        }, 3000)
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem. Coba lagi.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Premium Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px]" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-md relative z-10"
      >
        <motion.div 
          layout
          transition={{
            layout: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
            duration: 0.6
          }}
          className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-10 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden"
        >
          
          {/* Shimmer Effect on Success */}
          {loginSuccess && (
            <motion.div 
              initial={{ x: '-150%' }}
              animate={{ x: '150%' }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 z-0"
            />
          )}

          <div className="flex justify-center mb-10 relative z-10">
            <motion.div 
              animate={loginSuccess ? { 
                scale: [1, 0.9, 1.1, 1],
                boxShadow: ["0px 0px 0px rgba(16, 185, 129, 0)", "0px 0px 40px rgba(16, 185, 129, 0.5)", "0px 0px 0px rgba(16, 185, 129, 0)"]
              } : {}}
              className="bg-white rounded-3xl p-5 w-24 h-24 shadow-2xl flex items-center justify-center relative overflow-hidden"
            >
              <Image src="/logo.png" alt="Logo" width={96} height={96} className="w-full h-full object-contain relative z-10" />
              
              <AnimatePresence>
                {loginSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 bg-emerald-500 flex items-center justify-center z-20"
                  >
                    <motion.div
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Check className="text-white" size={40} strokeWidth={4} />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Ripple Effect on Success */}
            {loginSuccess && (
              <motion.div 
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 4, opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 bg-emerald-500/30 rounded-full z-0"
              />
            )}
          </div>

          <AnimatePresence mode="wait">
            {loginSuccess ? (
              <motion.div 
                key="success"
                initial="hidden"
                animate="visible"
                className="text-center relative z-10"
              >
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: { staggerChildren: 0.2 }
                    }
                  }}
                >
                  <motion.span 
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                    className="text-[10px] font-black text-emerald-400 tracking-[0.5em] uppercase mb-2 block"
                  >
                    Login Berhasil
                  </motion.span>
                  
                  <motion.h3 
                    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                    className="text-3xl font-black text-white mb-4 tracking-tight"
                  >
                    Selamat Datang,<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                      {userName}
                    </span>
                  </motion.h3>
                  
                  <motion.div 
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="h-1 w-12 bg-emerald-500/30 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="h-full w-full bg-emerald-500"
                      />
                    </div>
                    <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em]">Menyiapkan Workspace Anda</p>
                  </motion.div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div key="form" exit={{ opacity: 0, scale: 0.95 }}>
                <h1 className="text-3xl font-extrabold text-white text-center mb-2 tracking-tight">Admin Core</h1>
                <p className="text-slate-400 text-xs text-center mb-8 uppercase font-bold tracking-widest">Authorized Access Only</p>
                
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs font-bold text-center flex items-center justify-center gap-2"
                  >
                    <AlertCircle size={14} /> {error}
                  </motion.div>
                )}
                
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-1">
                    <input 
                      type="email" 
                      placeholder="Email Admin" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      required 
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white text-sm outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-600" 
                    />
                  </div>
                  <div className="space-y-1">
                    <input 
                      type="password" 
                      placeholder="Password" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      required 
                      className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white text-sm outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-600" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-[0_10px_30px_rgba(37,99,235,0.3)] active:scale-[0.98]"
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Shield size={20} />} 
                    MASUK SISTEM
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <p className="text-center text-slate-700 text-[9px] mt-10 font-black uppercase tracking-[0.4em] opacity-40">Security Protocol Activated</p>
      </motion.div>
    </div>
  )
}

// ── KOMPONEN OTP MODAL ───────────────────────────────────────
function OTPModal({ isOpen, onClose, onConfirm, loading }) {
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleConfirm = () => {
    if (otp.length < 6) {
      setError('OTP harus 6 digit angka.')
      return
    }
    onConfirm(otp)
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }} 
        className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8 border border-white"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-rose-100">
            <Shield size={36} strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Otorisasi Owner</h3>
          <p className="text-sm text-slate-500 mb-8 px-2 font-medium">
            Penghapusan tiket memerlukan persetujuan. Masukkan <span className="font-bold text-rose-600">OTP SEGERA</span> yang diberikan oleh Owner.
          </p>
          
          <div className="w-full space-y-5">
            <div className="relative">
              <input 
                autoFocus
                type="text" 
                maxLength={6}
                value={otp} 
                onChange={e => {
                  setOtp(e.target.value.replace(/[^0-9]/g, ''))
                  setError('')
                }} 
                placeholder="••••••"
                className="w-full text-center text-4xl font-black tracking-[0.4em] py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 transition-all placeholder:text-slate-200"
              />
            </div>
            
            {error && (
              <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-bold text-rose-500 bg-rose-50 py-2 px-4 rounded-lg">
                {error}
              </motion.p>
            )}
            
            <div className="flex flex-col gap-3 pt-2">
              <button 
                onClick={handleConfirm}
                disabled={loading || otp.length < 6}
                className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-rose-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />} 
                KONFIRMASI HAPUS
              </button>
              <button 
                onClick={onClose}
                disabled={loading}
                className="w-full py-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] hover:text-slate-600 transition-colors"
              >
                Batalkan Tindakan
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ── KOMPONEN ORDER CARD ──────────────────────────────────────
function OrderCard({ order, onSave, currentAdminEmail, adminName, isSuperAdmin }) {
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [formData, setFormData] = useState({
    status: order.status,
    progress: order.progress || 0,
    price: order.price || 0,
    notes: order.notes || '',
    file_url: order.file_url || '',
    is_paid: order.is_paid || false,
    payment_receipt_url: order.payment_receipt_url || ''
  })

  useEffect(() => {
    setFormData({
      status: order.status,
      progress: order.progress || 0,
      price: order.price || 0,
      notes: order.notes || '',
      file_url: order.file_url || '',
      is_paid: order.is_paid || false,
      payment_receipt_url: order.payment_receipt_url || ''
    })
  }, [order])

  const handleStatusChange = (newStatus) => {
    let autoProgress = formData.progress
    if (newStatus === 'pending') autoProgress = 0
    else if (newStatus === 'confirmed') autoProgress = 20
    else if (newStatus === 'in_progress') autoProgress = 50
    else if (newStatus === 'revisi') autoProgress = 70
    else if (newStatus === 'review') autoProgress = 90
    else if (newStatus === 'done') autoProgress = 100
    setFormData({ ...formData, status: newStatus, progress: autoProgress })
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${order.order_code}_${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('order-files')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: downloadData } = supabase.storage
        .from('order-files')
        .getPublicUrl(filePath)
      
      const publicUrl = downloadData.publicUrl

      const { error: updateError } = await supabase
        .from('orders')
        .update({ file_url: publicUrl })
        .eq('order_code', order.order_code)

      if (updateError) throw updateError

      setFormData(prev => ({ ...prev, file_url: publicUrl }))
      toast.success('File berhasil diunggah!')
      onSave()
    } catch (err) {
      toast.error('Gagal upload: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleUpdateAndChat = async (type = 'manual') => {
    setLoading(true)
    let up = { 
      status: formData.status, 
      progress: Number(formData.progress), 
      price: Number(formData.price), 
      notes: formData.notes, 
      is_paid: formData.is_paid,
      processed_by: currentAdminEmail, 
      updated_at: new Date().toISOString() 
    }

    if (type === 'dp') { up.status = 'in_progress'; up.progress = 50 }
    else if (type === 'review') { up.status = 'review'; up.progress = 90 }
    else if (type === 'full') { up.status = 'done'; up.progress = 100; up.is_paid = true }
    else if (order.status === 'pending' && up.status === 'pending') { 
      up.status = 'confirmed'; up.progress = 20 
    }

    // UPDATE VIA SERVER API (ByPass RLS)
    const updateRes = await fetch('/api/admin/update-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_code: order.order_code, updates: up })
    })

    const updateResult = await updateRes.json()

    if (!updateRes.ok) {
      console.error('Update Order Error:', updateResult.error)
      toast.error('Gagal Update Database: ' + (updateResult.error || 'Terjadi kesalahan'))
      setLoading(false)
      return
    }

    // KIRIM EMAIL RECEIPT JIKA LUNAS
    if (up.is_paid && order.client_email) {
      fetch('/api/payment-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_code: order.order_code })
      }).catch(err => console.error('Email receipt failed:', err))
    }

    // BROADCAST: Kirim notifikasi ke grup WhatsApp untuk setiap perubahan penting
    fetch('/api/broadcast-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        orderData: { ...order, ...up }, 
        type: (order.status === 'pending' || !order.processed_by) ? 'CLAIM_ORDER' : 'UPDATE_STATUS',
        adminName: adminName || 'Admin'
      }),
    }).catch(err => console.error('Broadcast Error:', err))

    onSave()

    const phone = order.client_phone.replace(/[^0-9]/g, '').replace(/^0/, '62')
    const harga = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(up.price)
    const dp = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(up.price / 2)
    let msg = ""

    switch (up.status) {
      case 'confirmed': 
        msg = `*KONFIRMASI PESANAN - JOKITUGASKU*\n----------------------------------\n*No. Tiket:* ${order.order_code}\n*Layanan:* ${order.service}\n*Total Biaya:* ${harga}\n----------------------------------\nHalo ${order.client_name}, pesanan diverifikasi. Mohon bayar *DP 50% (${dp})* ke:\n\n*BCA: 1234567890*\n*DANA: +62 895-2489-4059*\n\nTerima kasih!`; 
        break
      case 'in_progress': 
        msg = `*PESANAN DIPROSES*\n----------------------------------\nHalo ${order.client_name}, pembayaran DP diterima. Tiket *${order.order_code}* mulai dikerjakan oleh tim. Mohon ditunggu ya.`; 
        break
      case 'review': 
        msg = `*HASIL PENGERJAAN / REVIEW*\n----------------------------------\nHalo ${order.client_name}, kabar baik! Pesanan *${order.order_code}* sudah selesai.\n\nBerikut kami lampirkan file preview (Watermark). Mohon pelunasan agar file final bisa dikirim.`; 
        break
      case 'revisi': 
        msg = `*PROSES REVISI*\n----------------------------------\nHalo ${order.client_name}, permintaan revisi untuk tiket *${order.order_code}* sedang dikerjakan ulang. Terima kasih.`; 
        break
      case 'done': 
        msg = `*PEMBAYARAN LUNAS & SELESAI*\n----------------------------------\nTerima kasih ${order.client_name}! Pengerjaan tiket *${order.order_code}* tuntas sepenuhnya.${formData.file_url ? `\n\n*Link Unduhan File:*\n${formData.file_url}` : '\nFile final segera dikirim.'} 🙏✨`; 
        break
      default: 
        msg = `Halo ${order.client_name}, ini Admin Jokitugasku terkait tiket ${order.order_code}.`; 
        break
    }

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank')
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!isSuperAdmin) {
      setShowOtpModal(true)
    } else {
      toast.warning('Hapus tiket ini secara permanen?', {
        action: {
          label: 'Ya, Hapus',
          onClick: () => executeDelete()
        },
        cancel: { label: 'Batal' }
      })
    }
  }

  const handleOtpConfirm = async (inputOtp) => {
    const correctOtp = generateSecureOTP()

    if (inputOtp !== correctOtp) {
      toast.error('OTP SALAH! OTP berubah setiap menit. Minta yang terbaru ke Owner.')
      return
    }

    setLoading(true)
    const { data: alreadyUsed } = await supabase.from('used_pins').select('pin').eq('pin', inputOtp).single()
    if (alreadyUsed) {
      toast.error('OTP SUDAH KADALUWARSA!')
      setLoading(false)
      return
    }

    await supabase.from('used_pins').insert([{ pin: inputOtp }])
    await executeDelete()
    setShowOtpModal(false)
  }

  const executeDelete = async () => {
    setLoading(true)
    const { error } = await supabase.from('orders').delete().eq('order_code', order.order_code)
    if (!error) {
      toast.success('Tiket berhasil dihapus')
      onSave()
    }
    else toast.error('Gagal hapus.')
    setLoading(false)
  }

  return (
    <div className={`bg-white transition-all duration-300 rounded-2xl overflow-hidden group ${expanded ? 'border-blue-300 shadow-xl ring-1 ring-blue-100' : 'border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md'}`}>
      <AnimatePresence>
        {showOtpModal && (
          <OTPModal 
            isOpen={showOtpModal} 
            onClose={() => setShowOtpModal(false)} 
            onConfirm={handleOtpConfirm}
            loading={loading}
          />
        )}
      </AnimatePresence>

      <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 cursor-pointer select-none" onClick={() => setExpanded(!expanded)}>
        <div className="flex flex-col gap-1 min-w-[120px]">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Hash size={12} className="text-blue-500" /> TIKET</div>
          <div className="text-sm font-black text-slate-800 bg-slate-100 px-3 py-1 rounded-lg w-fit">{order.order_code}</div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">{order.service}</h3>
            <StatusBadge status={order.status} />
            {order.payment_receipt_url && !order.is_paid && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-200">
                <Receipt size={10} /> Cek Bukti Bayar
              </span>
            )}
            {order.is_paid && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                <CheckCircle size={10} /> Lunas
              </span>
            )}
          </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <User size={14} className="text-slate-400"/> {order.client_name}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <MessageCircle size={14} className="text-emerald-500"/> {order.client_phone || '-'}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              <DollarSign size={12}/> {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(order.price || 0)}
            </div>
            {isSuperAdmin && order.processed_by && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                <Shield size={12}/> {order.processed_by}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-6 mt-4 sm:mt-0">
          <div className="flex flex-col items-start sm:items-end gap-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Progress</div>
            <div className="flex items-center gap-2">
              <div className="text-sm font-bold text-slate-800">{order.progress || 0}%</div>
              <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${order.progress || 0}%` }} />
              </div>
            </div>
          </div>
          {order.deadline && (
            <div className="hidden md:flex flex-col items-end gap-1">
              <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Deadline</div>
              <div className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md border border-rose-100">
                {formatDate(order.deadline)}
              </div>
            </div>
          )}
          <div className={`p-2 rounded-xl transition-all duration-300 ${expanded ? 'bg-blue-100 text-blue-600 rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'}`}>
            <ChevronDown size={20} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-slate-50 border-t border-slate-200 overflow-hidden">
            <div className="p-5 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                    <Briefcase size={14} className="text-blue-500" /> Deskripsi Tugas
                  </label>
                  <div className="p-4 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 whitespace-pre-wrap shadow-sm">
                    {order.description || 'Tidak ada deskripsi.'}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600">Status Pengerjaan</label>
                  <select value={formData.status} onChange={e => handleStatusChange(e.target.value)} className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                    {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label.toUpperCase()}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600">Progres: {formData.progress}%</label>
                  <input type="range" min="0" max="100" step="5" value={formData.progress} onChange={e => setFormData({...formData, progress: Number(e.target.value)})} className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-3" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600">Total Biaya (Rp)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">Rp</span>
                    <input type="text" value={new Intl.NumberFormat('id-ID').format(formData.price || 0)} onChange={e => setFormData({...formData, price: Number(e.target.value.replace(/[^0-9]/g, ''))})} className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="0" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600">Catatan / Tracking</label>
                  <input type="text" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Misal: Sedang mencari referensi..." />
                </div>
                
                {/* File Upload Section */}
                <div className="space-y-2 md:col-span-2 pt-2 border-t border-slate-200">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2 mb-2">
                    <FileUp size={14} className="text-blue-500" /> Hasil Pengerjaan (File Final)
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="relative flex-1 w-full">
                      <input 
                        type="file" 
                        onChange={handleFileUpload} 
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                      />
                      <div className={`w-full p-4 border-2 border-dashed rounded-xl flex items-center justify-center gap-3 transition-all ${uploading ? 'bg-slate-100 border-slate-300' : 'bg-white border-blue-200 hover:border-blue-400 hover:bg-blue-50/30'}`}>
                        {uploading ? (
                          <Loader2 size={20} className="animate-spin text-blue-500" />
                        ) : (
                          <FileUp size={20} className="text-blue-500" />
                        )}
                        <span className="text-sm font-bold text-slate-600">
                          {uploading ? 'Sedang Mengunggah...' : 'Pilih atau Seret File ke Sini'}
                        </span>
                      </div>
                    </div>

                    {formData.file_url && (
                      <a 
                        href={formData.file_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 px-5 py-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-all w-full sm:w-auto justify-center"
                      >
                        <Download size={18} /> Lihat/Unduh Hasil
                      </a>
                    )}
                  </div>
                </div>

                {/* Payment Verification Section */}
                <div className="space-y-2 md:col-span-2 pt-2 border-t border-slate-200">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2 mb-2">
                    <Receipt size={14} className="text-emerald-500" /> Verifikasi Pembayaran
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {formData.payment_receipt_url ? (
                      <a href={formData.payment_receipt_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold border border-indigo-200 hover:bg-indigo-100 transition-all flex-1 justify-center sm:justify-start">
                        <Download size={18} /> Lihat Bukti Transfer Klien
                      </a>
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 text-slate-400 rounded-xl text-sm font-medium border border-slate-200 flex-1 flex items-center gap-2">
                        Belum ada bukti transfer diunggah.
                      </div>
                    )}
                    
                    <label className="flex items-center gap-3 cursor-pointer p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-emerald-300 transition-all">
                      <input 
                        type="checkbox" 
                        checked={formData.is_paid} 
                        onChange={e => setFormData({ ...formData, is_paid: e.target.checked })} 
                        className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                      />
                      <span className="text-sm font-bold text-slate-700">Tandai Lunas</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 sm:p-6 bg-slate-900 rounded-2xl text-white shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pesan Cepat WhatsApp</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button onClick={() => handleUpdateAndChat('dp')} className="py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-2">
                    Tagih DP 50%
                  </button>
                  <button onClick={() => handleUpdateAndChat('review')} className="py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-2">
                    Kirim Preview
                  </button>
                  <button onClick={() => window.open(`/invoice/${order.order_code}`, '_blank')} className="py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-2">
                    <Receipt size={14} /> Lihat Invoice
                  </button>
                  <button onClick={() => handleUpdateAndChat('full')} className="py-3 px-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold uppercase shadow-lg shadow-blue-900/50 transition-all active:scale-95 flex items-center justify-center gap-2 sm:col-span-3">
                    Pelunasan & Selesai
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link 
                  href={`/admin/orders/${order.order_code}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-sm font-bold uppercase tracking-wide transition-all border border-blue-200"
                >
                  <ExternalLink size={18} /> Detail Lengkap & Instruksi
                </Link>
                <button onClick={() => handleUpdateAndChat('manual')} disabled={loading} className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold uppercase tracking-wide transition-all shadow-md active:scale-95 disabled:opacity-50">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Simpan & Chat Kustom
                </button>
                <button onClick={handleDelete} className="py-3 px-6 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl text-sm font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 active:scale-95 border border-rose-200 hover:border-transparent">
                  <Trash2 size={18} /> Hapus
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── KOMPONEN REVISION CARD ───────────────────────────────────
function RevisionCard({ rev, onRefresh, currentAdminEmail }) {
  const [loading, setLoading] = useState(false)
  const updateS = async (s) => { 
    setLoading(true)
    await supabase.from('revisions').update({ status: s, processed_by: currentAdminEmail }).eq('id', rev.id)
    onRefresh()
    setLoading(false) 
  }
  
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-black">R</div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Tiket #{rev.order_code}</span>
            <div className="text-xs font-black text-orange-500 uppercase">Menunggu Revisi</div>
          </div>
        </div>
        <button onClick={() => {
          toast.warning('Hapus permintaan revisi?', {
            action: {
              label: 'Ya, Hapus',
              onClick: async () => {
                await supabase.from('revisions').delete().eq('id', rev.id)
                toast.success('Revisi dihapus')
                onRefresh()
              }
            },
            cancel: { label: 'Batal' }
          })
        }} className="text-slate-300 hover:text-rose-500 transition-colors bg-slate-50 p-2 rounded-lg">
          <X size={16} />
        </button>
      </div>
      <h4 className="font-bold text-slate-900 mb-3 text-lg">{rev.orders?.client_name} <span className="text-slate-400 font-medium text-base">· {rev.orders?.service}</span></h4>
      <div className="p-4 bg-slate-50 rounded-xl text-sm text-slate-700 italic border border-slate-200 mb-5 relative">
        <div className="absolute top-2 left-2 text-slate-300">&quot;</div>
        <div className="px-4">{rev.note}</div>
        <div className="absolute bottom-2 right-2 text-slate-300">&quot;</div>
      </div>
      <button onClick={() => updateS('done')} disabled={loading} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl uppercase tracking-widest shadow-md active:scale-95 transition-all flex items-center justify-center gap-2">
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Tandai Selesai
      </button>
    </div>
  )
}

// ── KOMPONEN RATING CARD ─────────────────────────────────────
function RatingCard({ r, onRefresh }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative group hover:shadow-lg transition-all flex flex-col justify-between">
      <button onClick={() => {
        toast.warning('Hapus ulasan ini?', {
          action: {
            label: 'Ya, Hapus',
            onClick: async () => {
              await supabase.from('ratings').delete().eq('id', r.id)
              toast.success('Ulasan dihapus')
              onRefresh()
            }
          },
          cancel: { label: 'Batal' }
        })
      }} className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all bg-slate-50 p-2 rounded-lg">
        <X size={16} />
      </button>
      <div>
        <div className="flex items-center gap-1 mb-4">
          {[1,2,3,4,5].map(i => <Star key={i} size={18} className={i <= r.stars ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />)}
        </div>
        <p className="text-sm font-medium text-slate-700 italic mb-6 line-clamp-4">&quot;{r.comment || 'Tanpa komentar.'}&quot;</p>
      </div>
      <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">
          {r.client_name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900">{r.client_name || 'Anonim'}</div>
          <div className="text-xs font-medium text-slate-500">{formatDate(r.created_at)}</div>
        </div>
      </div>
    </div>
  )
}

// ── MANAJEMEN ADMIN ──────────────────────────────────────────
function AdminManagement({ orders, ratings, admins, fetchAdmins, loading: externalLoading }) {
  const [loading, setLoading] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [targetId, setTargetId] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  // Hitung performa per admin
  const adminStats = useMemo(() => {
    return admins.map(admin => {
      const adminOrders = orders.filter(o => o.processed_by === admin.email)
      const doneOrders = adminOrders.filter(o => o.status === 'done')
      const totalRevenue = doneOrders.reduce((acc, o) => acc + (o.price || 0), 0)
      
      const adminRatings = ratings.filter(r => 
        orders.find(o => o.order_code === r.order_code)?.processed_by === admin.email
      )
      const avgRating = adminRatings.length 
        ? (adminRatings.reduce((s, r) => s + r.stars, 0) / adminRatings.length).toFixed(1) 
        : 0

      return {
        email: admin.email,
        name: admin.user_metadata?.full_name || 'Admin',
        total: adminOrders.length,
        done: doneOrders.length,
        revenue: totalRevenue,
        rating: avgRating
      }
    })
  }, [admins, orders, ratings])

  const handleAction = async (e) => { 
    if (e) e.preventDefault()
    const { data: { session: s } } = await supabase.auth.getSession()
    let payload = { action: modalMode === 'create' ? 'create' : 'update-user', userId: targetId }
    
    if (modalMode === 'create') { 
      if (!form.email || !form.password) return toast.error('Lengkapi data email & password!')
      payload = { ...form, action: 'create' } 
    } else { 
      payload = { ...form, action: 'update-user', userId: targetId }
      if (!payload.email) delete payload.email
      if (!payload.password) delete payload.password
    }
    
    setLoading(true)
    try { 
      const res = await fetch('/api/admin/manage-users', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${s?.access_token}` }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (data.error) toast.error(data.error)
      else { 
        toast.success(data.message)
        setIsModalOpen(false)
        setForm({ email: '', password: '', name: '' })
        fetchAdmins() 
      } 
    } catch (e) { toast.error("Terjadi kesalahan sistem") } 
    setLoading(false) 
  }

  const closeModal = () => { setIsModalOpen(false); setForm({ name: '', email: '', password: '' }) }
  const openModal = (mode, admin = null) => { 
    setModalMode(mode)
    if (admin) { 
      setTargetId(admin.id)
      setForm({ name: admin.user_metadata?.full_name || '', email: admin.email, password: '' }) 
    } else { 
      setTargetId(null)
      setForm({ name: '', email: '', password: '' }) 
    } 
    setIsModalOpen(true) 
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Manajemen Tim</h2>
          <p className="text-sm text-slate-500">Atur akses dan pantau performa tim admin</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowStats(!showStats)} 
            className={`px-4 py-3 rounded-xl text-sm font-bold border transition-all flex items-center gap-2 ${showStats ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            <TrendingUp size={18} /> {showStats ? 'Tutup Statistik' : 'Lihat Performa'}
          </button>
          <button onClick={() => openModal('create')} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 transition-all text-center">
            <Plus size={18} /> Tambah Admin
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showStats && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {adminStats.map(stat => (
                <div key={stat.email} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Users size={80} />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black">
                      {stat.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{stat.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]">{stat.email}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selesai</div>
                      <div className="text-xl font-black text-slate-800">{stat.done} <span className="text-[10px] text-slate-400 font-normal">/ {stat.total}</span></div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rating</div>
                      <div className="text-xl font-black text-amber-500 flex items-center gap-1">
                        {stat.rating} <Star size={14} className="fill-amber-400" />
                      </div>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-slate-50">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Omzet Dihasilkan</div>
                      <div className="text-base font-black text-emerald-600">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(stat.revenue)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center gap-2 font-bold text-slate-800">
          <Users size={20} className="text-blue-600" /> Personel Terdaftar
        </div>
        <div className="divide-y divide-slate-100">
          {admins.map(a => (
            <div key={a.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shadow-sm ${a.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                  {a.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-base font-bold text-slate-900">{a.user_metadata?.full_name || 'Tanpa Nama'}</div>
                  <div className="text-xs font-medium text-slate-500">{a.email}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openModal('edit', a)} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all rounded-lg">
                  <Edit3 size={18} />
                </button>
                {a.email !== process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL && (
                  <button onClick={() => {
                    toast.warning(`Hapus admin ${a.email}?`, {
                      action: {
                        label: 'Ya, Hapus',
                        onClick: async () => {
                          setLoading(true)
                          const { data: { session: s } } = await supabase.auth.getSession()
                          const res = await fetch('/api/admin/manage-users', { 
                            method: 'POST', 
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${s?.access_token}` }, 
                            body: JSON.stringify({ action: 'delete', userId: a.id }) 
                          })
                          const data = await res.json()
                          if (data.error) toast.error(data.error)
                          else {
                            toast.success('Admin berhasil dihapus')
                            fetchAdmins()
                          }
                          setLoading(false)
                        }
                      },
                      cancel: { label: 'Batal' }
                    })
                  }} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all rounded-lg">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">{modalMode === 'create' ? 'Tambah Admin' : 'Edit Admin'}</h3>
                <button onClick={closeModal} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"><X size={20}/></button>
              </div>
              <form onSubmit={handleAction} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Nama Lengkap</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="Nama" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Email</label>
                  <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder="admin@example.com" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">Password</label>
                  <input required={modalMode === 'create'} type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" placeholder={modalMode === 'create' ? 'Password' : 'Biarkan kosong jika tak diubah'} />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2">
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Simpan Data
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── PENGATURAN PERSONAL ──────────────────────────────────────
function PersonalSettings({ session, onRefresh, isSuperAdmin, stats }) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: session?.user?.user_metadata?.full_name || '', password: '' })
  
  const handleUpdate = async (e) => { 
    e.preventDefault()
    setLoading(true)
    const updateData = { data: { full_name: form.name } }
    if (form.password) { 
      if (form.password.length < 6) { 
        setLoading(false)
        return toast.error('Password minimal 6 karakter!')
      }
      updateData.password = form.password 
    }
    const { error } = await supabase.auth.updateUser(updateData)
    if (error) toast.error(`Gagal: ${error.message}`)
    else { 
      toast.success('Profil berhasil diperbarui!')
      setForm({ ...form, password: '' })
      onRefresh() 
    }
    setLoading(false)
  }

  const currentOtp = generateSecureOTP()

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
              <User size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Profil Saya</h3>
              <p className="text-sm text-slate-500">Perbarui identitas akun Anda</p>
            </div>
          </div>
          
          {isSuperAdmin && (
            <div className="bg-amber-50 border border-amber-200 px-4 py-3 rounded-xl min-w-[200px]">
              <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Key size={12}/> OTP HAPUS AKTIF
              </div>
              <div className="text-2xl font-black text-amber-600 tracking-[0.2em] font-mono">{currentOtp}</div>
              <div className="text-[9px] font-bold text-amber-500 uppercase mt-1">Berubah setiap menit</div>
            </div>
          )}
        </div>
        
        <form onSubmit={handleUpdate} className="space-y-5 max-w-xl">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">Email (Tidak dapat diubah)</label>
            <input disabled value={session?.user?.email} className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-500 outline-none cursor-not-allowed" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">Nama Lengkap</label>
            <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">Ganti Password</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Kosongkan jika tidak ingin ganti" />
          </div>
          <button type="submit" disabled={loading} className="py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 w-full md:w-auto">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Simpan Perubahan
          </button>
        </form>
      </div>

      {isSuperAdmin && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-rose-600" size={24} />
            <h3 className="text-xl font-black text-rose-900">Database Maintenance</h3>
          </div>
          <p className="text-sm text-rose-700 mb-6">Pembersihan data akan menghapus semua tiket yang telah berstatus &quot;Selesai&quot;. Tindakan ini tidak dapat dibatalkan.</p>
          <button 
            onClick={() => {
              toast.warning('Yakin ingin menghapus semua data selesai?', {
                action: {
                  label: 'Ya, Bersihkan',
                  onClick: async () => {
                    const { error } = await supabase.from('orders').delete().eq('status', 'done')
                    if (error) toast.error(error.message)
                    else { 
                      toast.success('Data selesai berhasil dibersihkan')
                      onRefresh() 
                    }
                  }
                },
                cancel: { label: 'Batal' }
              })
            }} 
            disabled={stats?.done === 0} 
            className="py-3 px-6 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 w-full md:w-auto"
          >
            <RotateCcw size={18} /> Bersihkan {stats?.done || 0} Data Selesai
          </button>
        </div>
      )}
    </div>
  )
}

// ── PENGATURAN WHATSAPP ──────────────────────────────────────
function WASettingsUI({ token, setToken, groupId, setGroupId, onSave, loading }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
            <MessageCircle size={28} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Integrasi WhatsApp Gateway</h3>
            <p className="text-sm text-slate-500">Hubungkan sistem dengan grup WhatsApp admin</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 max-w-2xl">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Fonnte API Token</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password"
                value={token}
                onChange={e => setToken(e.target.value)}
                placeholder="Masukkan token dari fonnte.com"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              />
            </div>
            <p className="text-[10px] text-slate-400 italic">Dapatkan token di dashboard fonnte.com setelah scan QR.</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">WhatsApp Group ID</label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                value={groupId}
                onChange={e => setGroupId(e.target.value)}
                placeholder="Contoh: 1234567890@g.us"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              />
            </div>
            <p className="text-[10px] text-slate-400 italic">Gunakan fitur &apos;Get Groups&apos; di Fonnte untuk mendapatkan ID grup Admin.</p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button 
              onClick={onSave}
              disabled={loading || !token || !groupId}
              className="px-8 py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-green-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Simpan Konfigurasi
            </button>
            <a 
              href="https://fonnte.com" 
              target="_blank" 
              rel="noreferrer"
              className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition-all text-center"
            >
              Buka Fonnte.com
            </a>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-sm text-blue-800">
        <h4 className="font-bold flex items-center gap-2 mb-2">💡 Petunjuk Penggunaan:</h4>
        <ul className="list-disc list-inside space-y-1 opacity-90">
          <li>Pastikan nomor WA sudah aktif di dashboard gateway.</li>
          <li>ID Grup Admin Jokitugasku.id harus sesuai agar notifikasi tidak salah kirim.</li>
          <li>Perubahan di sini langsung aktif tanpa perlu redeploy website.</li>
        </ul>
      </div>
    </div>
  )
}

// ── KOMPONEN KALENDER DEADLINE ──────────────────────────────
function DeadlineCalendar({ orders, onSelectOrder }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay()
  
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  const totalDays = daysInMonth(year, month)
  const startDay = firstDayOfMonth(year, month)
  
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
  
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const getOrdersForDay = (day) => {
    return orders.filter(o => {
      if (!o.deadline) return false
      const d = new Date(o.deadline)
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year
    })
  }

  const calendarDays = []
  for (let i = 0; i < startDay; i++) calendarDays.push(null)
  for (let i = 1; i <= totalDays; i++) calendarDays.push(i)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{monthNames[month]} {year}</h3>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-widest mt-1">Pantau Semua Tenggat Waktu</p>
          </div>
          <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <button onClick={prevMonth} className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-600"><ChevronDown size={20} className="rotate-90" /></button>
            <button onClick={() => setCurrentDate(new Date())} className="px-4 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:shadow-sm rounded-xl transition-all text-blue-600">Hari Ini</button>
            <button onClick={nextMonth} className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-600"><ChevronDown size={20} className="-rotate-90" /></button>
          </div>
        </div>

        <div className="grid grid-cols-7 mb-4 border-b border-slate-100 pb-4">
          {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map(d => (
            <div key={d} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-3">
          {calendarDays.map((day, i) => {
            const dayOrders = day ? getOrdersForDay(day) : []
            const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()
            
            return (
              <div key={i} className={`min-h-[100px] sm:min-h-[140px] p-2 sm:p-3 rounded-2xl border transition-all flex flex-col gap-2 ${day ? 'bg-white border-slate-100 hover:border-blue-300 hover:shadow-md' : 'bg-slate-50/50 border-transparent'} ${isToday ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}>
                {day && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-black ${isToday ? 'bg-blue-600 text-white w-7 h-7 flex items-center justify-center rounded-lg shadow-lg shadow-blue-200' : 'text-slate-400'}`}>{day}</span>
                      {dayOrders.length > 0 && <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{dayOrders.length} Tugas</span>}
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar max-h-[80px] sm:max-h-[100px]">
                      {dayOrders.map(o => (
                        <button 
                          key={o.id} 
                          onClick={() => onSelectOrder(o.order_code)}
                          className={`w-full text-left p-1.5 rounded-lg text-[9px] font-bold border truncate hover:scale-[1.02] transition-transform ${o.status === 'done' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}
                        >
                          {o.order_code}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── KOMPONEN PENGUMUMAN INTERNAL ───────────────────────────
function AnnouncementUI({ isSuperAdmin, currentAdminEmail }) {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', type: 'info' })

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setAnnouncements(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchAnnouncements() }, [fetchAnnouncements])

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('announcements').insert([{
      ...form,
      created_by: currentAdminEmail
    }])
    if (error) toast.error('Gagal membuat pengumuman')
    else {
      toast.success('Pengumuman berhasil disiarkan!')
      setForm({ title: '', content: '', type: 'info' })
      setShowForm(false)
      fetchAnnouncements()
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from('announcements').delete().eq('id', id)
    if (!error) {
      toast.success('Pengumuman dihapus')
      fetchAnnouncements()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Papan Pengumuman</h2>
          <p className="text-sm text-slate-500 font-medium">Informasi internal untuk seluruh tim Admin</p>
        </div>
        {isSuperAdmin && (
          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 flex items-center gap-2 active:scale-95 transition-all"
          >
            {showForm ? <X size={18}/> : <Plus size={18}/>} 
            {showForm ? 'Batal' : 'Buat Pengumuman'}
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <form onSubmit={handleCreate} className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Judul Pengumuman</label>
                  <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500" placeholder="Contoh: Update Prosedur Revisi" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Tipe</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500">
                    <option value="info">INFO BIASA</option>
                    <option value="warning">PERINGATAN</option>
                    <option value="urgent">PENTING / URGENT</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Isi Pesan</label>
                <textarea required rows={3} value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500" placeholder="Tulis pesan lengkap di sini..." />
              </div>
              <button disabled={loading} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                SIARKAN SEKARANG
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-4">
        {announcements.length === 0 ? (
          <div className="py-20 text-center text-slate-400 font-medium bg-white rounded-2xl border border-dashed border-slate-300">
            Belum ada pengumuman saat ini.
          </div>
        ) : (
          announcements.map(a => (
            <div key={a.id} className={`p-6 rounded-2xl border-l-4 shadow-sm bg-white ${a.type === 'urgent' ? 'border-l-rose-500' : a.type === 'warning' ? 'border-l-amber-500' : 'border-l-blue-500'}`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${a.type === 'urgent' ? 'bg-rose-50 text-rose-600' : a.type === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                      {a.type}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{formatDate(a.created_at)}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">{a.title}</h3>
                </div>
                {isSuperAdmin && (
                  <button onClick={() => handleDelete(a.id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <p className="text-sm text-slate-600 font-medium whitespace-pre-wrap leading-relaxed">{a.content}</p>
              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
                <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-500">
                  {a.created_by?.charAt(0).toUpperCase()}
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Oleh {a.created_by}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ── KOMPONEN CLIENT CRM ─────────────────────────────────────
function ClientCRMUI({ orders }) {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  // Derive CRM data from orders if no dedicated table yet, or fetch from 'clients'
  const fetchClients = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('total_spent', { ascending: false })
    
    if (data && data.length > 0) {
      setClients(data)
    } else {
      // Fallback: Grouping from orders to show current state
      const grouped = orders.reduce((acc, o) => {
        const key = o.client_phone || o.client_email || o.client_name
        if (!acc[key]) {
          acc[key] = {
            name: o.client_name,
            phone: o.client_phone,
            email: o.client_email,
            total_orders: 0,
            total_spent: 0,
            label: 'New'
          }
        }
        acc[key].total_orders += 1
        if (o.status === 'done') acc[key].total_spent += Number(o.price || 0)
        
        if (acc[key].total_orders >= 5) acc[key].label = 'VIP'
        else if (acc[key].total_orders >= 2) acc[key].label = 'Regular'
        
        return acc
      }, {})
      setClients(Object.values(grouped))
    }
    setLoading(false)
  }, [orders])

  useEffect(() => { fetchClients() }, [fetchClients])

  const filteredClients = clients.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) || 
    c.phone?.includes(search)
  )

  const updateLabel = async (phone, newLabel) => {
    const { error } = await supabase.from('clients').upsert([{ phone, label: newLabel }], { onConflict: 'phone' })
    if (!error) {
      toast.success(`Label diperbarui ke ${newLabel}`)
      fetchClients()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Database Klien</h2>
          <p className="text-sm text-slate-500 font-medium">Manajemen riwayat dan loyalitas pelanggan</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Cari Nama/HP..." 
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500" 
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pelanggan</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Total Order</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Omzet</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Loyalty</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="p-10 text-center text-slate-400 font-bold uppercase">Memuat...</td></tr>
              ) : filteredClients.length === 0 ? (
                <tr><td colSpan={5} className="p-10 text-center text-slate-400 font-bold uppercase">Belum ada data.</td></tr>
              ) : (
                filteredClients.map(c => (
                  <tr key={c.phone} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black">
                          {c.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-black text-slate-900">{c.name}</div>
                          <div className="text-[10px] font-bold text-emerald-600">{c.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-center text-sm font-black text-slate-700">{c.total_orders}</td>
                    <td className="p-5 text-center">
                      <div className="text-sm font-black text-slate-900">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(c.total_spent)}
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        c.label === 'VIP' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                        c.label === 'Regular' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                        'bg-slate-50 text-slate-400 border-slate-200'
                      }`}>
                        {c.label}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <select 
                        value={c.label} 
                        onChange={e => updateLabel(c.phone, e.target.value)}
                        className="p-2 bg-slate-100 border-none rounded-lg text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="New">Set New</option>
                        <option value="Regular">Set Regular</option>
                        <option value="VIP">Set VIP</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── MONITORING AI ──────────────────────────────────────────
function AILogsUI() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('ai_usage_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
    if (data) setLogs(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  const totalTokens = logs.reduce((acc, l) => acc + (l.total_tokens || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">AI Monitor</h2>
          <p className="text-sm text-slate-500">Pantau penggunaan token Gemini API</p>
        </div>
        <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-blue-200 flex items-center gap-3">
          <Activity size={20} />
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase opacity-80 leading-none">Total (50 Sesi Terakhir)</div>
            <div className="text-lg font-black leading-none mt-1">{totalTokens.toLocaleString()} Tokens</div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Waktu</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Model</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Prompt</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Output</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Total</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">IP Client</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-blue-500 mb-2" />
                    <p className="text-xs font-bold text-slate-400 uppercase">Mengambil data log...</p>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-20 text-center text-slate-400 font-medium">Belum ada aktivitas AI tercatat.</td>
                </tr>
              ) : (
                logs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5 text-xs font-bold text-slate-600">{formatDate(log.created_at)}</td>
                    <td className="p-5">
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-black uppercase tracking-tight border border-indigo-100">{log.model_name}</span>
                    </td>
                    <td className="p-5 text-xs font-bold text-slate-500 text-center">{log.prompt_tokens}</td>
                    <td className="p-5 text-xs font-bold text-slate-500 text-center">{log.completion_tokens}</td>
                    <td className="p-5 text-center">
                      <span className="text-sm font-black text-slate-900">{log.total_tokens}</span>
                    </td>
                    <td className="p-5 text-[10px] font-mono text-slate-400">{log.user_ip}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── MAIN DASHBOARD COMPONENT ─────────────────────────────────
export default function AdminPage() {
  const [session, setSession] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [orders, setOrders] = useState([])
  const [allOrdersCount, setAllOrdersCount] = useState(0)
  const [ratings, setRatings] = useState([])
  const [revisions, setRevisions] = useState([])
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedOrders, setSelectedOrders] = useState([])
  const [isBulkMode, setIsBulkMode] = useState(false)

  const toggleOrderSelection = (id) => {
    setSelectedOrders(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleBulkAssign = async (adminEmail) => {
    if (selectedOrders.length === 0) {
      toast.error('Pilih setidaknya satu pesanan')
      return
    }

    setLoading(true)
    const { error } = await supabase
      .from('orders')
      .update({ processed_by: adminEmail })
      .in('id', selectedOrders)

    if (error) {
      toast.error('Gagal menugaskan massal')
    } else {
      toast.success(`${selectedOrders.length} tugas berhasil ditugaskan ke ${adminEmail}`)
      setSelectedOrders([])
      setIsBulkMode(false)
      fetchAllData()
    }
    setLoading(false)
  }
 
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const isSuperAdmin = useMemo(() => {
    const userEmail = session?.user?.email?.toLowerCase()
    const adminEmail = (process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL || '').toLowerCase()
    return userEmail === adminEmail && adminEmail !== ''
  }, [session])

  const fetchAdmins = useCallback(async () => {
    if (!isSuperAdmin) return
    const { data: { session: s } } = await supabase.auth.getSession()
    const res = await fetch('/api/admin/manage-users', { headers: { 'Authorization': `Bearer ${s?.access_token}` } })
    const data = await res.json()
    if (data.users) setAdmins(data.users)
  }, [isSuperAdmin])

  const fetchAllData = useCallback(async () => {
    setLoading(true)
    const [ { data: oD }, { data: raD }, { data: reD } ] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('ratings').select('*').order('created_at', { ascending: false }),
      supabase.from('revisions').select('*, orders(client_name, service, processed_by)').order('created_at', { ascending: false }),
    ])
    
    if (oD) setAllOrdersCount(oD.length)
    
    const email = (await supabase.auth.getSession()).data.session?.user?.email
    const filteredO = (oD || []).filter(o => isSuperAdmin || o.status === 'pending' || o.processed_by === email)
    const filteredR = (reD || []).filter(r => isSuperAdmin || r.processed_by === email || r.orders?.processed_by === email)
    
    setOrders(filteredO)
    setRatings(raD || [])
    setRevisions(filteredR)
    
    if (isSuperAdmin) await fetchAdmins()
    
    setLoading(false)
  }, [isSuperAdmin, fetchAdmins])

  useEffect(() => {
    let isMounted = true

    // Meredam error noise browser
    const handleUnhandledRejection = (event) => {
      if (event.reason?.message?.includes('message channel closed') || 
          event.reason?.message?.includes('A listener indicated an asynchronous response')) {
        event.preventDefault()
      }
    }
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    // 1. Initial Session Check & Data Fetch
    const init = async () => {
      try {
        const { data: { session: s }, error } = await supabase.auth.getSession()
        if (!isMounted) return

        if (error || !s) {
          setSession(null)
        } else {
          setSession(s)
          await fetchAllData()
        }
      } catch (err) {
        console.warn('Auth Init Error:', err)
      } finally {
        if (isMounted) setCheckingAuth(false)
      }
    }
    init()

    // 2. Realtime Subscription (Admin Side)
    const ordersChannel = supabase
      .channel('admin-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchAllData()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ratings' }, () => {
        fetchAllData()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'revisions' }, () => {
        fetchAllData()
      })
      .subscribe()

    // 3. Auth State Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, s) => { 
      if (!isMounted) return
      
      if (event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        setSession(null)
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (!isLoggingIn) {
          setSession(s)
          if (s) fetchAllData()
        }
      }
    })

    // 4. Security: Re-validate session
    const handleFocus = async () => {
      if (!isMounted || isLoggingIn) return
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        if (!currentSession) {
          await supabase.auth.signOut()
          setSession(null)
          toast.error('Sesi berakhir.')
        }
      } catch (err) {}
    }

    window.addEventListener('focus', handleFocus)

    return () => {
      isMounted = false
      supabase.removeChannel(ordersChannel)
      subscription.unsubscribe()
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAllData])

  const stats = useMemo(() => {
    const email = session?.user?.email
    const globalWait = orders.filter(o => o.status === 'pending').length
    const personalActive = orders.filter(o => (isSuperAdmin || o.processed_by === email) && ['confirmed', 'in_progress', 'review', 'revisi'].includes(o.status)).length
    const personalDone = orders.filter(o => (isSuperAdmin || o.processed_by === email) && o.status === 'done').length
    const totalRevenue = orders
      .filter(o => (isSuperAdmin || o.processed_by === email) && o.status === 'done')
      .reduce((acc, o) => acc + (o.price || 0), 0)
    
    const personalRatings = ratings.filter(r => {
      if (isSuperAdmin) return true
      return orders.find(o => o.order_code === r.order_code)?.processed_by === email
    })
    const avgRating = personalRatings.length ? (personalRatings.reduce((s, r) => s + r.stars, 0) / personalRatings.length).toFixed(1) : 0
    
    // Revenue Analytics - Last 6 Months
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      return {
        month: d.toLocaleString('id-ID', { month: 'short' }),
        year: d.getFullYear(),
        revenue: 0,
        rawMonth: d.getMonth()
      }
    }).reverse()

    orders.filter(o => o.status === 'done' && (isSuperAdmin || o.processed_by === email)).forEach(o => {
      const d = new Date(o.created_at)
      const m = d.getMonth()
      const y = d.getFullYear()
      const found = last6Months.find(l => l.rawMonth === m && l.year === y)
      if (found) found.revenue += Number(o.price || 0)
    })

    return { total: allOrdersCount, pending: globalWait, active: personalActive, done: personalDone, avgRating, totalRevenue, monthlyRevenue: last6Months }
  }, [orders, ratings, session, isSuperAdmin, allOrdersCount])

  const [selectedOrders, setSelectedOrders] = useState([])

  const toggleSelectOrder = (code) => {
    setSelectedOrders(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    )
  }

  const handleBulkAssign = async (adminEmail) => {
    if (selectedOrders.length === 0) return
    setLoading(true)
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({ processed_by: adminEmail, status: 'confirmed', progress: 20 })
        .in('order_code', selectedOrders)

      if (error) throw error
      
      toast.success(`${selectedOrders.length} Pesanan berhasil ditugaskan ke ${adminEmail}`)
      setSelectedOrders([])
      fetchAllData()
    } catch (err) {
      toast.error('Gagal menugaskan pesanan massal.')
    } finally {
      setLoading(false)
    }
  }

  const navItems = useMemo(() => {
    const items = [
      { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'orders', label: 'Pekerjaan', icon: Package, badge: stats.pending },
      { id: 'calendar', label: 'Kalender', icon: CalendarClock },
      { id: 'announcements', label: 'Pengumuman', icon: MessageCircle },
      { id: 'crm', label: 'Database Klien', icon: Users },
      { id: 'revisions', label: 'Revisi', icon: RotateCcw, badge: revisions.filter(r=>r.status==='pending').length },
      { id: 'ratings', label: 'Ulasan', icon: Star },
    ]
    if (isSuperAdmin) {
      items.push({ id: 'team', label: 'Tim', icon: Users })
      items.push({ id: 'wa-settings', label: 'Pengaturan WA', icon: MessageCircle })
      items.push({ id: 'ai-logs', label: 'AI Monitor', icon: Activity })
    }
    items.push({ id: 'settings', label: 'Profil', icon: Settings })
    return items
  }, [isSuperAdmin, stats.pending, revisions])

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch = o.order_code.toLowerCase().includes(search.toLowerCase()) || 
                          o.client_name.toLowerCase().includes(search.toLowerCase()) ||
                          o.service.toLowerCase().includes(search.toLowerCase())
      const matchStatus = filterStatus === 'all' || o.status === filterStatus
      return matchSearch && matchStatus
    })
  }, [orders, search, filterStatus])

  // --- HANDLER UNTUK KLIK TIKET DI KALENDER ---
  const handleSelectFromCalendar = (code) => {
    setSearch(code)
    setActiveTab('orders')
    // Scroll ke atas agar user melihat hasil pencariannya
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // --- WA SETTINGS STATE ---
  const [waToken, setWaToken] = useState('')
  const [waGroupId, setWaGroupId] = useState('')
  const [isSavingWA, setIsSavingWA] = useState(false)

  const fetchWASettings = useCallback(async () => {
    if (!isSuperAdmin) return
    
    // Pastikan tabel ada (Simulasi via client-side check jika perlu)
    // Di sini kita coba ambil data, jika error karena tabel tak ada, kita infokan
    const { data, error } = await supabase.from('system_settings').select('*')
    
    if (error && error.code === '42P01') {
      console.warn('Tabel system_settings belum ada. Membuat via SQL Editor disarankan.')
      // Opsional: Coba buat otomatis via RPC jika sudah diset di Supabase
    }

    if (data) {
      const token = data.find(i => i.key === 'FONNTE_TOKEN')?.value || ''
      const gid = data.find(i => i.key === 'WA_GROUP_ID')?.value || ''
      setWaToken(token)
      setWaGroupId(gid)
    }
  }, [isSuperAdmin])

  const saveWASettings = async () => {
    setIsSavingWA(true)
    try {
      await supabase.from('system_settings').upsert([{ key: 'FONNTE_TOKEN', value: waToken.trim() }, { key: 'WA_GROUP_ID', value: waGroupId.trim() }])
      toast.success('Pengaturan WhatsApp berhasil disimpan!')
    } catch {
      toast.error('Gagal menyimpan pengaturan.')
    } finally {
      setIsSavingWA(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'wa-settings') fetchWASettings()
  }, [activeTab, fetchWASettings])

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    )
  }
  
  if (!session || isLoggingIn) {
    return (
      <LoginForm 
        onLoginStart={() => setIsLoggingIn(true)}
        onLogin={(s) => {
          setSession(s)
          setIsLoggingIn(false)
          fetchAllData()
        }} 
      />
    )
  }

  const activeNav = navItems.find(n => n.id === activeTab)

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 overflow-hidden">
      <Toaster position="top-right" richColors />
      
      {/* ── SIDEBAR DESKTOP ─────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200 h-screen sticky top-0 z-40">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 relative overflow-hidden">
            <Image src="/logo.png" fill className="object-contain brightness-0 invert p-2" alt="logo" />
          </div>
          <div>
            <h1 className="font-black text-lg text-slate-900 tracking-tight leading-none">Admin Core</h1>
            <span className="text-[10px] font-bold text-blue-500 tracking-wider uppercase">Platform Workspace</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold text-sm ${activeTab === item.id ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} strokeWidth={2.5} className={activeTab === item.id ? 'text-blue-600' : 'text-slate-400'} />
                {item.label}
              </div>
              {item.badge > 0 && (
                <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-md">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3 mb-3 border border-slate-100">
            <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold text-lg">
              {session?.user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-slate-900 truncate">{session?.user?.user_metadata?.full_name || 'Admin'}</div>
              <div className="text-xs text-slate-500 truncate">{session?.user?.email}</div>
            </div>
          </div>
          <button onClick={() => supabase.auth.signOut()} className="w-full py-2.5 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2">
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* HEADER */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
              <LayoutDashboard size={20} />
            </button>
            <h2 className="font-black text-xl sm:text-2xl text-slate-800 tracking-tight">{activeNav?.label}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchAllData} className="p-2.5 bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 rounded-xl transition-all shadow-sm">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full pb-24 lg:pb-8">
          
          {loading && orders.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
              <Loader2 className="animate-spin text-blue-500" size={40} />
              <p className="text-sm font-medium">Memuat data...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              
              {/* TAB: OVERVIEW */}
              {activeTab === 'overview' && (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 sm:space-y-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {[
                      { l: 'Pendapatan', v: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(stats.totalRevenue), i: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                      { l: 'Antrian Baru', v: stats.pending, i: Clock, color: 'text-rose-600', bg: 'bg-rose-50' },
                      { l: 'Aktif Saya', v: stats.active, i: Activity, color: 'text-amber-600', bg: 'bg-amber-50' },
                      { l: 'Rating Kerja', v: stats.avgRating, i: Star, color: 'text-blue-600', bg: 'bg-blue-50' }
                    ].map((s, i) => (
                      <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg} ${s.color}`}>
                            <s.i size={20} strokeWidth={2.5} />
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl sm:text-3xl font-black text-slate-800">{s.v}</div>
                          <div className="text-xs font-semibold text-slate-500 mt-1">{s.l}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Alert Banner */}
                  {stats.pending > 0 && (
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-blue-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                          <AlertCircle size={28} className="text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">Ada {stats.pending} Antrian Baru!</h3>
                          <p className="text-blue-100 text-sm">Ambil pesanan ini sebelum diambil oleh tim lain.</p>
                        </div>
                      </div>
                      <button onClick={() => setActiveTab('orders')} className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors w-full sm:w-auto text-center whitespace-nowrap">
                        Lihat Antrian
                      </button>
                    </div>
                  )}

                  {/* Recent Activity */}
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between font-bold text-slate-800">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={20} className="text-slate-400" /> Aktivitas Terbaru
                      </div>
                      <button onClick={() => setActiveTab('orders')} className="text-xs text-blue-600 hover:underline">Lihat Semua</button>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {orders.slice(0, 5).map(o => (
                        <div key={o.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">#{o.order_code}</span>
                              <div className="text-sm font-bold text-slate-900 truncate">{o.service}</div>
                            </div>
                            <div className="text-xs font-medium text-slate-500">{o.client_name} · {formatDate(o.created_at)}</div>
                          </div>
                          <StatusBadge status={o.status} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Revenue Chart Section */}
                  <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 sm:p-10 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">Analisis Pendapatan</h3>
                      <p className="text-sm text-slate-500 font-medium uppercase tracking-widest mt-1">Laporan 6 Bulan Terakhir</p>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-100">
                      <TrendingUp size={18} />
                      <span className="text-sm font-black tracking-tight">Total: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(stats.totalRevenue)}</span>
                    </div>
                  </div>

                  <div className="relative h-64 sm:h-80 w-full mt-10">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-50">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-full border-t border-dashed border-slate-100 h-0" />
                      ))}
                      <div className="w-full border-t border-slate-200 h-0" />
                    </div>

                    {/* Bars */}
                    <div className="absolute inset-0 flex items-end justify-between px-2 sm:px-6">
                      {stats.monthlyRevenue.map((m, i) => {
                        const maxRevenue = Math.max(...stats.monthlyRevenue.map(r => r.revenue), 1000000)
                        const heightPercent = (m.revenue / maxRevenue) * 100

                        return (
                          <div key={i} className="flex flex-col items-center gap-4 flex-1 group">
                            <div className="relative w-full flex justify-center items-end h-full">
                              {/* Tooltip */}
                              <div className="absolute bottom-full mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-10 pointer-events-none">
                                <div className="bg-slate-900 text-white text-[10px] font-black px-3 py-2 rounded-lg whitespace-nowrap shadow-xl">
                                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(m.revenue)}
                                </div>
                                <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1" />
                              </div>

                              <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${heightPercent}%` }}
                                transition={{ duration: 1, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                className={`w-8 sm:w-16 rounded-t-2xl shadow-lg transition-all duration-300 ${m.revenue === maxRevenue ? 'bg-blue-600 shadow-blue-200' : 'bg-slate-200 group-hover:bg-blue-400 shadow-slate-100'}`}
                              />
                            </div>
                            <div className="text-center">
                              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.month}</div>
                              <div className="text-[8px] font-bold text-slate-300">{m.year}</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  </div>
                  </motion.div>
                  )}
              {/* TAB: ORDERS */}
              {activeTab === 'orders' && (
                <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  {/* Filter & Search */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        value={search} 
                        onChange={e => setSearch(e.target.value)} 
                        placeholder="Cari Tiket atau Client..." 
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm font-medium" 
                      />
                    </div>
                    <select 
                      value={filterStatus} 
                      onChange={e => setFilterStatus(e.target.value)} 
                      className="p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 shadow-sm cursor-pointer outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="all">SEMUA STATUS</option>
                      {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label.toUpperCase()}</option>)}
                    </select>
                  </div>

                  {/* Bulk Actions (Only for Super Admin) */}
                  <AnimatePresence>
                    {isSuperAdmin && selectedOrders.length > 0 && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 bg-blue-600 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-blue-200 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
                              <Package size={20} />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-white">{selectedOrders.length} Pesanan Terpilih</div>
                              <button onClick={() => setSelectedOrders([])} className="text-[10px] text-blue-100 font-bold uppercase tracking-wider hover:underline">Batalkan Pilihan</button>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <select 
                              onChange={(e) => handleBulkAssign(e.target.value)}
                              className="flex-1 sm:flex-none p-2.5 bg-white rounded-xl text-xs font-bold text-blue-700 outline-none"
                            >
                              <option value="">TUGASKAN KE ADMIN...</option>
                              {admins.map(a => (
                                <option key={a.id} value={a.email}>{a.user_metadata?.full_name || a.email}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-1 gap-4">
                    {filteredOrders.length === 0 ? (
                      <div className="py-20 text-center text-slate-400 font-medium bg-white rounded-2xl border border-dashed border-slate-300">
                        Tidak ada data tiket ditemukan.
                      </div>
                    ) : (
                      filteredOrders.map(o => (
                        <div key={o.id} className="relative group">
                          {isSuperAdmin && (
                            <div className="absolute left-[-12px] sm:left-[-40px] top-1/2 -translate-y-1/2 z-20">
                              <input 
                                type="checkbox" 
                                checked={selectedOrders.includes(o.order_code)}
                                onChange={() => toggleSelectOrder(o.order_code)}
                                className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg border-2 border-slate-300 accent-blue-600 cursor-pointer shadow-sm transition-all hover:scale-110"
                              />
                            </div>
                          )}
                          <OrderCard 
                            order={o} 
                            onSave={fetchAllData} 
                            currentAdminEmail={session?.user?.email} 
                            adminName={session?.user?.user_metadata?.full_name}
                            isSuperAdmin={isSuperAdmin} 
                          />
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB: REVISIONS */}
              {activeTab === 'revisions' && (
                <motion.div key="revisions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {revisions.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-slate-400 font-medium bg-white rounded-2xl border border-dashed border-slate-300">
                      Belum ada permintaan revisi.
                    </div>
                  ) : (
                    revisions.map(r => <RevisionCard key={r.id} rev={r} onRefresh={fetchAllData} currentAdminEmail={session?.user?.email} />)
                  )}
                </motion.div>
              )}

              {/* TAB: RATINGS */}
              {activeTab === 'ratings' && (
                <motion.div key="ratings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ratings.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-slate-400 font-medium bg-white rounded-2xl border border-dashed border-slate-300">
                      Belum ada ulasan.
                    </div>
                  ) : (
                    ratings.map(r => <RatingCard key={r.id} r={r} onRefresh={fetchAllData} />)
                  )}
                </motion.div>
              )}

              {/* TAB: CALENDAR */}
              {activeTab === 'calendar' && (
                <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <DeadlineCalendar orders={orders} onSelectOrder={handleSelectFromCalendar} />
                </motion.div>
              )}

              {/* TAB: ANNOUNCEMENTS */}
              {activeTab === 'announcements' && (
                <motion.div key="announcements" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <AnnouncementUI isSuperAdmin={isSuperAdmin} currentAdminEmail={session?.user?.email} />
                </motion.div>
              )}

              {/* TAB: CRM */}
              {activeTab === 'crm' && (
                <motion.div key="crm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <ClientCRMUI orders={orders} />
                </motion.div>
              )}

              {/* TAB: TEAM */}
              {activeTab === 'team' && isSuperAdmin && (
                <AdminManagement 
                  orders={orders} 
                  ratings={ratings} 
                  admins={admins} 
                  fetchAdmins={fetchAdmins} 
                  loading={loading}
                />
              )}

              {/* TAB: WA SETTINGS */}
              {activeTab === 'wa-settings' && isSuperAdmin && (
                <motion.div key="wa-settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <WASettingsUI 
                    token={waToken} setToken={setWaToken} 
                    groupId={waGroupId} setGroupId={setWaGroupId} 
                    onSave={saveWASettings} loading={isSavingWA} 
                  />
                </motion.div>
              )}

              {/* TAB: AI MONITOR */}
              {activeTab === 'ai-logs' && isSuperAdmin && (
                <motion.div key="ai-logs" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <AILogsUI />
                </motion.div>
              )}

              {/* TAB: SETTINGS */}
              {activeTab === 'settings' && (
                <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <PersonalSettings session={session} onRefresh={fetchAllData} isSuperAdmin={isSuperAdmin} stats={stats} />
                </motion.div>
              )}

            </AnimatePresence>
          )}
        </div>

        {/* ── MOBILE BOTTOM NAV ───────────────────────────────── */}
        <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-between z-50 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
          {navItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => { setActiveTab(item.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className={`flex flex-col items-center gap-1 transition-all relative ${activeTab === item.id ? 'text-blue-600' : 'text-slate-400'}`}
            >
              <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              <span className="text-[10px] font-bold">{item.label}</span>
              {item.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white"></span>
              )}
            </button>
          ))}
        </nav>
      </main>

      {/* ── MOBILE SIDEBAR OVERLAY ──────────────────────────── */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 lg:hidden" />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }} className="fixed top-0 left-0 h-screen w-72 bg-white shadow-2xl z-50 lg:hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
                    <Image src="/favicon.ico" width={28} height={28} className="w-7 h-7 object-contain" alt="logo" />
                  </div>
                  <div>
                    <h1 className="font-black text-lg text-slate-900 leading-none">Admin Core</h1>
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1 block">Workspace</span>
                  </div>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2.5 bg-white text-slate-400 border border-slate-200 rounded-xl shadow-sm"><X size={20} /></button>
              </div>
              <div className="p-4 border-b border-slate-100">
                <div className="text-sm font-bold text-slate-900 truncate">{session?.user?.user_metadata?.full_name || 'Admin'}</div>
                <div className="text-xs text-slate-500 truncate">{session?.user?.email}</div>
              </div>
              <nav className="flex-1 p-4 space-y-2">
                {navItems.map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} 
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm ${activeTab === item.id ? 'bg-blue-50 text-blue-700' : 'text-slate-500'}`}
                  >
                    <div className="flex items-center gap-3"><item.icon size={18} /> {item.label}</div>
                  </button>
                ))}
              </nav>
              <div className="p-4 border-t border-slate-100">
                <button onClick={() => supabase.auth.signOut()} className="w-full py-3 bg-rose-50 text-rose-600 font-bold rounded-xl flex items-center justify-center gap-2">
                  <LogOut size={18} /> Keluar
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}