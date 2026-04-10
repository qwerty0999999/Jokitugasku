import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const { order_code, updates } = await req.json()

    if (!order_code) {
      return NextResponse.json({ error: 'Kode order diperlukan.' }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Update menggunakan Admin Client (Master Key) agar bypass RLS gembok
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update(updates)
      .eq('order_code', order_code)
      .select()

    if (error) {
      console.error('API Update Error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Server Error:', error.message)
    return NextResponse.json({ error: 'Terjadi kesalahan server internal.' }, { status: 500 })
  }
}
