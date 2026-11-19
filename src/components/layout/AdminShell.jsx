'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/hooks/useSidebar';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const TITLES = {
  '/admin/clients': 'Clients',
  '/admin/orders': 'Orders',
  '/admin/products': 'Products',
  '/admin/settings': 'Settings',
  '/admin': 'Dashboard',
};

function getTitle(pathname) {
  const sorted = Object.keys(TITLES).sort((a, b) => b.length - a.length);
  const match = sorted.find((path) => pathname.startsWith(path));
  return match ? TITLES[match] : 'Admin';
}

export default function AdminShell({ children, user, initialCollapsed }) {
  const { collapsed, toggle } = useSidebar(initialCollapsed);
  const pathname = usePathname();
  const title = getTitle(pathname);
  // Keyed by section (/admin/orders), so moving between orders doesn't remount the split-view list.
  const section = pathname.split('/').slice(0, 3).join('/');

  return (
    <div className="flex h-screen overflow-hidden bg-cream">
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar title={title} user={user} onMenuToggle={toggle} />
        <main className="flex-1 overflow-auto">
          {/* Enter-only fade. An exit animation (AnimatePresence) keeps the old page mounted against
              the new route's state in the App Router, and an interrupted exit can leave a blank page. */}
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
