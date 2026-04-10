import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')

    if (!code || code.trim() === '') {
      return NextResponse.json({ error: 'Kode order tidak valid.' }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Tarik data order (Gunakan maybeSingle agar tidak error jika kosong)
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .ilike('order_code', code.trim())
      .maybeSingle()

    if (error) {
      console.error('Database Error:', error.message)
      return NextResponse.json({ error: 'Terjadi kesalahan saat mengambil data.' }, { status: 500 })
    }

    if (!order) {
      console.warn(`Order tidak ditemukan untuk kode: ${code}`)
      return NextResponse.json({ error: 'Kode order tidak ditemukan. Pastikan kode benar.' }, { status: 404 })
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
