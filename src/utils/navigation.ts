export interface NavLink {
  href: string;
  label: string;
}

export const navigationLinks: NavLink[] = [
  { href: '/', label: 'HOME' },
  { href: '/esim/united-states', label: 'eSIM CONNECTIVITY' },
  { href: '/reputation/new-york', label: 'LOCAL AUTHORITY' },
  { href: '/solutions/crm-system', label: 'SAAS SUITE' },
  { href: '/blog', label: 'INTELLIGENCE' },
];

export const footerLinks = {
  product: [
    { href: '/esim/united-states', label: 'Global eSIM Plans' },
    { href: '/reputation/new-york', label: 'Reputation Gating' },
    { href: '/solutions/crm-system', label: 'CRM & Automation' },
    { href: '/blog', label: 'Intelligence Feed' },
  ],
  company: [
    { href: '/privacy', label: 'Privacy Perimeter' },
    { href: '/terms', label: 'Terms of Authority' },
  ],
};
