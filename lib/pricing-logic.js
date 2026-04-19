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
  'REGULAR': 1.0,      // 7+ hari
  'EXPRESS': 1.5,      // 3-6 hari
  'FAST': 2.0,         // 2 hari
  'RUSH': 2.5,         // < 24 jam
  'ULTRA_RUSH': 3.5    // < 12 jam
}

export const PROMO_CODES = {
  'DISKON10': { type: 'percentage', value: 0.1, label: 'Diskon 10% Pengguna Baru' }
}

/**
 * Menghitung estimasi harga berdasarkan parameter pesanan
 * @param {string} service - Tipe layanan
 * @param {string} level - Jenjang pendidikan
 * @param {number} hoursToDeadline - Sisa waktu dalam jam
 * @param {string} referralCode - Kode referral (opsional)
 * @returns {object} - Objek berisi harga asli, diskon, total, dan label rush
 */
export function calculateEstimatedPrice(service, level, hoursToDeadline, referralCode = '', dynamicPromoCodes = null) {
  const basePrice = SERVICE_BASE_PRICES[service] || 50000
  const levelMult = LEVEL_MULTIPLIERS[level] || 1.0
  
  let urgencyMult = URGENCY_MULTIPLIERS.REGULAR
  let urgencyLabel = ''

  if (hoursToDeadline <= 12) {
    urgencyMult = URGENCY_MULTIPLIERS.ULTRA_RUSH
    urgencyLabel = 'Ultra Rush Order'
  } else if (hoursToDeadline <= 24) {
    urgencyMult = URGENCY_MULTIPLIERS.RUSH
    urgencyLabel = 'Rush Order'
  } else if (hoursToDeadline <= 48) {
    urgencyMult = URGENCY_MULTIPLIERS.FAST
    urgencyLabel = 'Express'
  } else if (hoursToDeadline <= 144) { // <= 6 hari
    urgencyMult = URGENCY_MULTIPLIERS.EXPRESS
  }

  let estimate = basePrice * levelMult * urgencyMult
  
  // LOGIK REFERRAL & DISKON (Dinamis dari Database)
  let discount = 0
  let promoLabel = ''
  
  const code = referralCode?.trim()?.toUpperCase()
  const availablePromos = dynamicPromoCodes || PROMO_CODES

  if (code && availablePromos[code]) {
    const promo = availablePromos[code]
    promoLabel = promo.label
    if (promo.type === 'percentage') {
      discount = estimate * promo.value
    } else {
      discount = promo.value
    }
  } else if (code && code.length > 0) {
    // Default referral (kode kustom admin atau teman)
    discount = 10000
    promoLabel = 'Referral Code'
  }

  const finalPrice = Math.max(0, estimate - discount)
  
  // Pembulatan ke ribuan terdekat
  return {
    original: Math.ceil(estimate / 1000) * 1000,
    discount: Math.ceil(discount / 1000) * 1000,
    total: Math.ceil(finalPrice / 1000) * 1000,
    urgencyLabel: urgencyLabel,
    multiplier: urgencyMult,
    promoLabel: promoLabel
  }
}
