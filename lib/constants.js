/**
 * Application Constants
 * Semua nilai konstanta yang digunakan di seluruh aplikasi terpusat di sini.
 * Ini mencegah "magic numbers/strings" tersebar di codebase.
 */

// ── CONTACT & BUSINESS INFO ──────────────────────────────────
export const WA_NUMBER = '6289524894059'
export const WA_BASE_URL = `https://wa.me/${WA_NUMBER}`
export const BUSINESS_NAME = 'Jokitugasku'
export const BUSINESS_TAGLINE = 'Solusi Cepat & Terpercaya untuk Tugas Akademik'

// ── ORDER STATUS ─────────────────────────────────────────────
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  REVISI: 'revisi',
  DONE: 'done',
}

export const ORDER_STATUS_LABEL = {
  [ORDER_STATUS.PENDING]: 'Menunggu Konfirmasi',
  [ORDER_STATUS.CONFIRMED]: 'Dikonfirmasi',
  [ORDER_STATUS.IN_PROGRESS]: 'Sedang Dikerjakan',
  [ORDER_STATUS.REVIEW]: 'Dalam Review',
  [ORDER_STATUS.REVISI]: 'Dalam Revisi',
  [ORDER_STATUS.DONE]: 'Selesai 🎉',
}

// ── PROGRESS AUTO-VALUE PER STATUS ───────────────────────────
export const STATUS_PROGRESS = {
  [ORDER_STATUS.PENDING]: 0,
  [ORDER_STATUS.CONFIRMED]: 20,
  [ORDER_STATUS.IN_PROGRESS]: 50,
  [ORDER_STATUS.REVISI]: 70,
  [ORDER_STATUS.REVIEW]: 90,
  [ORDER_STATUS.DONE]: 100,
}

// ── SERVICES ─────────────────────────────────────────────────
export const SERVICES = [
  'Joki Tugas Kuliah',
  'Joki Tugas Sekolah',
  'Pembuatan PPT Presentasi',
  'Joki Coding / Programming',
  'Pembuatan Makalah',
  'Konsultasi Skripsi / Thesis',
  'Penulisan Essay / Artikel',
  'Terjemahan Dokumen',
  'Lainnya',
]

// ── UI CONFIG ────────────────────────────────────────────────
export const ANIMATION_DURATION = {
  FAST: 0.2,
  NORMAL: 0.4,
  SLOW: 0.8,
}

// ── BANK PAYMENT INFO ────────────────────────────────────────
export const PAYMENT_METHODS = [
  { name: 'BCA', number: '1234567890', holder: 'Jokitugasku' },
  { name: 'DANA', number: '+62 895-2489-4059', holder: 'Jokitugasku' },
]
