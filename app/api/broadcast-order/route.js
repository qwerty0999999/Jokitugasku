import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { orderData } = await req.json()
    
    // Pastikan API Key dan Target Group ID sudah diset di Vercel
    const FONNTE_TOKEN = process.env.FONNTE_TOKEN
    const WA_GROUP_ID = process.env.WA_GROUP_ID // ID Grup Admin Jokitugasku.id

    if (!FONNTE_TOKEN || !WA_GROUP_ID) {
      console.warn('WhatsApp Gateway: Token atau Group ID belum diatur.')
      return NextResponse.json({ message: 'Gateway not configured' }, { status: 200 })
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

Silakan admin segera proses di Dashboard Admin Core! 🚀
`

    // Kirim ke API Fonnte
    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': FONNTE_TOKEN
      },
      body: new URLSearchParams({
        target: WA_GROUP_ID,
        message: message,
        delay: '2', // Jeda aman
      })
    })

    const result = await response.json()
    
    return NextResponse.json({ success: result.status, result })
  } catch (error) {
    console.error('Broadcast Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
