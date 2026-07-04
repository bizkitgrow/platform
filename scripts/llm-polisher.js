const DOMPurify = require('isomorphic-dompurify');
const { executeAgnosticAiRefinement } = require('./universal-ai-adapter');

/**
 * Text Polishing Engine using multi-key free inference cascade
 * (Gemini -> OpenRouter -> Grok)
 */
async function polishText(rawText) {
  console.log('[LLM-POLISHER] Passing raw text to inference cascade...');

  let llmResponse = null;

  try {
    const prompt = `You are a professional B2B content editor and copywriter. Analyze the following raw text and transform it into a polished, high-quality, SEO-optimized blog article. 

CRITICAL WRITING STYLE RULES (Elements of Agent Style & Avoid AI Writing):
1. Do not assume the reader shares your tacit knowledge.
2. Do not use passive voice when the agent matters.
3. Do not use abstract or general language when a concrete, specific term exists.
4. Do not include needless words.
5. Express coordinate ideas in similar form (parallel structure).
6. Support factual claims with concrete evidence; do not be handwavy.
7. Do NOT use bullet points unless the content is a genuine list.
8. Do NOT use em or en dashes as casual sentence punctuation.
9. Do NOT start consecutive sentences with the same word or phrase.
10. Do NOT use repetitive transition words ("Additionally", "Furthermore", "Moreover").
11. Do NOT close every paragraph with a summary sentence.
12. NEVER use the following AI-ism words: delve, landscape, tapestry, realm, paradigm, embark, beacon, testament to, robust, comprehensive, cutting-edge, leverage, pivotal, underscores, meticulous, seamless, watershed moment, nestled, vibrant, intricate.
13. Replace the above AI-isms with simpler equivalents (e.g., use "use" instead of "leverage", "explore" instead of "delve").

Return ONLY a raw JSON object with no markdown formatting or code blocks. The JSON must exactly match this structure:
{
  "title": "A compelling, professional title",
  "seo_body": "The polished article content formatted as semantic HTML (e.g., <h2>, <p>, <ul>). Do not wrap in a full HTML document, just the body content.",
  "meta_desc": "A concise, engaging meta description under 160 characters.",
  "social_caption": "An engaging caption for social media sharing, including relevant hashtags.",
  "image_prompt": "A detailed, descriptive text prompt suitable for an AI image generator to create a professional abstract hero image for this article."
}

Raw text to polish:
${rawText}
`;

    // Second Pass (Auditing via LLM prompt rules is handled inherently if using high intelligence models,
    // but the unified abstraction layer ensures we get the best available model).
    llmResponse = await executeAgnosticAiRefinement(prompt);
  } catch (err) {
    console.error(
      '[LLM-POLISHER] API cascade failed, falling back to dynamic parsing:',
      err.message,
    );

    // Dynamic Fallback parsing from rawText
    // rawText format is expected to be:
    // Title: ...
    // Link: ...
    // Published: ...
    // Content: ...

    const titleMatch = rawText.match(/Title:\s*(.+)/);
    const linkMatch = rawText.match(/Link:\s*(.+)/);
    const contentMatch = rawText.match(/Content:\s*([\s\S]+)/);

    const fallbackTitle = titleMatch ? titleMatch[1].trim() : 'Industry Update';
    const fallbackLink = linkMatch ? linkMatch[1].trim() : '#';
    let fallbackContent = contentMatch ? contentMatch[1].trim() : 'No content available.';

    // Convert basic line breaks to paragraphs
    fallbackContent = fallbackContent
      .split('\n')
      .filter((p) => p.trim())
      .map((p) => `<p>${p}</p>`)
      .join('');

    llmResponse = {
      title: fallbackTitle,
      seo_body: `<h2>Breaking Update</h2>${fallbackContent}<p><a href="${fallbackLink}" target="_blank" rel="noopener noreferrer">Read full source here</a></p>`,
      meta_desc: `${fallbackContent.replace(/<[^>]*>?/gm, '').substring(0, 157)}...`,
      social_caption: `Read our latest update on ${fallbackTitle}: ${fallbackLink} #IndustryNews #Update`,
      image_prompt: `Abstract minimalist corporate background representing ${fallbackTitle}, professional, subtle colors`,
    };
  }

  // Sanitize the 'seo_body' using dompurify to prevent XSS
  console.log('[LLM-POLISHER] Sanitizing SEO body...');
  const cleanHtml = DOMPurify.sanitize(llmResponse.seo_body);
  llmResponse.seo_body = cleanHtml;

  console.log('[LLM-POLISHER] Polishing complete. Returning clean JSON payload.');
  return llmResponse;
}

module.exports = { polishText };
