'use client';

import { useState } from 'react';
import Link from 'next/link';
import SearchInput from '@/components/ui/SearchInput';
import { SETTINGS_SECTIONS } from '@/lib/settingsNav';

// Category cards with their links; the search box narrows both the links and the cards.
export default function SettingsHub() {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const sections = SETTINGS_SECTIONS.map((section) => ({
    ...section,
    links: section.links.filter(
      (l) => !q || `${l.label} ${l.description} ${l.keywords}`.toLowerCase().includes(q)
    ),
  })).filter((section) => section.links.length > 0);

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="flex items-center gap-5 flex-wrap mb-6">
        <h2 className="text-2xl font-serif font-semibold text-ink">Settings</h2>
        <SearchInput value={query} onChange={setQuery} placeholder="Search settings…" className="w-full max-w-md" />
      </div>

      {sections.length === 0 ? (
        <p className="text-sm text-brown/50 py-10 text-center">No settings match &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-start">
          {sections.map(({ id, title, icon: Icon, links }) => (
            <section key={id} className="bg-white rounded-2xl border border-tan/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-blush rounded-lg flex items-center justify-center">
                  <Icon className="w-4.5 h-4.5 text-forest" />
                </div>
                <h3 className="text-base font-serif font-semibold text-ink">{title}</h3>
              </div>
              <ul className="space-y-1 pl-12">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="group block rounded-lg px-2 py-2 -mx-2 hover:bg-cream transition-colors">
                      <span className="block text-sm font-medium text-ink group-hover:text-forest">{l.label}</span>
                      <span className="block text-xs text-brown/50 mt-0.5">{l.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
