import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const { order_code, payment_receipt_url } = await req.json()

    if (!order_code || !payment_receipt_url) {
      return NextResponse.json({ error: 'Data tidak lengkap.' }, { status: 400 })
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Verifikasi order ada
    const { data: order, error: checkError } = await supabaseAdmin
      .from('orders')
      .select('id')
      .eq('order_code', order_code.trim().toUpperCase())
      .single()

    if (checkError || !order) {
      return NextResponse.json({ error: 'Kode order tidak ditemukan.' }, { status: 404 })
    }

    // Update payment_receipt_url
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ payment_receipt_url })
      .eq('order_code', order_code.trim().toUpperCase())

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ success: true, message: 'Bukti pembayaran berhasil diunggah.' })
  } catch (error) {
    console.error('Payment Receipt API Error:', error.message)
    return NextResponse.json({ error: 'Terjadi kesalahan sistem internal.' }, { status: 500 })
  }
}
