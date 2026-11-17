import { useEffect, useRef, useState } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1'
const APP_NAME = import.meta.env.VITE_APP_NAME ?? 'VidhiVerse AI'
const SESSION_STORAGE_KEY = 'vidhiverse_session_id'

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
  }, [messages])

  async function handleSend() {
    const content = input.trim()
    if (!content || !sessionId || sending) return

    setInput('')
    setError(null)
    setSending(true)
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', content }])

    try {
      const reply = await sendMessage(sessionId, content)
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
        <h1>{APP_NAME}</h1>
        <p className="disclaimer">
          Information, not legal advice. Answers are not reviewed by a lawyer.
        </p>
      </header>

      <main className="chat">
        {messages.length === 0 && <p className="empty-state">Ask a question about your legal rights to begin.</p>}
        {messages.map((message) => (
          <div key={message.id} className={`message message-${message.role}`}>
            <div className="message-bubble">{message.content}</div>
            {message.answerStatus && message.answerStatus !== 'answered' && (
              <div className="message-status">{message.answerStatus.replaceAll('_', ' ')}</div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </main>

      {error && <div className="error-banner">{error}</div>}

      <form
        className="composer"
        onSubmit={(event) => {
          event.preventDefault()
          void handleSend()
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about your rights, a notice, or a law..."
          disabled={!sessionId || sending}
        />
        <button type="submit" disabled={!sessionId || sending || !input.trim()}>
          {sending ? 'Sending…' : 'Send'}
        </button>
      </form>
    </div>
  )
}
