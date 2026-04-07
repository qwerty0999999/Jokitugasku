import { GoogleGenAI } from '@google/genai'

const systemPrompt = `Role: CS Jokitugasku.
Rules:
1. Layanan: Joki Tugas, Makalah, Skripsi, PPT, Coding, SPSS.
2. Harga: Rp20rb-300rb+. 
3. Waktu: Tugas (3-12j), Makalah (1-2hr), Skripsi (7-21hr).
4. Outline only, no full answers.
5. Goal: Arahkan ke WA wa.me/6289524894059.
Gaya: Singkat, ramah, to-the-point.`

const WA_LINK = 'wa.me/6289524894059'

// ─── FALLBACK RULES ───────────────────────────────────────────────────────────
// Dipakai saat API Gemini error / tidak tersedia
const FALLBACK_RULES = [
  {
    keys: ['harga', 'biaya', 'bayar', 'tarif', 'berapa', 'murah', 'mahal', 'budget'],
    answer: `Harga layanan kami:
• Tugas harian (resume, essay) → mulai Rp20rb
• Makalah / laporan → mulai Rp50rb/bab
• Skripsi / TA → mulai Rp100rb/bab
• PPT profesional → mulai Rp30rb
• Coding / IT project → harga custom

Untuk penawaran pasti, chat Admin via WhatsApp ya → ${WA_LINK} 😊`,
  },
  {
    keys: ['lama', 'proses', 'deadline', 'cepat', 'durasi', 'selesai', 'berapa lama', 'kapan'],
    answer: `Estimasi waktu pengerjaan:
• Tugas harian → 3–12 jam
• Makalah/laporan → 1–2 hari
• Skripsi/TA → 7–21 hari
• PPT → 1–3 hari
• Coding → tergantung kompleksitas

Deadline mendadak? Bisa kok! Ada biaya urgent. Hubungi Admin → ${WA_LINK} ⚡`,
  },
  {
    keys: ['layanan', 'bisa', 'joki', 'apa saja', 'bantuan', 'tersedia', 'jenis'],
    answer: `Layanan Jokitugasku:
📄 Joki Tugas Kuliah (essay, resume, rangkuman)
📝 Makalah / Karya Tulis Ilmiah
🎓 Skripsi & Tugas Akhir
📊 Analisis Data SPSS / WarpPLS
🖥️ Pembuatan Presentasi (PPT)
💻 Coding & IT (web, Python, Java, PHP)

Butuh yang lain? Tanya Admin → ${WA_LINK}`,
  },
  {
    keys: ['revisi', 'salah', 'kurang sesuai', 'koreksi', 'ubah', 'edit'],
    answer: `Tentu! Semua paket sudah termasuk revisi gratis 🙏
• Tugas ringan → 1x revisi gratis
• Makalah & Skripsi → revisi unlimited sampai puas
• Coding → revisi sesuai scope awal

Kepuasan kamu prioritas utama kami!`,
  },
  {
    keys: ['bayar', 'transfer', 'pembayaran', 'dp', 'uang muka', 'gopay', 'ovo', 'dana', 'qris'],
    answer: `Cara pembayaran:
💳 Transfer Bank (BCA, Mandiri, BNI, BRI)
📱 E-Wallet (GoPay, OVO, DANA, ShopeePay)
🔲 QRIS

Sistem: DP (uang muka) di awal → sisa setelah selesai.
Detail bisa diatur via WhatsApp → ${WA_LINK}`,
  },
  {
    keys: ['privasi', 'rahasia', 'aman', 'bocor', 'data', 'identitas'],
    answer: `Privasi kamu 100% terjaga 🔒
• Data & tugas bersifat rahasia
• Tidak dibagikan ke pihak manapun
• Tim kami terikat kerahasiaan klien

Jokitugasku sudah dipercaya 500+ mahasiswa. Aman!`,
  },
  {
    keys: ['lacak', 'tracking', 'status', 'progress', 'kode order', 'cek order'],
    answer: `Setelah order, kamu dapat kode unik (contoh: JTK-20240401-ABC12).
Masukkan di halaman "Cek Order" untuk lihat progress real-time.

Belum punya kode? Buat order dulu via form atau WhatsApp → ${WA_LINK}`,
  },
  {
    keys: ['skripsi', 'thesis', 'ta', 'tugas akhir', 'bab', 'proposal', 'sidang'],
    answer: `Kami spesialis Skripsi & Tugas Akhir! 🎓
• Bab 1–5 lengkap
• Proposal skripsi
• Analisis data (SPSS, WarpPLS, Amos)
• Persiapan sidang
• Revisi unlimited

Konsultasi GRATIS dulu → ${WA_LINK}`,
  },
  {
    keys: ['coding', 'program', 'website', 'python', 'java', 'php', 'javascript', 'database', 'sql', 'api', 'aplikasi'],
    answer: `Layanan Coding & IT kami:
💻 Website (HTML, React, Next.js, dll)
🐍 Python (data science, automasi, script)
☕ Java & PHP
🗄️ Database & SQL
🔌 REST API & Backend

Harga custom sesuai kebutuhan. Chat Admin → ${WA_LINK}`,
  },
  {
    keys: ['spss', 'warpls', 'analisis data', 'statistik', 'regresi', 'anova', 'korelasi'],
    answer: `Kami handle analisis data statistik:
📊 SPSS (deskriptif, korelasi, regresi, anova)
📈 WarpPLS / SmartPLS (SEM)
📉 Amos / LISREL
📋 Output + interpretasi lengkap

Deskripsi data & deadline kirim via WA → ${WA_LINK}`,
  },
  {
    keys: ['kontak', 'hubungi', 'whatsapp', 'wa', 'admin', 'nomor', 'telepon'],
    answer: `Hubungi Admin Jokitugasku:
📱 WhatsApp → ${WA_LINK}
⏰ Online 7 hari/minggu, siap membantu!

Konsultasi GRATIS, tanpa komitmen dulu 😊`,
  },
  {
    keys: ['urgent', 'mendadak', 'mepet', 'hari ini', 'jam', 'express', 'kilat'],
    answer: `Bisa order mendadak! ⚡
Kami layani order urgent dengan estimasi:
• < 6 jam → biaya urgent berlaku
• < 24 jam → masih bisa diproses normal

Konfirmasi ketersediaan tim via WA dulu →  ${WA_LINK}`,
  },
]

