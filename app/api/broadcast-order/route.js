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
    const dbToken = settings?.find(i => i.key === 'FONNTE_TOKEN')?.value
    const dbGroupId = settings?.find(i => i.key === 'WA_GROUP_ID')?.value

    const FONNTE_TOKEN = (dbToken && dbToken.trim() !== '') ? dbToken : process.env.FONNTE_TOKEN
    const WA_GROUP_ID = (dbGroupId && dbGroupId.trim() !== '') ? dbGroupId : process.env.WA_GROUP_ID

    if (!FONNTE_TOKEN || !WA_GROUP_ID) {
      console.error('Broadcast Error: WhatsApp config missing (Token or Group ID)')
      return NextResponse.json({ message: 'WhatsApp config missing' }, { status: 400 })
    }

    let message = ""

    // LOGIC: Menentukan pesan berdasarkan tipe
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
    } else if (type === 'UPDATE_STATUS') {
      message = `*🔄 UPDATE PROGRES TIKET*
━━━━━━━━━━━━━━━━━━
🎫 *Tiket:* ${orderData.order_code}
👤 *Klien:* ${orderData.client_name || '-'}
📊 *Progres:* ${orderData.progress}%
🚀 *Status:* ${(orderData.status || 'PROSES').toUpperCase()}
━━━━━━━━━━━━━━━━━━
💬 *Catatan:* ${orderData.notes || 'Pembaruan progres pengerjaan.'}

_Cek detail lengkap di Dashboard Admin. 🚀_`
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

    // Menggunakan format x-www-form-urlencoded untuk stabilitas di Fonnte
    const params = new URLSearchParams()
    params.append('target', WA_GROUP_ID)
    params.append('message', message)
    params.append('delay', '2')

    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: { 
        'Authorization': FONNTE_TOKEN.trim(),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    })

    const result = await response.json()
    
    if (result.status !== true) {
      console.error('Fonnte API Failure:', result)
    }

    return NextResponse.json({ success: result.status === true, result })

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
