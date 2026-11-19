import { UserCog, ShieldCheck, Users } from 'lucide-react';

// The Settings hub is a grid of category cards; each link opens its own page.
// `keywords` only feed the hub's search box.
export const SETTINGS_SECTIONS = [
  {
    id: 'general',
    title: 'General',
    icon: UserCog,
    links: [
      { href: '/admin/settings/profile', label: 'Profile', description: 'Your name, phone and address', keywords: 'personal account details contact' },
      { href: '/admin/settings/email', label: 'Email', description: 'The address you sign in with', keywords: 'login sign in address change' },
    ],
  },
  {
    id: 'security',
    title: 'Security Control',
    icon: ShieldCheck,
    links: [
      { href: '/admin/settings/password', label: 'Password', description: 'Change your password', keywords: 'security credentials reset change' },
    ],
  },
  {
    id: 'people',
    title: 'User Management',
    icon: Users,
    links: [
      { href: '/admin/settings/users', label: 'Users', description: 'View accounts, deactivate or reactivate them', keywords: 'accounts customers admins roles access deactivate activate' },
    ],
  },
];
