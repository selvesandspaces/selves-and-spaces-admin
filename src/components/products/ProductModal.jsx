'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency, formatDate } from '@/lib/utils';
import { parseDetailText } from '@/lib/detailText';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { deleteProductAction } from '@/lib/actions/productActions';

export default function ProductModal({ product, onClose }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  function closeDialog() {
    setConfirming(false);
    setDeleteError(null);
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);
    const res = await deleteProductAction(product.id);
    setDeleting(false);
    if (res.ok) {
      closeDialog();
      onClose(); // the action revalidates the list, so the product disappears from it
    } else {
      setDeleteError(res.error);
    }
  }

  return (
    <>
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Blurred backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal card */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 bg-cream rounded-2xl shadow-2xl w-full max-w-lg max-h-[88vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-tan/30 bg-white/60 shrink-0">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-brown/50 uppercase tracking-wider mb-0.5">Product</p>
                <h2 className="text-lg font-serif font-semibold text-ink leading-tight">
                  {product.title}
                </h2>
              </div>
              <div className="flex items-center gap-1 mt-0.5 shrink-0">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  onClick={onClose}
                  className="p-2 rounded-lg text-brown/50 hover:text-forest hover:bg-blush/60 transition-colors"
                  title="Edit product"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setConfirming(true)}
                  className="p-2 rounded-lg text-brown/40 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete product"
                  aria-label="Delete product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="p-2 rounded-lg text-brown/40 hover:text-ink hover:bg-tan/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* Images */}
              {product.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {product.images.map((img, i) => (
                    <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border border-tan/20 bg-tan/10">
                      <Image
                        src={img.url}
                        alt={`${product.title} image ${i + 1}`}
                        fill
                        sizes="160px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Price */}
              <span className="block text-3xl font-serif font-bold text-forest">
                {formatCurrency(product.amount)}
              </span>

              {/* Description */}
              {product.description && (
                <Section title="Description">
                  <p className="text-sm text-ink/80 leading-relaxed whitespace-pre-line">{product.description}</p>
                </Section>
              )}

              {/* Detail sections */}
              {product.details.map((d) => {
                const { intro, items } = parseDetailText(d.paragraph);
                return (
                  <Section key={d.id} title={d.title}>
                    {d.subtitle && <p className="text-sm font-medium text-ink mb-1">{d.subtitle}</p>}
                    {intro && <p className="text-sm text-ink/80 leading-relaxed whitespace-pre-line">{intro}</p>}
                    {items.length > 0 && (
                      <ul className={`space-y-1.5 ${intro ? 'mt-2' : ''}`}>
                        {items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-ink/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-sage mt-1.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Section>
                );
              })}

              {/* Meta */}
              {product.createdAt && (
                <div className="flex items-center gap-2 text-xs text-brown/40 pt-2 border-t border-tan/20">
                  <Calendar className="w-3.5 h-3.5" />
                  Added {formatDate(product.createdAt)}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    <ConfirmDialog
      open={confirming}
      title={`Delete “${product?.title ?? ''}”?`}
      confirmLabel="Delete product"
      danger
      busy={deleting}
      error={deleteError}
      onConfirm={handleDelete}
      onCancel={closeDialog}
    >
      Its details and images are permanently removed. Past orders keep their record of it.
    </ConfirmDialog>
    </>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <p className="text-xs font-semibold text-brown/50 uppercase tracking-wider mb-2">{title}</p>
      {children}
    </div>
  );
}
