export interface NavLink {
  href: string;
  label: string;
}

export const navigationLinks: NavLink[] = [
  { href: '/', label: 'HOME' },
  { href: '/esim', label: 'eSIM CONNECTIVITY' },
  { href: '/reputation', label: 'LOCAL AUTHORITY' },
  { href: '/solutions', label: 'SAAS SUITE' },
  { href: '/blog', label: 'INTELLIGENCE' },
];

export const footerLinks = {
  product: [
    { href: '/esim', label: 'Global eSIM Plans' },
    { href: '/reputation', label: 'Reputation Gating' },
    { href: '/solutions', label: 'CRM & Automation' },
    { href: '/blog', label: 'Intelligence Feed' },
  ],
  company: [
    { href: '/privacy', label: 'Privacy Perimeter' },
    { href: '/terms', label: 'Terms of Authority' },
  ],
};
