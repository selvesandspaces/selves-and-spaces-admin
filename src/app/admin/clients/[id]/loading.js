// Shown in the detail pane while a client loads; the list on the left stays put.
export default function ClientDetailLoading() {
  return (
    <div className="flex-1 px-8 pt-8 space-y-5 animate-pulse" aria-busy="true" aria-label="Loading client">
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-tan/30" />
        <div className="space-y-2">
          <div className="h-6 w-48 bg-tan/30 rounded" />
          <div className="h-4 w-32 bg-tan/20 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-40 bg-white/70 border border-tan/30 rounded-xl" />
        <div className="h-40 bg-white/70 border border-tan/30 rounded-xl" />
      </div>
    </div>
  );
}
