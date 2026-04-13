/**
 * Logika Perhitungan Harga Pintar Jokitugasku.id
 */

export const SERVICE_BASE_PRICES = {
  'Skripsi/Tesis': 500000,
  'Analisis Data SPSS': 300000,
  'Tugas Makalah': 100000,
  'PowerPoint Premium': 50000,
  'Pemrograman/Coding': 400000,
  'Lainnya': 50000
}

export const LEVEL_MULTIPLIERS = {
  'D3': 1.0,
  'S1': 1.2,
  'S2': 1.8,
  'S3': 2.5,
  'Umum': 1.0
}

export const URGENCY_MULTIPLIERS = {
  'REGULAR': 1.0,    // 7+ hari
  'EXPRESS': 1.5,    // 3-6 hari
  'SUPER_FAST': 2.5  // < 24-48 jam
}

export function calculateEstimatedPrice(service, level, daysToDeadline, referralCode = '') {
  const basePrice = SERVICE_BASE_PRICES[service] || 50000
  const levelMult = LEVEL_MULTIPLIERS[level] || 1.0
  
  let urgencyMult = URGENCY_MULTIPLIERS.REGULAR
  if (daysToDeadline <= 2) urgencyMult = URGENCY_MULTIPLIERS.SUPER_FAST
  else if (daysToDeadline <= 5) urgencyMult = URGENCY_MULTIPLIERS.EXPRESS

  let estimate = basePrice * levelMult * urgencyMult
  
  // Diskon Referral (Flat 10rb jika ada kode)
  let discount = 0
  if (referralCode && referralCode.trim().length > 0) {
    discount = 10000
  }

  const finalPrice = Math.max(0, estimate - discount)
  
  // Pembulatan ke ribuan terdekat
  return {
    original: Math.ceil(estimate / 1000) * 1000,
    discount: discount,
    total: Math.ceil(finalPrice / 1000) * 1000
  }
}
