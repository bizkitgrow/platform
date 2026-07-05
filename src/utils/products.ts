export interface ProductMetadata {
  sku: string;
  pillar: 'connectivity' | 'reputation' | 'intelligence' | 'solutions';
  title: string;
  subtitle: string;
  description: string; // Supports flat HTML strings for bullet points
  actionLabel: string;
  href: string;
}

export const PRODUCTS_CATALOG: Record<string, ProductMetadata> = {
  // Connectivity Pillar
  vpn: {
    sku: 'vpn',
    pillar: 'connectivity',
    title: 'Stop leaking sensitive business data over unsecured networks.',
    subtitle:
      'Secure your entire operational perimeter with our Dedicated Business VPN. Protect client files, encrypt local company connections, and prevent costly data breaches.',
    description:
      '<ul><li>Zero configuration required.</li><li>Deployed instantly on Vercel Edge networks.</li><li>Cryptographic encryption and Zero-Log Policy.</li></ul>',
    actionLabel: 'Get Dedicated VPN Access',
    href: '/solutions/global-vpn-infrastructure',
  },
  esim_data_plans: {
    sku: 'esim_data_plans',
    pillar: 'connectivity',
    title: 'Stay connected anywhere without exorbitant roaming fees.',
    subtitle:
      'Deploy instant international data connectivity for business travelers and remote teams across 190+ countries.',
    description:
      '<ul><li>Eliminate physical SIM logistics.</li><li>Instant activation via QR code.</li><li>No hidden roaming charges.</li></ul>',
    actionLabel: 'Configure Your eSIM',
    href: '/esim/united-states',
  },
  // Reputation Pillar
  reputation_management: {
    sku: 'reputation_management',
    pillar: 'reputation',
    title: 'Stop losing clients to competitors with better reviews.',
    subtitle:
      'Automate 5-star Google review generation and privately intercept negative feedback before it goes public.',
    description:
      '<ul><li>Automated follow-up sequences.</li><li>Intelligent review gating.</li><li>Boost your local SEO ranking.</li></ul>',
    actionLabel: 'Activate Reputation Engine',
    href: '/reputation',
  },
  local_leads: {
    sku: 'local_leads',
    pillar: 'reputation',
    title: 'Fill your sales pipeline with high-intent local prospects.',
    subtitle:
      'Our discovery engine parses local business data to find companies needing your services, generating a constant pipeline of fresh prospects.',
    description:
      '<ul><li>Automated contact enrichment.</li><li>Direct pipeline injection.</li><li>Save hours of manual prospecting.</li></ul>',
    actionLabel: 'Find Local Leads',
    href: '/reputation',
  },
  // Intelligence Pillar
  competitor_spy: {
    sku: 'competitor_spy',
    pillar: 'intelligence',
    title: 'Reverse-engineer your competitors’ most profitable acquisition channels.',
    subtitle:
      'Deconstruct your competitors’ traffic, keywords, and advertising strategies to stop guessing what works.',
    description:
      '<ul><li>Discover hidden traffic sources.</li><li>Analyze profitable keywords.</li><li>Uncover advertising intelligence.</li></ul>',
    actionLabel: 'Analyze Competitors',
    href: '/blog',
  },
  market_metrics: {
    sku: 'market_metrics',
    pillar: 'intelligence',
    title: 'Make strategic decisions with institutional-grade market metrics.',
    subtitle:
      'Access real-time data feeds for crypto, stocks, and macro events to time your business expansion accurately.',
    description:
      '<ul><li>Real-time market feeds.</li><li>Macro event tracking.</li><li>Customizable dashboards.</li></ul>',
    actionLabel: 'Access Market Data',
    href: '/blog',
  },
  // Solutions Pillar
  web_hosting: {
    sku: 'web_hosting',
    pillar: 'solutions',
    title: 'Prevent high bounce rates caused by slow website loading.',
    subtitle:
      'Consolidate your digital assets onto ultra-fast NVMe SSD infrastructure optimized for WordPress and enterprise scale.',
    description:
      '<ul><li>Blazing fast NVMe SSD storage.</li><li>Automated daily backups.</li><li>Enterprise-grade DDoS protection.</li></ul>',
    actionLabel: 'Deploy Managed Hosting',
    href: '/solutions/cpanel-managed-hosting',
  },
  cloud_storage: {
    sku: 'cloud_storage',
    pillar: 'solutions',
    title: 'Protect your operations from critical data loss.',
    subtitle:
      'Ensure rapid disaster recovery with decentralized, encrypted file sharing and automated daily backups.',
    description:
      '<ul><li>End-to-end encryption.</li><li>Automated folder sync.</li><li>Granular access controls.</li></ul>',
    actionLabel: 'Secure Cloud Storage',
    href: '/solutions/secure-cloud-storage',
  },
  invoice_ai: {
    sku: 'invoice_ai',
    pillar: 'solutions',
    title: 'Decrease Days Sales Outstanding (DSO) for healthier margins.',
    subtitle:
      'Automate ledger generation and payment reminders to eliminate administrative friction that delays cash flow.',
    description:
      '<ul><li>Autonomous invoice generation.</li><li>Smart payment follow-ups.</li><li>Seamless Stripe/PayPal integration.</li></ul>',
    actionLabel: 'Automate Invoicing',
    href: '/solutions/invoicing-with-ai',
  },
};

export function getProductBySku(sku: string): ProductMetadata | undefined {
  return PRODUCTS_CATALOG[sku];
}

export function getProductsByPillar(pillar: string): ProductMetadata[] {
  return Object.values(PRODUCTS_CATALOG).filter((p) => p.pillar === pillar);
}
