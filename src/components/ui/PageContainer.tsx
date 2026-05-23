import React from "react";

export default function PageContainer({
  children,
  className = "",
  wide = false,
}: {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`mx-auto px-4 sm:px-6 ${wide ? "max-w-7xl" : "max-w-6xl"} ${className}`}
    >
      {children}
    </div>
  );
}
