import { cn } from '@/lib/utils';

// Labelled text input with an inline error, used by the settings forms.
export default function Field({ label, id, error, hint, className, ...inputProps }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-ink/70 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(
          'w-full px-4 py-2.5 text-sm bg-white border rounded-lg text-gray-900 placeholder:text-brown/40',
          'focus:outline-none focus:ring-2 transition-all',
          error
            ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
            : 'border-tan/60 focus:ring-sage/40 focus:border-sage',
          className
        )}
        {...inputProps}
      />
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-500 mt-1">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-brown/40 mt-1">{hint}</p>
      ) : null}
    </div>
  );
}
