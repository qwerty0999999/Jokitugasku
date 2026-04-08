/**
 * Utility Functions
 * Kumpulan helper function yang digunakan di seluruh aplikasi
 */

/**
 * Format angka menjadi format mata uang Rupiah
 * @param {number} amount - Jumlah yang akan diformat
 * @returns {string} String terformat, contoh: "Rp 50.000"
 */
export function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

/**
 * Format tanggal ke format Indonesia
 * @param {string|Date} date - Tanggal yang akan diformat
 * @returns {string} String terformat, contoh: "8 Apr 2026"
 */
export function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Format tanggal + waktu ke format Indonesia
 * @param {string|Date} date - Tanggal yang akan diformat
 * @returns {string} String terformat, contoh: "8 Apr 2026, 17.00"
 */
export function formatDateTime(date) {
  if (!date) return '-'
  return new Date(date).toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

/**
 * Truncate teks panjang dengan ellipsis
 * @param {string} text - Teks yang akan dipotong
 * @param {number} maxLength - Panjang maksimal karakter
 * @returns {string}
 */
export function truncate(text, maxLength = 50) {
  if (!text) return ''
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

/**
 * Capitalize huruf pertama dari sebuah string
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Generate nomor telepon WhatsApp yang valid dari berbagai format
 * @param {string} phone - Nomor telepon (bisa diawali 0 atau +62)
 * @returns {string} Nomor format internasional, contoh: "6281234567890"
 */
export function formatPhoneWA(phone) {
  if (!phone) return ''
  return phone.replace(/[^0-9]/g, '').replace(/^0/, '62')
}

/**
 * Cek apakah nilai sudah merupakan objek JavaScript kosong
 * @param {object} obj
 * @returns {boolean}
 */
export function isEmptyObject(obj) {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object
}