// Fungsi fallback utama — cari rule paling relevan
const getFallbackResponse = (userMsg = '') => {
  const msg = userMsg.toLowerCase()

  // Cari rule dengan keyword paling banyak cocok
  let bestMatch = null
  let bestScore = 0

  for (const rule of FALLBACK_RULES) {
    const score = rule.keys.filter(k => msg.includes(k)).length
    if (score > bestScore) {
      bestScore = score
      bestMatch = rule
    }
  }

  if (bestMatch && bestScore > 0) {
    return bestMatch.answer
  }

  // Default fallback jika tidak ada yang cocok
  return `Halo! 👋 Saya asisten Jokitugasku.

Saya membantu info seputar:
📌 Layanan & harga
⏱️ Estimasi waktu pengerjaan  
💳 Cara pembayaran
🔄 Garansi revisi

Atau langsung konsultasi GRATIS dengan Admin kami → ${WA_LINK} 😊`
}

// ─── API ROUTE ────────────────────────────────────────────────────────────────
export async function POST(req) {
  let lastMsg = { content: '' }

  try {
    // Validasi format JSON
    const body = await req.json().catch(() => null)
    if (!body || !body.messages || !Array.isArray(body.messages)) {
      return new Response(getFallbackResponse(''), {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    }

    const { messages } = body
    if (messages.length === 0) {
      return new Response(getFallbackResponse(''), {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    }

    const apiKey = process.env.GEMINI_API_KEY
    const historyWindow = messages.slice(-5)
    lastMsg = historyWindow.pop() || { content: '' }

    if (!apiKey) {
      return new Response(getFallbackResponse(lastMsg.content), {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    }

    const ai = new GoogleGenAI({ apiKey })

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
    // lastMsg sudah terdefinisi di luar try, jadi aman
    return new Response(getFallbackResponse(lastMsg.content), {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }
}
