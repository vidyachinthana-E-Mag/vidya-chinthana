import React from "react";
import Reveal from "../motion/Reveal";

export default function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-12 sm:mb-16 pt-4 sm:pt-8">
      <Reveal>
        {eyebrow && <p className="vc-section-label mb-3">{eyebrow}</p>}
        <h1 className="font-display vc-hero-title text-left max-w-none text-3xl sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </Reveal>
    </header>
  );
}
