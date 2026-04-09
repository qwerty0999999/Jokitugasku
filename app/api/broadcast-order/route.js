import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 })
    }

    const { orderData, type, adminName } = body

    if (!orderData || typeof orderData !== 'object' || !orderData.order_code) {
      return NextResponse.json({ message: 'orderData is required and must contain order_code' }, { status: 400 })
    }
    const supabase = getSupabaseAdmin()

    const { data: settings } = await supabase.from('system_settings').select('*')
    const FONNTE_TOKEN = settings?.find(i => i.key === 'FONNTE_TOKEN')?.value || process.env.FONNTE_TOKEN
    const WA_GROUP_ID = settings?.find(i => i.key === 'WA_GROUP_ID')?.value || process.env.WA_GROUP_ID

    if (!FONNTE_TOKEN || !WA_GROUP_ID) {
      return NextResponse.json({ message: 'WhatsApp config missing' }, { status: 400 })
    }

    let message = ""

    // LOGIC: Menentukan pesan berdasarkan tipe (Default ke NEW_ORDER jika type kosong)
    if (type === 'CLAIM_ORDER') {
      message = `*✅ TIKET TELAH DIAMBIL*
━━━━━━━━━━━━━━━━━━
👤 *Admin:* ${adminName || 'Admin'}
🎫 *Tiket:* ${orderData.order_code}
👤 *Klien:* ${orderData.client_name || '-'}
🛠️ *Layanan:* ${orderData.service}
━━━━━━━━━━━━━━━━━━
🚀 *Status:* ${(orderData.status || 'PROSES').toUpperCase()}

_Semangat pengerjaannya! Fokus berikan hasil terbaik untuk klien. 💪✨_`
    } else {
      // DEFAULT: NEW_ORDER
      const deadlineStr = orderData.deadline 
        ? new Date(orderData.deadline).toLocaleString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) 
        : 'Flexible'

      message = `*🔔 PESANAN BARU MASUK!*
━━━━━━━━━━━━━━━━━━
🎫 *Kode:* ${orderData.order_code}
👤 *Klien:* ${orderData.client_name}
📞 *WA:* ${orderData.client_phone || '-'}
🛠️ *Layanan:* ${orderData.service}
⏰ *Deadline:* ${deadlineStr}
━━━━━━━━━━━━━━━━━━
📝 *Deskripsi:*
${orderData.description || '-'}
━━━━━━━━━━━━━━━━━━

🔥 *Segera proses di Dashboard:*
🔗 https://jokitugasku.vercel.app/admin

_Harap segera dikonfirmasi agar klien tidak menunggu lama. 🚀_`
    }

    const formData = new FormData()
    formData.append('target', WA_GROUP_ID)
    formData.append('message', message)
    formData.append('delay', '2')

    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: { 'Authorization': FONNTE_TOKEN },
      body: formData
    })

    const result = await response.json()
    return NextResponse.json({ success: result.status === true, result })

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
