export function FileGridSkeleton() {
  return (
    <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse" />
  );
}

export function FileGridSkeletonGroup({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <FileGridSkeleton key={i} />
      ))}
    </div>
  );
}
