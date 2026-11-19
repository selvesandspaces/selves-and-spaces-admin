import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Shared top of every settings sub-page: a way back to the hub, then the title.
export default function SettingsPageHeader({ title, description }) {
  return (
    <div className="mb-6">
      <Link
        href="/admin/settings"
        className="inline-flex items-center gap-1.5 text-sm text-brown/60 hover:text-forest transition-colors mb-3"
      >
        <ArrowLeft className="w-4 h-4" />
        Settings
      </Link>
      <h2 className="text-xl font-serif font-semibold text-ink">{title}</h2>
      {description && <p className="text-sm text-brown/60 mt-0.5">{description}</p>}
    </div>
  );
}
