// Shown inside the admin shell while a page fetches its data, so a click gets instant feedback
// instead of the old page lingering until the new one is ready.
export default function AdminLoading() {
  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto animate-pulse" aria-busy="true" aria-label="Loading">
      <div className="space-y-2">
        <div className="h-6 w-40 bg-tan/30 rounded" />
        <div className="h-4 w-64 bg-tan/20 rounded" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-28 bg-white/70 border border-tan/30 rounded-xl" />
        ))}
      </div>
      <div className="h-72 bg-white/70 border border-tan/30 rounded-xl" />
    </div>
  );
}
