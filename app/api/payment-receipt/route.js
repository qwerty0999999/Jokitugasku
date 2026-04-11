import { sendPaymentReceiptEmail } from '@/lib/email'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { order_code } = await request.json()

    if (!order_code) {
      return Response.json({ error: 'Order code is required.' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_code', order_code)
      .single()

    if (error || !order) {
      return Response.json({ error: 'Order not found.' }, { status: 404 })
    }

    // Hanya kirim jika statusnya LUNAS (is_paid = true)
    if (!order.is_paid) {
      return Response.json({ error: 'Order is not paid yet.' }, { status: 400 })
    }

    // Jika klien tidak memberikan email (karena form saat ini hanya phone),
    // Kita mungkin butuh field email di database di masa depan.
    // Tapi untuk sekarang, kita coba cek jika ada email di metadata atau field khusus.
    if (!order.client_email) {
       return Response.json({ message: 'No client email provided, skipping email notification.' })
    }

    const result = await sendPaymentReceiptEmail({
      email: order.client_email,
      name: order.client_name,
      orderCode: order.order_code,
      service: order.service,
      amount: order.price
    })

    if (result.error) {
       return Response.json({ error: result.error }, { status: 500 })
    }

    return Response.json({ message: 'Email receipt sent successfully!' })
  } catch (err) {
    console.error('Email API Error:', err)
    return Response.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
