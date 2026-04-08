import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const { orderData, type, adminName } = await req.json()
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { data: settings } = await supabase.from('system_settings').select('*')
    const FONNTE_TOKEN = settings?.find(i => i.key === 'FONNTE_TOKEN')?.value || process.env.FONNTE_TOKEN
    const WA_GROUP_ID = settings?.find(i => i.key === 'WA_GROUP_ID')?.value || process.env.WA_GROUP_ID

    if (!FONNTE_TOKEN || !WA_GROUP_ID) {
      return NextResponse.json({ message: 'WhatsApp config missing' }, { status: 400 })
    }

    let message = ""

    if (type === 'NEW_ORDER') {
      message = `*🔔 PESANAN BARU MASUK!*
----------------------------------
*Kode Order:* ${orderData.order_code}
*Layanan:* ${orderData.service}
*Nama Klien:* ${orderData.client_name}
*Deadline:* ${orderData.deadline || 'Tidak ada'}
----------------------------------
Silakan admin segera proses di Dashboard! 🚀`
    } 
    else if (type === 'CLAIM_ORDER') {
      message = `*✅ PESANAN DIAMBIL*
----------------------------------
*Admin:* ${adminName}
*Telah mengambil tiket:* ${orderData.order_code} (${orderData.service})
----------------------------------
Status tiket kini: *${orderData.status.toUpperCase()}*
Semangat pengerjaannya! 💪✨`
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
