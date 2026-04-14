'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Package, Clock, User, MessageCircle, DollarSign, 
  CheckCircle, Activity, Save, Loader2, FileUp, Download, 
  Receipt, Trash2, Shield, CalendarClock, Briefcase, Hash,
  AlertCircle, History
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { toast, Toaster } from 'sonner'
import Image from 'next/image'

const statusOptions = [
  { value: 'pending', label: 'Antrian Baru', icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50' },
  { value: 'confirmed', label: 'Dikonfirmasi', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
  { value: 'in_progress', label: 'Dikerjakan', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50' },
  { value: 'review', label: 'Siap Review', icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50' },
  { value: 'done', label: 'Selesai', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { value: 'revisi', label: 'Revisi', icon: History, color: 'text-orange-600', bg: 'bg-orange-50' },
]

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderCode = params.code

  const [order, setOrder] = useState(null)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [session, setSession] = useState(null)

  const [formData, setFormData] = useState({
    status: '',
    progress: 0,
    price: 0,
    notes: '',
    file_url: '',
    is_paid: false,
    processed_by: ''
  })

  const fetchOrderData = useCallback(async () => {
    setLoading(true)
    const { data: { session: s } } = await supabase.auth.getSession()
    setSession(s)

    if (!s) {
      router.push('/admin')
      return
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_code', orderCode)
      .single()

    if (error || !data) {
      toast.error('Pesanan tidak ditemukan')
      router.push('/admin')
      return
    }

    setOrder(data)
    setFormData({
      status: data.status,
      progress: data.progress || 0,
      price: data.price || 0,
      notes: data.notes || '',
      file_url: data.file_url || '',
      is_paid: data.is_paid || false,
      processed_by: data.processed_by || ''
    })

    // Fetch Logs
    const { data: logData } = await supabase
      .from('order_logs')
      .select('*')
      .eq('order_code', orderCode)
      .order('created_at', { ascending: false })
    
    setLogs(logData || [])
    setLoading(false)
  }, [orderCode, router])

  useEffect(() => {
    fetchOrderData()
  }, [fetchOrderData])

  const handleUpdate = async () => {
    setSaving(true)
    try {
      const updates = {
        ...formData,
        processed_by: formData.processed_by || session?.user?.email,
        updated_at: new Date().toISOString()
      }

      const res = await fetch('/api/admin/update-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_code: orderCode, updates })
      })

      if (!res.ok) throw new Error('Gagal memperbarui database')

      toast.success('Pesanan berhasil diperbarui!')
      fetchOrderData()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const [isSummarizing, setIsSummarizing] = useState(false)

  const handleAISummary = async () => {
    if (!order.description) return toast.error('Deskripsi tugas kosong.')
    
    setIsSummarizing(true)
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `Tolong buatkan ringkasan instruksi pengerjaan yang profesional dan poin-per-poin dari deskripsi tugas berikut ini: "${order.description}". Fokus pada apa yang harus dikerjakan tim produksi.` 
        })
      })

      if (!res.ok) throw new Error('Gagal menghubungi AI')
      
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let resultText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        resultText += decoder.decode(value)
      }

      setFormData(prev => ({ ...prev, notes: resultText }))
      toast.success('Ringkasan AI berhasil dibuat! Silakan cek di kolom Catatan.')
    } catch (err) {
      toast.error('Gagal menggunakan fitur AI: ' + err.message)
    } finally {
      setIsSummarizing(false)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${orderCode}_final_${Math.random().toString(36).substring(7)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('order-files')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: downloadData } = supabase.storage
        .from('order-files')
        .getPublicUrl(fileName)
      
      const publicUrl = downloadData.publicUrl
      setFormData(prev => ({ ...prev, file_url: publicUrl }))
      toast.success('File berhasil diunggah. Jangan lupa klik Simpan.')
    } catch (err) {
      toast.error('Gagal upload: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="animate-spin text-blue-600" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Memuat Detail Pesanan...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      <Toaster position="top-right" richColors />
      
      {/* Header Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Detail Pesanan</div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">#{orderCode}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleUpdate}
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Simpan Perubahan
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Main Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Summary Card */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 mb-2">{order.service}</h2>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-slate-200 flex items-center gap-1.5">
                      <User size={12} /> {order.client_name}
                    </span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-emerald-200 flex items-center gap-1.5">
                      <DollarSign size={12} /> {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(order.price)}
                    </span>
                    {order.is_paid && (
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-blue-200 flex items-center gap-1.5">
                        <CheckCircle size={12} /> Lunas
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Saat Ini</div>
                  <select 
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black uppercase outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Briefcase size={14} className="text-blue-500" /> Deskripsi Tugas & Instruksi
                  </label>
                  <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                    {order.description || 'Tidak ada deskripsi tambahan.'}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Progress ({formData.progress}%)</label>
                    <input 
                      type="range" min="0" max="100" step="5" 
                      value={formData.progress} 
                      onChange={e => setFormData({...formData, progress: Number(e.target.value)})} 
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Deadline</label>
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-600 flex items-center gap-2">
                      <CalendarClock size={16} />
                      {new Date(order.deadline).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI TASK HELPER & INTERNAL NOTES */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <MessageCircle size={18} className="text-blue-500" /> Catatan Internal & Instruksi
                </h3>
                <button 
                  onClick={handleAISummary}
                  disabled={isSummarizing}
                  className="px-4 py-2.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50 border border-indigo-100"
                >
                  {isSummarizing ? <Loader2 size={14} className="animate-spin" /> : <Activity size={14} />}
                  Buat Ringkasan Otomatis (AI)
                </button>
              </div>
              <textarea 
                rows={10}
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                placeholder="Tulis instruksi pengerjaan atau hasil ringkasan AI di sini..."
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
              />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-right italic">
                {isSummarizing ? 'AI sedang membaca deskripsi...' : 'Gunakan AI untuk membuat instruksi pengerjaan otomatis.'}
              </p>
            </div>

            {/* File & Payment Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Hasil File */}
              <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <FileUp size={18} className="text-blue-500" /> Hasil File
                </h3>
                <div className="relative group">
                  <input 
                    type="file" onChange={handleFileUpload} disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  />
                  <div className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${uploading ? 'bg-slate-50 border-slate-200' : 'bg-blue-50/30 border-blue-100 group-hover:border-blue-300'}`}>
                    {uploading ? <Loader2 size={24} className="animate-spin text-blue-500" /> : <FileUp size={24} className="text-blue-400" />}
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest text-center">
                      {uploading ? 'Mengunggah...' : 'Klik untuk Unggah Hasil'}
                    </span>
                  </div>
                </div>
                {formData.file_url && (
                  <a href={formData.file_url} target="_blank" rel="noreferrer" className="w-full py-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-100 transition-all">
                    <Download size={14} /> Lihat File Terunggah
                  </a>
                )}
              </div>

              {/* Bukti Bayar */}
              <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Receipt size={18} className="text-emerald-500" /> Bukti Bayar
                </h3>
                {order.payment_receipt_url ? (
                  <div className="space-y-3">
                    <div className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 group">
                      <Image src={order.payment_receipt_url} fill className="object-cover" alt="Receipt" />
                      <a href={order.payment_receipt_url} target="_blank" rel="noreferrer" className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                        <Download className="text-white" size={24} />
                      </a>
                    </div>
                    <label className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl cursor-pointer">
                      <input 
                        type="checkbox" checked={formData.is_paid} 
                        onChange={e => setFormData({...formData, is_paid: e.target.checked})}
                        className="w-5 h-5 accent-emerald-600"
                      />
                      <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">Verifikasi Lunas</span>
                    </label>
                  </div>
                ) : (
                  <div className="p-10 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-300 gap-2">
                    <AlertCircle size={32} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Belum Unggah</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar Logs & Info */}
          <div className="space-y-6">
            
            {/* Admin Stats */}
            <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl shadow-slate-200">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Shield size={14} /> Informasi Internal
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Ditugaskan Ke</div>
                  <div className="text-sm font-black text-blue-400 truncate">{formData.processed_by || 'Belum Ditugaskan'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Kode Referral</div>
                  <div className="text-sm font-black text-amber-400 uppercase">{order.referral_code || '-'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Potongan Harga</div>
                  <div className="text-sm font-black text-emerald-400">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(order.discount_amount || 0)}
                  </div>
                </div>
              </div>
            </div>

            {/* Logs Timeline */}
            <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm min-h-[400px]">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <History size={14} /> Riwayat Progres
              </h3>
              <div className="space-y-6 relative">
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-50" />
                
                {logs.length === 0 ? (
                  <div className="text-center py-10 text-xs text-slate-300 font-bold uppercase tracking-widest">Belum ada aktivitas.</div>
                ) : (
                  logs.map((log, i) => (
                    <div key={log.id} className="relative pl-6">
                      <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-white border-4 border-blue-500" />
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{log.status}</span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase">
                            {new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-tight">{log.notes}</p>
                        <div className="text-[8px] text-slate-300 mt-1 italic">— {log.admin_email}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
