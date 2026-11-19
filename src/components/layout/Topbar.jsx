'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import Avatar from '@/components/ui/Avatar';

export default function Topbar({ title, user, onMenuToggle }) {
  return (
    <header className="h-14 bg-cream/80 backdrop-blur-sm border-b border-tan/30 flex items-center px-5 gap-4 flex-shrink-0 z-10">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-1.5 rounded-lg text-ink/60 hover:text-ink hover:bg-blush transition-colors"
        aria-label="Toggle menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <h1 className="text-sm font-semibold text-ink/80 tracking-wide">
        {title}
      </h1>

      <div className="flex-1" />

      {/* User info */}
      <Link
        href="/admin/settings"
        aria-label="Account settings"
        className="flex items-center gap-2.5 rounded-lg p-1 -m-1 hover:bg-blush/60 transition-colors"
      >
        <Avatar name={user?.name ?? 'Admin'} size="sm" />
        <div className="hidden sm:block">
          <p className="text-xs font-medium text-ink leading-tight">{user?.name}</p>
          <p className="text-xs text-brown/50 capitalize leading-tight">{user?.role}</p>
        </div>
      </Link>
    </header>
  );
}
