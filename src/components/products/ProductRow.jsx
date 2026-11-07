import Image from 'next/image';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

export default function ProductRow({ product, selected, onSelect }) {
  const thumb = product.images[0]?.url;

  return (
    <tr
      onClick={onSelect}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(); } }}
      aria-selected={selected}
      className={cn(
        'border-b border-tan/10 cursor-pointer transition-colors',
        selected ? 'bg-blush/40' : 'hover:bg-cream/50'
      )}
    >
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          {thumb ? (
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-tan/20 bg-tan/10 shrink-0">
              <Image src={thumb} alt={product.title} fill sizes="40px" className="object-cover" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-tan/20 shrink-0" />
          )}
          <div>
            <p className="text-sm font-medium text-ink">{product.title}</p>
            <p className="text-xs text-brown/50 mt-0.5 line-clamp-1">{product.description}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5 text-sm font-semibold text-forest">
        {formatCurrency(product.amount)}
      </td>
      <td className="px-5 py-3.5 text-sm text-brown/70">{product.images.length}</td>
      <td className="px-5 py-3.5 text-sm text-brown/70">{product.details.length}</td>
      <td className="px-5 py-3.5 text-sm text-brown/60">{formatDate(product.createdAt)}</td>
    </tr>
  );
}
