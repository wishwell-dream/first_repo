export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, sajuProfile } = req.body || {};
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ 
      error: 'OPENAI_API_KEY is not set in Vercel Environment Variables. Please set OPENAI_API_KEY in Vercel project settings.' 
    });
  }

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const profileText = sajuProfile 
      ? `Client Saju Profile: Day Master ${sajuProfile.dayMaster || ''}, Pillar ${sajuProfile.dayPillar || ''}, Yongshin ${sajuProfile.yongshin || ''}, Animal ${sajuProfile.spouseAnimal || ''}`
      : 'Client Saju: General seeker';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are Master Cheon (천도령), a famous, mystical, and sharp Korean Saju (Four Pillars of Destiny) master who delivers witty, intuitive, and deeply accurate fortune readings for global modern seekers.
${profileText}
Guidelines:
1. Speak in English, with an authoritative, charismatic, and warmly witty MZ shaman tone.
2. Address their specific question directly using Saju principles (Five Elements balance, Yin/Yang, timing/Deun, Ten Gods).
3. Offer practical, blunt, and comforting life advice. Keep responses to 2-3 engaging paragraphs.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.8,
        max_tokens: 600
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      return res.status(response.status).json({ error: 'OpenAI API error', details: errBody });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Master Cheon has observed your stars in silence.';
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', message: err.message });
  }
}
