import React, { useState } from "react";
import { coverGradientStyle, isPlaceholderImage } from "../../lib/imageFallback";

type CoverImageProps = {
  src: string;
  alt: string;
  seed?: string;
  className?: string;
  wrapperClassName?: string;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
};

export default function CoverImage({
  src,
  alt,
  seed,
  className = "",
  wrapperClassName = "",
  loading = "lazy",
  fetchPriority,
}: CoverImageProps) {
  const [failed, setFailed] = useState(false);
  const key = seed || src || alt;
  const showGradient = !src || failed || isPlaceholderImage(src);

  if (showGradient) {
    return (
      <div
        className={`w-full h-full ${wrapperClassName}`}
        style={coverGradientStyle(key)}
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
      />
    );
  }

  const webpSrc =
    src.includes("picsum.photos") && !src.includes(".webp")
      ? `${src}${src.includes("?") ? "&" : "?"}format=webp`
      : src;

  return (
    <picture>
      {webpSrc !== src && (
        <source srcSet={webpSrc} type="image/webp" />
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    </picture>
  );
}
