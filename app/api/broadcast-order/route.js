import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const { orderData } = await req.json()
    
    // Inisialisasi Supabase Admin
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // 1. Pastikan tabel system_settings ada (Safety check)
    // Jika query ini gagal, kita asumsikan tabel sudah ada atau ditangani manual
    try {
      await supabase.rpc('create_settings_table_if_not_exists') 
    } catch (e) {
      // Abaikan jika RPC tidak ada, lanjut ke fetch biasa
    }

    // 2. Ambil Pengaturan dari Database
    const { data: settings, error: dbError } = await supabase.from('system_settings').select('*')
    
    if (dbError) {
      console.error('Database Fetch Error (system_settings):', dbError.message)
    }

    const dbToken = settings?.find(i => i.key === 'FONNTE_TOKEN')?.value
    const dbGroupId = settings?.find(i => i.key === 'WA_GROUP_ID')?.value

    // 3. Gabungkan dengan Env Vars (DB lebih utama)
    const FONNTE_TOKEN = dbToken || process.env.FONNTE_TOKEN
    const WA_GROUP_ID = dbGroupId || process.env.WA_GROUP_ID

    console.log(`Broadcast Job: Using Group ID ${WA_GROUP_ID?.substring(0, 5)}...`)

    if (!FONNTE_TOKEN || !WA_GROUP_ID) {
      return NextResponse.json({ 
        message: 'WhatsApp configuration missing', 
        details: 'Pastikan FONNTE_TOKEN dan WA_GROUP_ID sudah diisi di dashboard admin.' 
      }, { status: 400 })
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

    // 4. Kirim ke API Fonnte menggunakan FormData (Cara paling stabil untuk Fonnte)
    const formData = new FormData()
    formData.append('target', WA_GROUP_ID)
    formData.append('message', message)
    formData.append('delay', '2')
    formData.append('countryCode', '62') // Default Indonesia

    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: { 
        'Authorization': FONNTE_TOKEN 
      },
      body: formData
    })

    const result = await response.json()
    console.log('Fonnte Response:', result)
    
    return NextResponse.json({ 
      success: result.status === true, 
      fonnte_response: result 
    })

  } catch (error) {
    console.error('Critical Broadcast Error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
