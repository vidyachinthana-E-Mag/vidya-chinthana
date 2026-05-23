import React from "react";

export default function ArticleCardSkeleton({ featured = false }: { featured?: boolean }) {
  if (featured) {
    return (
      <div className="premium-card overflow-hidden grid md:grid-cols-2 gap-0 skeleton-shimmer" aria-hidden>
        <div className="aspect-[4/3] md:min-h-[320px] bg-black/[0.06] dark:bg-white/[0.06]" />
        <div className="p-8 sm:p-10 space-y-4">
          <div className="skeleton-line w-24 h-3" />
          <div className="skeleton-line w-full h-8" />
          <div className="skeleton-line w-4/5 h-8" />
          <div className="skeleton-line w-full h-4 mt-4" />
          <div className="skeleton-line w-3/4 h-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="premium-card overflow-hidden skeleton-shimmer" aria-hidden>
      <div className="aspect-[16/10] bg-black/[0.06] dark:bg-white/[0.06]" />
      <div className="p-5 sm:p-6 space-y-3">
        <div className="skeleton-line w-16 h-3" />
        <div className="skeleton-line w-full h-6" />
        <div className="skeleton-line w-full h-4" />
        <div className="skeleton-line w-2/3 h-4" />
      </div>
    </div>
  );
}

export function ArticleGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          <ArticleCardSkeleton featured={i === 0} />
        </div>
      ))}
    </div>
  );
}
