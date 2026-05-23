import { lazy, Suspense } from "react";
import AntigravityCanvas from "./AntigravityCanvas";
import type { SciFi3DVariant } from "./SciFiHero3DScene";

const SciFiHero3DScene = lazy(() => import("./SciFiHero3DScene"));

export type { SciFi3DVariant };

/** Lazy WebGL hero — falls back to Canvas 2D particles while loading or on error boundary */
export default function SciFiHero3D({
  variant = "hero",
  className = "",
  intensity = 1,
  accent,
  fallbackIntensity,
}: {
  variant?: SciFi3DVariant;
  className?: string;
  intensity?: number;
  accent?: string;
  /** AntigravityCanvas intensity used as Suspense fallback */
  fallbackIntensity?: number;
}) {
  const fi = fallbackIntensity ?? intensity;

  return (
    <Suspense
      fallback={<AntigravityCanvas className={className} intensity={fi} accent={accent} />}
    >
      <SciFiHero3DScene
        variant={variant}
        className={className}
        intensity={intensity}
        accent={accent}
      />
    </Suspense>
  );
}
