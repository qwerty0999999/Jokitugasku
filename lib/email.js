import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function sendPaymentReceiptEmail({ email, name, orderCode, service, amount }) {
  if (!resend) {
    console.warn('Resend API key missing. Skipping email.')
    return { error: 'Konfigurasi email belum siap.' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Jokitugasku <onboarding@resend.dev>',
      to: [email],
      subject: `[LUNAS] Bukti Pembayaran - ${orderCode}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563eb;">Halo, ${name}!</h2>
          <p>Terima kasih telah menggunakan jasa <strong>Jokitugasku.id</strong>.</p>
          <p>Pembayaran Anda untuk pesanan berikut telah kami terima dan dinyatakan <strong>LUNAS</strong>.</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <table style="width: 100%;">
              <tr>
                <td style="color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase;">Nomor Tiket</td>
                <td style="text-align: right; font-weight: bold;">#${orderCode}</td>
              </tr>
              <tr>
                <td style="color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase;">Layanan</td>
                <td style="text-align: right; font-weight: bold;">${service}</td>
              </tr>
              <tr>
                <td style="color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase;">Total Bayar</td>
                <td style="text-align: right; color: #10b981; font-weight: bold;">Rp ${new Intl.NumberFormat('id-ID').format(amount)}</td>
              </tr>
            </table>
          </div>

          <p>Anda dapat mengunduh invoice resmi dan file pengerjaan Anda melalui tautan berikut:</p>
          <a href="https://jokitugasku.id/invoice/${orderCode}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Lihat Invoice & File</a>
          
          <p style="margin-top: 30px; font-size: 12px; color: #94a3b8;">
            Jika ada pertanyaan, silakan hubungi asisten kami via WhatsApp di <a href="https://wa.me/6289524894059">0895-2489-4059</a>.
          </p>
        </div>
      `,
    })

    if (error) throw error
    return { success: true, data }
  } catch (err) {
    console.error('Email send error:', err)
    return { error: err.message }
  }
}
