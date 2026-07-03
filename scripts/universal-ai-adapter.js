/**
 * Agnostic AI Refinement with Failover Routing: Gemini -> OpenRouter -> Grok
 * This file is purely synchronous I/O and does NOT have database dependencies.
 */

/**
 * Pintu gerbang utama pengolahan teks otonom dengan sistem failover otomatis.
 * @param {string} prompt Prompt instruksi SEO tingkat tinggi
 * @returns {Promise<object>} Output terstruktur yang sudah dibersihkan
 */
async function executeAgnosticAiRefinement(prompt) {
  const providers = [
    {
      name: 'gemini',
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      payload: { contents: [{ parts: [{ text: prompt }] }] },
      parse: (res) => res.candidates[0].content.parts[0].text,
    },
    {
      name: 'openrouter',
      url: 'https://openrouter.ai/api/v1/chat/completions',
      payload: {
        model: 'google/gemini-flash-1.5-exp',
        messages: [{ role: 'user', content: prompt }],
      },
      parse: (res) => res.choices[0].message.content,
    },
    {
      name: 'grok',
      url: 'https://api.x.ai/v1/chat/completions',
      payload: {
        model: 'grok-beta',
        messages: [{ role: 'user', content: prompt }],
      },
      parse: (res) => res.choices[0].message.content,
    },
  ];

  for (const provider of providers) {
    try {
      console.log(`Attempting data refinement via AI Provider: ${provider.name}`);

      const response = await fetch(provider.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(provider.name === 'openrouter' && {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          }),
          ...(provider.name === 'grok' && { Authorization: `Bearer ${process.env.GROK_API_KEY}` }),
        },
        body: JSON.stringify(provider.payload),
      });

      if (!response.ok)
        throw new Error(`Provider ${provider.name} returned status code ${response.status}`);

      const json = await response.json();
      const rawText = provider.parse(json);

      // Ekstraksi paksa objek JSON dari respon LLM untuk mencegah halusinasi teks markdown
      const jsonRegex = /\{[\s\S]*\}/;
      const match = rawText.match(jsonRegex);

      if (!match) throw new Error('LLM failed to output a compliant structured JSON block.');

      return JSON.parse(match[0]);
    } catch (err) {
      console.warn(
        `Provider ${provider.name} failure encountered: ${err.message}. Cascading to next available node...`,
      );
      // Warning logged, callers will handle storing failover logs if needed.
    }
  }

  throw new Error(
    'Critical Infrastructure Exhaustion: All configured AI Providers failed to resolve execution cycle.',
  );
}

module.exports = { executeAgnosticAiRefinement };
