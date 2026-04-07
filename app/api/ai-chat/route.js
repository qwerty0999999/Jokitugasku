import { GoogleGenAI } from '@google/genai'

const systemPrompt = `Role: CS Jokitugasku.
Rules:
1. Layanan: Joki Tugas, Makalah, Skripsi, PPT, Coding, SPSS.
2. Harga: Rp20rb-300rb+. 
3. Waktu: Tugas (3-12j), Makalah (1-2hr), Skripsi (7-21hr).
4. Outline only, no full answers.
5. Goal: Arahkan ke WA wa.me/6289524894059.
Gaya: Singkat, ramah, to-the-point.`

// Fallback logic for when API Key is missing or error occurs
const getFallbackResponse = (userMsg) => {
  const msg = userMsg.toLowerCase()
  if (msg.includes('harga') || msg.includes('biaya') || msg.includes('bayar')) {
    return "Harga layanan kami mulai dari Rp20rb - Rp300rb+ tergantung tingkat kesulitan dan deadline. Untuk detailnya, yuk langsung chat Admin via WA wa.me/6289524894059! ✨"
  }
  if (msg.includes('lama') || msg.includes('proses') || msg.includes('deadline')) {
    return "Waktu pengerjaan bervariasi: Tugas harian (3-12 jam), Makalah (1-2 hari), Skripsi/Tugas Akhir (7-21 hari). Admin akan memberikan estimasi pasti setelah kamu kirim detail tugasnya ya!"
  }
  if (msg.includes('layanan') || msg.includes('bisa') || msg.includes('joki')) {
    return "Kami melayani pengerjaan Tugas Kuliah, Makalah, Skripsi, PPT, Coding, SPSS, dan masih banyak lagi. Kamu butuh bantuan untuk tugas apa nih?"
  }
  if (msg.includes('revisi')) {
    return "Tentu! Kami memberikan garansi revisi gratis sesuai dengan instruksi awal pengerjaan. Kepuasanmu prioritas kami! 🙏"
  }
  return "Maaf ya, saat ini sistem AI sedang sibuk. Tapi tenang, kamu bisa langsung konsultasi GRATIS dengan Admin kami lewat WhatsApp di sini: wa.me/6289524894059. Admin kami standby kok! 😊"
}

export async function POST(req) {
  const { messages } = await req.json()

  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      // Return fallback as a non-streaming response
      const lastMsg = messages[messages.length - 1]
      return new Response(getFallbackResponse(lastMsg.content), {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    }

    const ai = new GoogleGenAI({ apiKey })
    // ... rest of the code for streaming ...

    // Hemat Token: Hanya 4 riwayat terakhir (2 tanya jawab)
    const historyWindow = messages.slice(-5) 
    const lastMsg = historyWindow.pop()

    const history = historyWindow.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const chat = ai.chats.create({
      model: 'gemini-2.0-flash',
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: 250,
        temperature: 0.5,
      },
      history,
    })

    const stream = await chat.sendMessageStream({ message: lastMsg.content })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.text ?? ''
          if (text) {
            controller.enqueue(encoder.encode(text))
          }
        }
        controller.close()
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (err) {
    console.error('AI chat error:', err)
    
    // Return a solid fallback even on major error
    return new Response(getFallbackResponse(lastMsg.content), {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }
}
