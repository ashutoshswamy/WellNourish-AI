// Shown instantly on navigation while a dynamic page renders on the server.
export default function Loading() {
  return (
    <div className="flex-1 py-10 md:py-14" role="status" aria-label="Loading">
      <div className="h-10 w-64 max-w-full rounded-xl bg-sunken motion-safe:animate-pulse" />
      <div className="mt-3 h-5 w-80 max-w-full rounded-lg bg-sunken motion-safe:animate-pulse" />
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="h-72 rounded-2xl bg-sunken motion-safe:animate-pulse lg:col-span-2" />
        <div className="h-72 rounded-2xl bg-sunken motion-safe:animate-pulse" />
      </div>
    </div>
  );
}
