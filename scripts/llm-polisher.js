const DOMPurify = require('isomorphic-dompurify');
const { executeAgnosticAiRefinement } = require('./universal-ai-adapter');
// Register tsx so we can require TypeScript files synchronously
require('tsx/cjs');
const { rewriteContent } = require('../src/lib/agc-rewriter.ts');

/**
 * Text Polishing Engine using multi-key free inference cascade
 * (Gemini -> OpenRouter -> Grok)
 */
async function polishText(rawText, targetPillar) {
  console.log('[LLM-POLISHER] Passing raw text to inference cascade for tactical metadata on pillar:', targetPillar);

  let llmResponse = null;

  try {
    let pillarContext = '';
    if (targetPillar === 'esim_data_plans') {
      pillarContext = 'FOCUS: Emphasize global connectivity, B2B enterprise roaming, and latency reduction solutions.';
    } else if (targetPillar === 'reputation_management') {
      pillarContext = 'FOCUS: Emphasize Google Local Search Authority, review gating, and brand trust automation.';
    } else if (targetPillar === 'ai_business_tools_suite') {
      pillarContext = 'FOCUS: Emphasize document routing, back-office automation, CRM integrations, and operational efficiency.';
    }

    const prompt = `You are an expert B2B SaaS Content Strategist and SEO. Analyze the following raw article text.
DO NOT rewrite the entire article. Instead, act as a tactical enhancer to generate precise metadata and a strong hook.

${pillarContext}

CRITICAL RULES:
1. Professional, human-friendly tone. No generic "AI-slop".
2. NEVER use words like: delve, landscape, tapestry, realm, paradigm, robust, comprehensive, cutting-edge, leverage, seamless.

Return ONLY a raw JSON object with no markdown formatting or code blocks. The JSON must exactly match this structure:
{
  "hook": "A compelling, audience-centric SEO hook (1-2 sentences) that introduces the original content.",
  "metaDesc": "A concise, engaging meta description under 160 characters.",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "socialWidget": "An engaging caption for social media sharing, including relevant hashtags."
}

Raw text to analyze:
${rawText}
`;

    llmResponse = await executeAgnosticAiRefinement(prompt);
  } catch (err) {
    console.error('[LLM-POLISHER] API cascade failed, falling back to basic extraction:', err.message);

    const titleMatch = rawText.match(/Title:\s*(.+)/);
    const contentMatch = rawText.match(/Content:\s*([\s\S]+)/);
    const fallbackTitle = titleMatch ? titleMatch[1].trim() : 'Industry Update';
    let fallbackContent = contentMatch ? contentMatch[1].trim() : 'No content available.';

    llmResponse = {
      hook: `Discover the latest insights on ${fallbackTitle}.`,
      metaDesc: `${fallbackContent.replace(/<[^>]*>?/gm, '').substring(0, 157)}...`,
      tags: ['Industry News', 'Updates'],
      socialWidget: `Read our latest update: ${fallbackTitle} #IndustryNews #Update`
    };
  }

    // Now call the AGC Rewriter to generate paraphrase data
    try {
      const paraphraseData = await rewriteContent(rawText);
      if (paraphraseData) {
        llmResponse.paraphrasedHook = paraphraseData.paraphrasedHook;
        llmResponse.syntacticVariant = paraphraseData.syntacticVariant;
        llmResponse.paraphraseSummary = paraphraseData.paraphraseSummary;
        llmResponse.originalTokenCount = paraphraseData.originalTokenCount;
        llmResponse.newTokenCount = paraphraseData.newTokenCount;
      }
    } catch (rewriteErr) {
      console.warn('[LLM-POLISHER] AGC Rewriting pipeline failed. Skipping paraphrase merging.', rewriteErr.message);
    }

  console.log('[LLM-POLISHER] Polishing complete. Returning tactical JSON payload.');
  return llmResponse;
}

module.exports = { polishText };
