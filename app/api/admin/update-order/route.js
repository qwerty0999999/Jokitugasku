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

    // 1. Update data order utama
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update(updates)
      .eq('order_code', order_code)
      .select()
      .single()

    if (error) {
      console.error('API Update Error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 2. CATAT LOG MILESTONE (Jika status berubah)
    if (updates.status || updates.notes) {
      await supabaseAdmin
        .from('order_logs')
        .insert([{
          order_code: order_code,
          status: updates.status || data.status,
          notes: updates.notes || 'Status diperbarui oleh admin.',
          admin_email: updates.processed_by || 'system'
        }])
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Server Error:', error.message)
    return NextResponse.json({ error: 'Terjadi kesalahan server internal.' }, { status: 500 })
  }
}
