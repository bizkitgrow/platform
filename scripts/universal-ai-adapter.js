/**
 * LLM Provider Abstraction Layer
 * Implements Factory & Adapter design patterns to provide a unified
 * interface for different LLM providers (Gemini, OpenRouter, Grok).
 */

class LLMProvider {
  /**
   * Generates a polished content response.
   * @param {string} prompt The full prompt string
   * @returns {Promise<object>} The parsed JSON object
   */
  async generateResponse(prompt) {
    throw new Error('Method not implemented.');
  }
}

class GroqAdapter extends LLMProvider {
  constructor(apiKey) {
    super();
    this.apiKey = apiKey;
    this.url = 'https://api.groq.com/openai/v1/chat/completions';
    this.model = 'llama3-70b-8192';
  }

  async generateResponse(prompt) {
    const response = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      }),
    });
    if (!response.ok) throw new Error(`Groq responded with status ${response.status}`);
    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }
}

class GeminiAdapter extends LLMProvider {
  constructor(apiKey) {
    super();
    this.apiKey = apiKey;
    this.url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  }

  async generateResponse(prompt) {
    const response = await fetch(this.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });
    if (!response.ok) throw new Error(`Gemini responded with status ${response.status}`);
    const data = await response.json();
    try {
      const rawText = data.candidates[0].content.parts[0].text;
      return JSON.parse(rawText);
    } catch (e) {
      throw new Error('Gemini failed to return valid JSON');
    }
  }
}

class OpenRouterAdapter extends LLMProvider {
  constructor(apiKey) {
    super();
    this.apiKey = apiKey;
    this.url = 'https://openrouter.ai/api/v1/chat/completions';
  }

  async generateResponse(prompt) {
    const response = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-flash-1.5-exp',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      }),
    });
    if (!response.ok) throw new Error(`OpenRouter responded with status ${response.status}`);
    const data = await response.json();
    return this._extractJson(data.choices[0].message.content);
  }

  _extractJson(rawText) {
    const jsonRegex = /\{[\s\S]*\}/;
    const match = rawText.match(jsonRegex);
    if (!match) throw new Error('OpenRouter LLM failed to output JSON block.');
    return JSON.parse(match[0]);
  }
}

class GrokAdapter extends LLMProvider {
  constructor(apiKey) {
    super();
    this.apiKey = apiKey;
    this.url = 'https://api.x.ai/v1/chat/completions';
  }

  async generateResponse(prompt) {
    const response = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!response.ok) throw new Error(`Grok responded with status ${response.status}`);
    const data = await response.json();
    return this._extractJson(data.choices[0].message.content);
  }

  _extractJson(rawText) {
    const jsonRegex = /\{[\s\S]*\}/;
    const match = rawText.match(jsonRegex);
    if (!match) throw new Error('Grok LLM failed to output JSON block.');
    return JSON.parse(match[0]);
  }
}

const LLMFactory = {
  getProviders() {
    const providers = [];
    if (process.env.GROQ_API_KEY) providers.push(new GroqAdapter(process.env.GROQ_API_KEY));
    if (process.env.GEMINI_API_KEY) providers.push(new GeminiAdapter(process.env.GEMINI_API_KEY));
    if (process.env.OPENROUTER_API_KEY)
      providers.push(new OpenRouterAdapter(process.env.OPENROUTER_API_KEY));
    if (process.env.GROK_API_KEY) providers.push(new GrokAdapter(process.env.GROK_API_KEY));
    return providers;
  },
};

/**
 * Pintu gerbang utama pengolahan teks otonom dengan sistem failover otomatis.
 * @param {string} prompt Prompt instruksi SEO tingkat tinggi
 * @returns {Promise<object>} Output terstruktur yang sudah dibersihkan
 */
async function executeAgnosticAiRefinement(prompt) {
  const providers = LLMFactory.getProviders();

  if (providers.length === 0) {
    throw new Error(
      'Critical Configuration Error: No AI Provider API keys found in environment variables.',
    );
  }

  for (const provider of providers) {
    try {
      console.log(`[AI-ADAPTER] Attempting inference via ${provider.constructor.name}...`);
      return await provider.generateResponse(prompt);
    } catch (err) {
      console.warn(
        `[AI-ADAPTER] Provider ${provider.constructor.name} failure: ${err.message}. Cascading to next available node...`,
      );
    }
  }

  throw new Error(
    'Critical Infrastructure Exhaustion: All configured AI Providers failed to resolve execution cycle.',
  );
}

module.exports = {
  executeAgnosticAiRefinement,
  LLMFactory,
  GroqAdapter,
  GeminiAdapter,
  OpenRouterAdapter,
  GrokAdapter,
};
