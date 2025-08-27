import { useState } from 'react';
import api from '../lib/api';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function send(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const { data } = await api.post('/api/chat', { message: userMsg.text });
      setMessages(prev => [...prev, { role: 'assistant', text: data.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I had trouble answering that.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: 'fixed', right: 16, bottom: 16 }}>
      {open && (
        <div style={{ width: 320, height: 420, background: 'white', border: '1px solid #ddd', borderRadius: 8, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: 8, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
            <strong>Chat Assistant</strong>
            <button onClick={() => setOpen(false)}>×</button>
          </div>
          <div style={{ flex: 1, padding: 8, overflowY: 'auto' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 'bold' }}>{m.role === 'user' ? 'You' : 'Assistant'}</div>
                <div>{m.text}</div>
              </div>
            ))}
            {loading && <div>Thinking…</div>}
          </div>
          <form onSubmit={send} style={{ padding: 8, borderTop: '1px solid #eee', display: 'flex', gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about classes, assignments, attendance..." style={{ flex: 1 }} />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
      {!open && (
        <button onClick={() => setOpen(true)} style={{ borderRadius: 999, padding: '10px 14px' }}>Chat</button>
      )}
    </div>
  );
}

