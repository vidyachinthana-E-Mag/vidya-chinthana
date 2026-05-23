import React from "react";

export default function AdminShell({
  title,
  subtitle,
  version,
  onBack,
  sidebar,
  children,
}: {
  title: string;
  subtitle: string;
  version?: number;
  onBack: () => void;
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#060608] text-[#f0f0f5] flex flex-col admin-shell">
      <header className="h-14 shrink-0 border-b border-white/[0.06] flex items-center justify-between px-4 sm:px-6 bg-gradient-to-r from-[#0a0a12] to-[#0e0e18]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <p className="text-sm font-bold tracking-wide">{title}</p>
            <p className="text-[10px] text-white/35">{subtitle}</p>
          </div>
        </div>
        {version != null && (
          <span className="text-[10px] font-mono px-2 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            v{version}
          </span>
        )}
      </header>
      <div className="flex-1 flex min-h-0">
        <aside className="w-56 shrink-0 border-r border-white/[0.06] bg-[#08080e] hidden lg:flex flex-col p-3">
          {sidebar}
        </aside>
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 admin-main">{children}</main>
      </div>
    </div>
  );
}
