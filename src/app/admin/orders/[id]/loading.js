// Shown in the detail pane while an order loads; the list on the left stays put.
export default function OrderDetailLoading() {
  return (
    <div className="flex-1 px-8 pt-8 space-y-5 animate-pulse" aria-busy="true" aria-label="Loading order">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-6 w-32 bg-tan/30 rounded" />
          <div className="h-4 w-48 bg-tan/20 rounded" />
        </div>
        <div className="h-8 w-28 bg-tan/30 rounded" />
      </div>
      <div className="h-32 bg-white/70 border border-tan/30 rounded-xl" />
      <div className="h-48 bg-white/70 border border-tan/30 rounded-xl" />
    </div>
  );
}
