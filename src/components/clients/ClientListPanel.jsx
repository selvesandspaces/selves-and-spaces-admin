'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import SearchInput from '@/components/ui/SearchInput';
import ClientRow from './ClientRow';
import { useSearch } from '@/hooks/useSearch';
import { cn } from '@/lib/utils';

const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];
const SEARCH_KEYS = ['name', 'email', 'phone'];

export default function ClientListPanel({ clients }) {
  const selectedId = useParams().id ?? null;
  const [statusFilter, setStatusFilter] = useState('all');
  const { query, setQuery, filtered: searched } = useSearch(clients, SEARCH_KEYS);

  const filtered =
    statusFilter === 'all' ? searched : searched.filter((c) => c.status === statusFilter);

  return (
    <div className="w-80 flex-shrink-0 border-r border-tan/30 bg-white/60 flex flex-col h-full">
      <div className="px-4 pt-5 pb-3 border-b border-tan/20">
        <h2 className="text-sm font-semibold text-ink mb-3">
          Clients{' '}
          <span className="ml-1 text-xs font-normal text-brown/50">({clients.length})</span>
        </h2>
        <SearchInput value={query} onChange={setQuery} placeholder="Search clients…" />

        <div className="flex gap-1.5 mt-3 flex-wrap">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              aria-pressed={statusFilter === s.value}
              className={cn(
                'px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors',
                statusFilter === s.value
                  ? 'bg-forest text-cream'
                  : 'bg-tan/20 text-brown hover:bg-tan/40'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-brown/40">
            {clients.length === 0 ? 'No clients yet.' : 'No clients match your filters.'}
          </div>
        ) : (
          filtered.map((client) => (
            <ClientRow key={client.id} client={client} isActive={client.id === selectedId} />
          ))
        )}
      </div>
    </div>
  );
}
