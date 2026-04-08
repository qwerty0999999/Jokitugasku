'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Sparkles, Bot, User, Loader2 } from 'lucide-react'

const SUGGESTIONS = [
  'Berapa harga joki laporan?',
  'Berapa lama proses pengerjaan?',
  'Buat outline makalah tentang pendidikan',
  'Apa saja layanan yang tersedia?',
]

const WELCOME = 'Halo! 👋 Saya asisten AI Jokitugasku. Ada yang bisa saya bantu — mulai dari info layanan, estimasi harga, hingga preview outline tugasmu! Admin kami juga standby di WhatsApp jika kamu butuh bantuan mendalam.'

export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hideLabel, setHideLabel] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: WELCOME },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDot, setShowDot] = useState(true)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    // Penundaan muncul agar tidak mengagetkan
    const timer = setTimeout(() => setVisible(true), 2500)
    
    // Deteksi scroll untuk transparansi
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true)
        setHideLabel(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300)
      setShowDot(false)
      setHideLabel(true)
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text) => {
    const userMsg = text || input.trim()
    if (!userMsg || loading) return
    setInput('')
    const newMessages = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      if (!res.ok) {
        const err = await res.json()
        setMessages((m) => [...m, { role: 'assistant', content: err.error || 'Maaf, terjadi kesalahan.' }])
        return
      }

      // Stream response
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let assistantMsg = ''
      setMessages((m) => [...m, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        assistantMsg += decoder.decode(value, { stream: true })
        setMessages((m) => {
          const updated = [...m]
          updated[updated.length - 1] = { role: 'assistant', content: assistantMsg }
          return updated
        })
      }
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Koneksi bermasalah. Coba lagi ya!' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      {/* Floating button */}
      <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 transition-all duration-500 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'} ${scrolled && !open ? 'opacity-40 hover:opacity-100' : ''}`}>
        <AnimatePresence>
          {!open && !hideLabel && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              className="bg-white border border-gray-100 shadow-lg rounded-2xl px-4 py-2.5 text-sm font-medium text-gray-700 max-w-[220px] text-center mb-1 hidden sm:block"
            >
              Chat AI Jokitugasku ✨
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          id="btn-ai-assistant"
          onClick={() => setOpen((o) => !o)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white shadow-xl group transition-all duration-300"
          style={{ background: 'linear-gradient(135deg, #6366f1, #3B82F6)' }}
          aria-label="Buka AI Assistant"
        >
          {/* Pulse rings - Inspired by WaFloat */}
          {!open && (
            <>
              <span className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-20" />
              <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-10" style={{ animationDelay: '300ms' }} />
            </>
          )}

          <AnimatePresence mode="wait">
            {open ? (
              <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X size={20} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
              </motion.div>
            ) : (
              <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <Bot size={22} className="sm:w-7 sm:h-7" strokeWidth={2.2} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Unread notification dot */}
          {showDot && !open && (
            <span className="absolute top-0 right-0 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-rose-500 rounded-full border-2 border-white z-20" />
          )}
        </motion.button>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 24 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 w-[calc(100vw-32px)] sm:w-[380px] bg-white rounded-[2rem] sm:rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
            style={{ height: 'min(580px, 75vh)' }}
          >
            {/* Header */}
            <div
              className="px-5 py-4 flex items-center gap-3 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366f1, #3B82F6)' }}
            >
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Bot size={20} className="text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm">Asisten AI Jokitugasku</div>
                <div className="text-white/70 text-xs">Asisten AI Pintar</div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/80">
                <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                Online
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 scroll-smooth">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs
                    ${msg.role === 'assistant'
                      ? 'bg-gradient-to-br from-indigo-500 to-blue-500'
                      : 'bg-gradient-to-br from-gray-400 to-gray-500'
                    }`}
                  >
                    {msg.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                      ${msg.role === 'user'
                        ? 'bg-blue-500 text-white rounded-br-sm'
                        : 'bg-gray-50 text-gray-800 border border-gray-100 rounded-bl-sm'
                      }`}
                  >
                    {msg.content || (
                      <span className="flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}

              {loading && messages[messages.length - 1]?.role !== 'assistant' && (
                <div className="flex items-end gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="bg-gray-50 border border-gray-100 px-3.5 py-2.5 rounded-2xl rounded-bl-sm">
                    <span className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick suggestions — hanya tampil di awal */}
            {messages.length <= 1 && (
              <div className="px-4 pb-3 flex flex-wrap gap-2 flex-shrink-0">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="px-3 py-1.5 text-xs rounded-xl bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-colors font-medium"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 pb-4 flex-shrink-0">
              <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3.5 py-2.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tanya sesuatu…"
                  rows={1}
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none max-h-24 leading-relaxed"
                  style={{ lineHeight: '1.4' }}
                />
                <button
                  onClick={() => send()}
                  disabled={!input.trim() || loading}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                  aria-label="Kirim pesan"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
              </div>
              <div className="text-center text-xs text-gray-300 mt-2">AI dapat salah · Cek konfirmasi via WhatsApp</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
