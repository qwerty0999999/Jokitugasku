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

export function calculateEstimatedPrice(service, level, daysToDeadline) {
  const basePrice = SERVICE_BASE_PRICES[service] || 50000
  const levelMult = LEVEL_MULTIPLIERS[level] || 1.0
  
  let urgencyMult = URGENCY_MULTIPLIERS.REGULAR
  if (daysToDeadline <= 2) urgencyMult = URGENCY_MULTIPLIERS.SUPER_FAST
  else if (daysToDeadline <= 5) urgencyMult = URGENCY_MULTIPLIERS.EXPRESS

  const estimate = basePrice * levelMult * urgencyMult
  
  // Pembulatan ke ribuan terdekat
  return Math.ceil(estimate / 1000) * 1000
}
