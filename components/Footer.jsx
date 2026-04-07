import Image from 'next/image'

const WA_NUMBER = '6289524894059'

const footerLinks = {
  layanan: [
    { label: 'Joki Tugas', href: '#services' },
    { label: 'Konsultasi Skripsi', href: '#services' },
    { label: 'Pembuatan PPT', href: '#services' },
    { label: 'Coding & IT', href: '#services' },
    { label: 'Analisis Data', href: '#services' },
  ],
  perusahaan: [
    { label: 'Tentang Kami', href: '#hero' },
    { label: 'Cara Kerja', href: '#how-it-works' },
    { label: 'Testimoni', href: '#testimonials' },
    { label: 'Harga', href: '#pricing' },
    { label: 'Order Tugas', href: '#order-form' },
  ],
}

const contactItems = [
  { icon: '💬', text: 'WhatsApp: +62 895-2489-4059' },
  { icon: '✈️', text: 'Telegram: @jokitugasku' },
  { icon: '📧', text: 'info@jokitugasku.id' },
  { icon: '⏰', text: 'Senin–Minggu, 07.00–23.00' },
]

const socials = [
  { icon: '📸', label: 'Instagram', href: '#' },
  { icon: '🎵', label: 'TikTok', href: '#' },
  { icon: '💬', label: 'WhatsApp', href: `https://wa.me/${WA_NUMBER}`, external: true },
  { icon: '✈️', label: 'Telegram', href: 'https://t.me/jokitugasku', external: true },
]

export default function Footer() {
  return (
    <footer id="footer" className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-blue-500/40">
                <Image src="/logo.png" alt="Jokitugasku" fill className="object-cover" />
              </div>
              <span className="font-display font-bold text-white text-lg">Jokitugasku</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              Solusi akademik terpercaya untuk mahasiswa.{' '}
              Tugas beres, hidup lebih santai. 🎯
            </p>
            <div className="flex items-center gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  title={social.label}
                  target={social.external ? '_blank' : undefined}
                  rel={social.external ? 'noopener noreferrer' : undefined}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/30 flex items-center justify-center text-base transition-all duration-200 hover:-translate-y-0.5"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Layanan</h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.layanan.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-500 hover:text-gray-300 text-sm transition-colors duration-200">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Perusahaan</h4>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.perusahaan.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-500 hover:text-gray-300 text-sm transition-colors duration-200">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Kontak</h4>
            <ul className="flex flex-col gap-3">
              {contactItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-base flex-shrink-0 mt-0.5">{item.icon}</span>
                  <span className="text-gray-500 text-sm">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 my-8" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Jokitugasku by RF Digital. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {[{ label: 'Privacy Policy', href: '#' }, { label: 'Terms & Conditions', href: '#' }, { label: 'FAQ', href: '#faq' }].map((link) => (
              <a key={link.label} href={link.href} className="text-gray-600 hover:text-gray-400 text-xs transition-colors duration-200">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
