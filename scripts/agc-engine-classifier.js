/**
 * Deterministic Content Classifier
 * Maps article content → product key → internal route
 * No hardcoded brand names — all routing through config
 */

const CLASSIFICATION_RULES = [
  {
    keywords: [
      'esim',
      'e-sim',
      'sim card',
      'roaming',
      'international data',
      'global connectivity',
      'cellular',
      '5g roaming',
    ],
    key: 'esim_data_plans',
    route: '/esim',
  },
  {
    keywords: [
      'vpn',
      'proxy',
      'cybersecurity',
      'encryption',
      'secure network',
      'zero trust',
      'firewall',
    ],
    key: 'esim_data_plans',
    route: '/esim',
  },
  {
    keywords: [
      'google business',
      'gmb',
      'google maps',
      'review',
      'reputation',
      'local seo',
      'local search',
      'local listing',
      'nap citation',
    ],
    key: 'reputation_management',
    route: '/reputation',
  },
  {
    keywords: [
      'seo',
      'backlink',
      'serp',
      'search engine',
      'organic traffic',
      'keyword rank',
      'technical seo',
    ],
    key: 'reputation_management',
    route: '/reputation',
  },
  {
    keywords: [
      'crm',
      'customer relationship',
      'client management',
      'sales pipeline',
      'lead nurture',
      'hubspot',
      'salesforce',
    ],
    key: 'ai_business_tools_suite',
    route: '/solutions/crm-system',
  },
  {
    keywords: ['invoice', 'billing', 'payment gateway', 'accounts receivable', 'stripe', 'payroll'],
    key: 'ai_business_tools_suite',
    route: '/solutions',
  },
  {
    keywords: [
      'ai tool',
      'automation',
      'workflow',
      'saas',
      'machine learning',
      'llm',
      'generative ai',
      'openai',
      'anthropic',
      'gemini',
      'gpt',
    ],
    key: 'ai_business_tools_suite',
    route: '/solutions',
  },
  {
    keywords: [
      'nvda',
      'nvidia',
      'msft',
      'microsoft',
      'googl',
      'alphabet',
      'aapl',
      'apple',
      'market',
      'stock',
      'earnings',
      'tech sector',
    ],
    key: 'ai_business_tools_suite',
    route: '/solutions',
  },
];

/**
 * @param {string} title
 * @param {string} content
 * @returns {{ key: string, route: string, confidence: number }}
 */
function classifyContent(title, content) {
  const text = `${title} ${content}`.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const rule of CLASSIFICATION_RULES) {
    const score = rule.keywords.filter((kw) => text.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = rule;
    }
  }

  if (!bestMatch || bestScore === 0) {
    return { key: 'ai_business_tools_suite', route: '/solutions', confidence: 0 };
  }

  return { key: bestMatch.key, route: bestMatch.route, confidence: bestScore };
}

module.exports = { classifyContent };
