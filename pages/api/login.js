export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;
  if (username === process.env.APP_USERNAME && password === process.env.APP_PASSWORD) {
    return res.status(200).json({ ok: true });
  }
  return res.status(401).json({ ok: false, error: 'Invalid credentials' });
}
