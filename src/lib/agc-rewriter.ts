/**
 * AGC Rewriter Module (Cascading Free LLM Strategy)
 * Strategy: Gemini Flash -> Groq (Llama 3) -> Hugging Face T5 (Fallback)
 */
export async function rewriteContent(originalText: string): Promise<{
  paraphrasedHook: string;
  syntacticVariant: string;
  paraphraseSummary: string;
  originalTokenCount: number;
  newTokenCount: number;
} | null> {
  console.log('[AGC-REWRITER] Starting cascading rewrite process...');

  try {
    return await rewriteWithGemini(originalText);
  } catch (err: any) {
    console.warn(`[AGC-REWRITER] Gemini failed (${err.message}), falling back to Groq...`);
    try {
      return await rewriteWithGroq(originalText);
    } catch (groqErr: any) {
      console.warn(
        `[AGC-REWRITER] Groq failed (${groqErr.message}), falling back to HuggingFace T5...`,
      );
      return await rewriteWithHuggingFace(originalText);
    }
  }
}

async function rewriteWithGemini(text: string) {
  if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not configured');

  const prompt = `You are a professional B2B SaaS copywriter. Paraphrase the following text.
DO NOT rewrite the entire article. Extract and rewrite a hook, a syntactic variant, and a summary.
Return ONLY a valid JSON object strictly matching this schema:
{
  "paraphrasedHook": "A compelling, distinct 1-2 sentence hook.",
  "syntacticVariant": "A single sentence that conveys the core message differently.",
  "paraphraseSummary": "A 2-3 sentence summary of the text.",
  "originalTokenCount": ${text.split(/\\s+/).length},
  "newTokenCount": 0
}

Text to paraphrase:
${text.substring(0, 5000)}
`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    },
  );

  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
  const data = await res.json();
  const jsonStr = data.candidates[0].content.parts[0].text;

  const parsed = JSON.parse(jsonStr);
  parsed.newTokenCount =
    (parsed.paraphraseSummary || '').split(/\\s+/).length +
    (parsed.paraphrasedHook || '').split(/\\s+/).length;
  return parsed;
}

async function rewriteWithGroq(text: string) {
  if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY not configured');

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You are a paraphraser. Return ONLY a JSON object with keys: paraphrasedHook, syntacticVariant, paraphraseSummary, originalTokenCount, newTokenCount.',
        },
        {
          role: 'user',
          content: `Paraphrase this text:\n\n${text.substring(0, 3000)}`,
        },
      ],
    }),
  });

  if (!res.ok) throw new Error(`Groq API error: ${res.status}`);
  const data = await res.json();
  const parsed = JSON.parse(data.choices[0].message.content);
  if (!parsed.originalTokenCount) parsed.originalTokenCount = text.split(/\\s+/).length;
  if (!parsed.newTokenCount)
    parsed.newTokenCount = (parsed.paraphrasedHook || '').split(/\\s+/).length;
  return parsed;
}

async function rewriteWithHuggingFace(text: string) {
  if (!process.env.HF_API_KEY) throw new Error('HF_API_KEY not configured for HuggingFace T5');

  // Using FLAN-T5-Paraphraser or similar as a final fallback
  const res = await fetch('https://api-inference.huggingface.co/models/Vamsi/T5_Paraphrase_Paws', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.HF_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: `paraphrase: ${text.substring(0, 500)}` }), // T5 usually has small context limits
  });

  if (!res.ok) throw new Error(`HF API error: ${res.status}`);
  const data = await res.json();

  const paraphrasedText =
    data[0]?.generated_text || data[0]?.translation_text || 'Paraphrase unavailable.';

  return {
    paraphrasedHook: paraphrasedText,
    syntacticVariant: paraphrasedText,
    paraphraseSummary: paraphrasedText,
    originalTokenCount: text.split(/\\s+/).length,
    newTokenCount: paraphrasedText.split(/\\s+/).length,
  };
}
