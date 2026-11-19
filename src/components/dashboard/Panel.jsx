import Link from 'next/link';

// A titled card with a list of rows, an optional "View all" link and an empty state.
export default function Panel({ title, href, empty, children }) {
  const hasRows = Array.isArray(children) ? children.length > 0 : !!children;
  return (
    <div className="bg-white rounded-xl border border-tan/30 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-tan/20">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        {href && (
          <Link href={href} className="text-xs text-moss hover:text-forest font-medium transition-colors">
            View all →
          </Link>
        )}
      </div>
      {hasRows ? children : <p className="text-center text-sm text-brown/40 py-8">{empty}</p>}
    </div>
  );
}
