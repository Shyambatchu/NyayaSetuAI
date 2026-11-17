import { useEffect, useRef, useState } from 'react'
import './App.css'
import { Logo } from './components/Logo'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1'
const APP_NAME = import.meta.env.VITE_APP_NAME ?? 'VidhiVerse AI'
const APP_TAGLINE = import.meta.env.VITE_APP_TAGLINE ?? 'Understand Law. Access Justice.'
const SESSION_STORAGE_KEY = 'vidhiverse_session_id'

const STARTER_QUESTIONS = [
  'What does Article 21 of the Constitution protect?',
  'How do I file a consumer complaint?',
  'What replaced IPC Section 302 in the BNS?',
]

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  answerStatus?: string | null
}

async function createSession(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/chat/sessions`, { method: 'POST' })
  if (!response.ok) throw new Error('failed to create session')
  const data = await response.json()
  return data.session_id as string
}

async function sendMessage(sessionId: string, content: string) {
  const response = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  if (!response.ok) throw new Error('failed to send message')
  return response.json()
}

export default function App() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const existing = localStorage.getItem(SESSION_STORAGE_KEY)
    if (existing) {
      setSessionId(existing)
      return
    }
    createSession()
      .then((id) => {
        localStorage.setItem(SESSION_STORAGE_KEY, id)
        setSessionId(id)
      })
      .catch(() => setError('Could not reach the server. Is the backend running?'))
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    const nextHeight = Math.min(el.scrollHeight, 160)
    el.style.height = `${nextHeight}px`
    el.style.overflowY = el.scrollHeight > 160 ? 'auto' : 'hidden'
  }, [input])

  async function submit(content: string) {
    const trimmed = content.trim()
    if (!trimmed || !sessionId || sending) return

    setInput('')
    setError(null)
    setSending(true)
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', content: trimmed }])

    try {
      const reply = await sendMessage(sessionId, trimmed)
      setMessages((prev) => [
        ...prev,
        { id: reply.id, role: 'assistant', content: reply.content, answerStatus: reply.answer_status },
      ])
    } catch {
      setError('The message could not be sent. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <Logo name={APP_NAME} />
        <p className="tagline">{APP_TAGLINE}</p>
      </header>

      <main className="chat">
        {messages.length === 0 && (
          <div className="empty-state">
            <p>Ask a question about your legal rights to begin.</p>
            <div className="starter-chips">
              {STARTER_QUESTIONS.map((question) => (
                <button key={question} type="button" className="chip" onClick={() => submit(question)}>
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`message message-${message.role}`}>
            <div className="message-bubble">{message.content}</div>
            {message.answerStatus && message.answerStatus !== 'answered' && (
              <div className="message-status">{message.answerStatus.replaceAll('_', ' ')}</div>
            )}
          </div>
        ))}

        {sending && (
          <div className="message message-assistant">
            <div className="message-bubble typing-indicator" aria-live="polite" aria-label="Assistant is responding">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      {error && <div className="error-banner" role="alert">{error}</div>}

      <form
        className="composer"
        onSubmit={(event) => {
          event.preventDefault()
          void submit(input)
        }}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              void submit(input)
            }
          }}
          placeholder="Ask about your rights, a notice, or a law..."
          disabled={!sessionId || sending}
          rows={1}
        />
        <button type="submit" disabled={!sessionId || sending || !input.trim()} aria-label="Send">
          Send
        </button>
      </form>

      <p className="disclaimer-footer">
        Information, not legal advice. Answers are not reviewed by a lawyer.
      </p>
    </div>
  )
}
