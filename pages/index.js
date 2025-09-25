import { useState } from 'react';

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('alloy');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [message, setMessage] = useState('');

  async function handleLogin() {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.ok) {
      setLoggedIn(true);
    } else {
      alert('Invalid credentials');
    }
  }

  async function handleGenerate() {
    setLoading(true);
    setMessage('');
    setAudioUrl(null);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'TTS error');
      const audioBuffer = Uint8Array.from(atob(data.audio), c => c.charCodeAt(0));
      const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setMessage('Audio ready.');
    } catch (e) {
      setMessage('Error: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  if (!loggedIn) {
    return (
      <div style={{ maxWidth: 400, margin: '100px auto', textAlign: 'center' }}>
        <h1>Login</h1>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={{ display: 'block', margin: '10px auto', padding: '8px' }} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ display: 'block', margin: '10px auto', padding: '8px' }} />
        <button onClick={handleLogin} style={{ padding: '8px 16px' }}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 20 }}>
      <h1>Groketer Text-to-Speech</h1>

      <label>Choose voice:</label>
<select
  value={voice}
  onChange={(e) => setVoice(e.target.value)}
  className="w-full border rounded p-2"
>
  {/* Female voices */}
  <option value="verse">Enoch (Male)</option>
  <option value="sage">Grace (Female)</option>

  {/* Male voices */}
  <option value="alloy">Nancy (Female)</option>
  <option value="ash">Mwangi (Male)</option>
</select>

      <div style={{ marginTop: 12 }}>
        <textarea rows={10} style={{ width: '100%', padding: 12 }} value={text} onChange={e =>setText(e.target.value)} placeholder="Paste lesson script here..."></textarea>
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={handleGenerate} disabled={loading || !text} style={{ padding: '10px 16px' }}>
          {loading ? 'Generating...' : 'Generate & Download MP3'}
        </button>
      </div>

      {message && <p style={{ marginTop: 12 }}>{message}</p>}

      {audioUrl && (
        <div style={{ marginTop: 16 }}>
          <audio controls src={audioUrl}></audio>
          <br />
          <a href={audioUrl} download="lesson.mp3">Download MP3</a>
        </div>
      )}
    </div>
  );
}
