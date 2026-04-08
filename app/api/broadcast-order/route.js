import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { orderData } = await req.json()
    
    // Inisialisasi Supabase Admin
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Ambil Pengaturan dari Database
    const { data: settings } = await supabase.from('system_settings').select('*')
    
    const dbToken = settings?.find(i => i.key === 'FONNTE_TOKEN')?.value
    const dbGroupId = settings?.find(i => i.key === 'WA_GROUP_ID')?.value

    // Fallback ke Env Vars jika DB kosong
    const FONNTE_TOKEN = dbToken || process.env.FONNTE_TOKEN
    const WA_GROUP_ID = dbGroupId || process.env.WA_GROUP_ID

    if (!FONNTE_TOKEN || !WA_GROUP_ID) {
      console.warn('WhatsApp Gateway: Konfigurasi belum lengkap.')
      return NextResponse.json({ message: 'WhatsApp configuration missing' }, { status: 200 })
    }

    const message = `*🔔 PESANAN BARU MASUK!*
----------------------------------
*Kode Order:* ${orderData.order_code}
*Layanan:* ${orderData.service}
*Nama Klien:* ${orderData.client_name}
*Deadline:* ${orderData.deadline || 'Tidak ada'}
----------------------------------
*Catatan:*
${orderData.description || 'Tidak ada catatan khusus.'}

Silakan admin segera proses di Dashboard Admin Core! 🚀`

    // Kirim ke API Fonnte
    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: { 'Authorization': FONNTE_TOKEN },
      body: new URLSearchParams({
        target: WA_GROUP_ID,
        message: message,
        delay: '2',
      })
    })

    const result = await response.json()
    return NextResponse.json({ success: result.status, result })
  } catch (error) {
    console.error('Broadcast Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
