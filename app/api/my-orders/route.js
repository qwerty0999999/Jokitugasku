import { getSupabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const phone = searchParams.get('phone')

  if (!phone) {
    return Response.json({ error: 'Nomor WhatsApp wajib diisi.' }, { status: 400 })
  }

  // Bersihkan nomor telepon dari karakter non-digit
  const cleanPhone = phone.replace(/\D/g, '')
  
  // Format nomor telepon untuk perbandingan: 
  // - Jika diawali '0', ubah ke '62'
  // - Jika diawali '8', tambahkan '62'
  let formattedPhone = cleanPhone
  if (cleanPhone.startsWith('0')) {
    formattedPhone = '62' + cleanPhone.slice(1)
  } else if (cleanPhone.startsWith('8')) {
    formattedPhone = '62' + cleanPhone
  }

  try {
    const supabase = getSupabaseAdmin()
    
    // Cari order yang mengandung nomor telepon tersebut (pendekatan fleksibel)
    const { data, error } = await supabase
      .from('orders')
      .select('order_code, client_name, client_phone, service, status, progress, price, created_at, is_paid')
      .or(`client_phone.ilike.%${cleanPhone}%,client_phone.ilike.%${formattedPhone}%`)
      .order('created_at', { ascending: false })

    if (error) throw error

    return Response.json({ orders: data || [] })
  } catch (err) {
    console.error('MyOrders API Error:', err.message)
    return Response.json({ error: 'Gagal memuat data pesanan.' }, { status: 500 })
  }
}
