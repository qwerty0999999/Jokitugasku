import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')

    if (!code || code.trim() === '') {
      return NextResponse.json({ error: 'Kode order tidak valid.' }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY // Akses Service Role (Bypass RLS)

    if (!url || !key) {
      console.warn('API /track-order: Kunci Supabase belum diset.')
      return NextResponse.json({ error: 'Database tidak terkonfigurasi.' }, { status: 500 })
    }

    const supabaseAdmin = createClient(url, key)

    // Tarik data order (Sensor Data Sensitif Seperti Nomor HP dan Harga)
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('id, order_code, service, client_name, status, progress, deadline, notes')
      .eq('order_code', code.trim().toUpperCase())
      .single()

    if (error || !order) {
      return NextResponse.json({ error: 'Kode order tidak ditemukan.' }, { status: 404 })
    }

    // Jika status "Selesai", cari rating
    let rating = null
    if (order.status === 'done') {
      const { data: ratingData } = await supabaseAdmin
        .from('ratings')
        .select('stars')
        .eq('order_code', order.order_code)
        .single()
      rating = ratingData
    }

    return NextResponse.json({ order, rating })
  } catch (error) {
    console.error('Tracking API Error:', error.message)
    return NextResponse.json({ error: 'Terjadi kesalahan sistem internal.' }, { status: 500 })
  }
}
