import { getSupabaseAdmin } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Printer, CheckCircle2, Hash, Calendar, User, Briefcase, DollarSign, Clock, AlertCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getOrder(code) {
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_code', code)
      .single()
    
    if (error || !data) return null
    return data
  } catch (err) {
    return null
  }
}

export default async function InvoicePage({ params }) {
  const order = await getOrder(params.code)

  if (!order) {
    notFound()
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
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

  const isPaid = order.status !== 'pending' && order.status !== 'rejected'

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      {/* Action Buttons - Hidden on Print */}
      <div className="max-w-3xl mx-auto mb-8 flex justify-between items-center print:hidden">
        <h1 className="text-xl font-bold text-slate-800">Preview Invoice</h1>
        <div className="flex gap-3">
          <button 
            onClick={() => window.print()} 
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 border border-blue-700 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <Printer size={18} /> Cetak / Simpan PDF
          </button>
        </div>
      </div>

      {/* Invoice Card */}
      <div className="max-w-3xl mx-auto bg-white shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden border border-slate-100 print:shadow-none print:border-none print:rounded-none">
        {/* Header Decor */}
        <div className={`h-3 bg-gradient-to-r ${isPaid ? 'from-emerald-500 to-teal-500' : 'from-blue-600 to-indigo-600'}`} />
        
        <div className="p-8 sm:p-12">
          {/* Company Branding */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-100 relative overflow-hidden">
                <Image src="/logo.png" alt="Logo" width={40} height={40} className="brightness-0 invert object-contain" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">JOKITUGASKU.ID</h2>
                <p className="text-sm text-slate-500 font-medium">Solusi Tugas & Analisis Data Terpercaya</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              {isPaid ? (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100 mb-2">
                  <CheckCircle2 size={14} /> PAID / LUNAS
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-xs font-black uppercase tracking-widest border border-amber-100 mb-2">
                  <Clock size={14} /> WAITING PAYMENT
                </div>
              )}
              <p className="text-sm text-slate-400 font-bold uppercase tracking-tighter">Invoice No: {order.order_code}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            {/* Bill To */}
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Ditujukan Untuk:</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500"><User size={16}/></div>
                  <span className="text-lg font-bold text-slate-800">{order.client_name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500"><Hash size={16}/></div>
                  <span className="text-sm font-medium text-slate-600">{order.client_phone || '-'}</span>
                </div>
              </div>
            </div>

            {/* Order Info */}
            <div className="md:text-right">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Informasi Tiket:</h4>
              <div className="space-y-3">
                <div className="flex items-center md:justify-end gap-3 text-sm font-bold text-slate-600">
                  <Calendar size={16} className="text-slate-400" />
                  Tanggal: {formatDate(order.created_at)}
                </div>
                <div className="flex items-center md:justify-end gap-3 text-sm font-bold text-slate-600">
                  <Briefcase size={16} className="text-slate-400" />
                  {order.service}
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="border border-slate-100 rounded-2xl overflow-hidden mb-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Deskripsi Layanan</th>
                  <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase tracking-widest">Harga</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-6 py-8">
                    <p className="font-bold text-slate-800 mb-1">{order.service}</p>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-sm">
                      Jasa pengerjaan profesional sesuai instruksi tiket {order.order_code}.
                      {order.referral_code && (
                        <span className="block mt-1 text-emerald-600 font-bold italic">
                          Promo Applied: {order.referral_code}
                        </span>
                      )}
                    </p>
                  </td>
                  <td className="px-6 py-8 text-right align-top">
                    <span className="font-black text-slate-900 text-lg">
                      {formatCurrency(Number(order.price) + Number(order.discount_amount || 0))}
                    </span>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                {order.discount_amount > 0 && (
                  <tr className="bg-emerald-50/30">
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">DISCOUNT</td>
                    <td className="px-6 py-4 text-right font-black text-emerald-600">-{formatCurrency(order.discount_amount)}</td>
                  </tr>
                )}
                <tr className="bg-slate-50/50">
                  <td className="px-6 py-6 text-right font-bold text-slate-500 uppercase tracking-widest text-xs">Total Akhir</td>
                  <td className="px-6 py-6 text-right font-black text-slate-900 text-xl">{formatCurrency(order.price)}</td>
                </tr>
                <tr className={`${isPaid ? 'bg-emerald-600' : 'bg-blue-600'} text-white`}>
                  <td className="px-6 py-6 text-right font-bold text-sm">TOTAL {isPaid ? 'DIBAYARKAN' : 'YANG HARUS DIBAYAR'}</td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <DollarSign size={20} />
                      <span className="text-2xl font-black">{formatCurrency(order.price)}</span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment Status Alert for Unpaid */}
          {!isPaid && (
            <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3 text-blue-700 print:hidden">
              <AlertCircle size={20} />
              <p className="text-xs font-bold uppercase tracking-wide">PENTING: Segera lakukan pembayaran agar tugas dapat segera dikerjakan.</p>
            </div>
          )}

          {/* Footer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Catatan Penting:</h5>
              <ul className="text-[11px] text-slate-500 space-y-2 font-medium">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-slate-300 rounded-full mt-1.5" />
                  Invoice ini merupakan bukti pembayaran sah.
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-slate-300 rounded-full mt-1.5" />
                  Berlaku garansi revisi sesuai kesepakatan awal.
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-slate-300 rounded-full mt-1.5" />
                  Terima kasih telah mempercayakan tugas Anda kepada Jokitugasku.id
                </li>
              </ul>
            </div>
            <div className="text-center md:text-right pb-4">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-12">Authorized Signature</p>
              <div className="inline-block relative">
                <Image src="/logo.png" alt="Stamp" width={60} height={60} className="opacity-10 grayscale absolute -top-10 -left-10" />
                <p className="text-lg font-black text-slate-900 underline decoration-blue-500 decoration-4 underline-offset-8 italic">Management Jokitugasku</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="bg-slate-900 p-6 text-center">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em]">Generated Automatically by Jokitugasku.id Systems</p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; padding: 0 !important; }
          .min-h-screen { min-height: 0 !important; padding: 0 !important; }
          .print\\:hidden { display: none !important; }
        }
      `}} />
    </div>
  )
}
