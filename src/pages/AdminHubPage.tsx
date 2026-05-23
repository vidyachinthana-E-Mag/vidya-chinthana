import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { SiteConfig } from "../types/site";
import { applySiteTheme } from "../lib/applyTheme";
import { applySiteAdmin } from "../lib/applySiteAdmin";
import WorldStudio from "../components/studio/WorldStudio";
import AdminOverviewPanel from "../components/admin/AdminOverviewPanel";
import AdminSettingsPanel from "../components/admin/AdminSettingsPanel";
import AdminUsersPanel from "../components/admin/AdminUsersPanel";
import AdminSystemPanel from "../components/admin/AdminSystemPanel";
import AdminContentPanel from "../components/admin/AdminContentPanel";
import AdminShell from "../components/admin/AdminShell";
import {
  LayoutDashboard,
  Settings,
  Palette,
  Users,
  Server,
  Database,
  Search,
} from "lucide-react";

type AdminTab = "overview" | "content" | "settings" | "design" | "users" | "system";

const TABS: { id: AdminTab; icon: React.ReactNode; label: string; desc: string }[] = [
  { id: "overview", icon: <LayoutDashboard className="w-4 h-4" />, label: "Overview", desc: "Dashboard" },
  { id: "content", icon: <Database className="w-4 h-4" />, label: "Content", desc: "CRUD manager" },
  { id: "settings", icon: <Settings className="w-4 h-4" />, label: "Settings", desc: "SEO & platform" },
  { id: "design", icon: <Palette className="w-4 h-4" />, label: "Design", desc: "Visual studio" },
  { id: "users", icon: <Users className="w-4 h-4" />, label: "Users", desc: "Roles" },
  { id: "system", icon: <Server className="w-4 h-4" />, label: "System", desc: "Backup" },
];

export default function AdminHubPage() {
  const { user, siteConfig, setSiteConfigDraft, setPage, lang } = useApp();
  const [tab, setTab] = useState<AdminTab>("overview");
  const [draft, setDraft] = useState<SiteConfig>(() => structuredClone(siteConfig));
  const [search, setSearch] = useState("");

  if (!user || user.role !== "owner") {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4 bg-[#060608] text-white">
        <p className="text-white/50">Owner access only.</p>
        <button type="button" onClick={() => setPage("home")} className="mt-4 px-6 py-2 rounded-lg bg-cyan-400 text-black font-bold cursor-pointer">
          Home
        </button>
      </div>
    );
  }

  if (tab === "design") {
    return <WorldStudio embedded onExit={() => setTab("overview")} />;
  }

  const patchDraft = (next: SiteConfig) => {
    setDraft(next);
    setSiteConfigDraft(next);
    applySiteTheme(next);
    applySiteAdmin(next, lang);
  };

  const filteredTabs = TABS.filter(
    (t) =>
      !search ||
      t.label.toLowerCase().includes(search.toLowerCase()) ||
      t.desc.toLowerCase().includes(search.toLowerCase())
  );

  const sidebar = (
    <>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search panels..."
          className="studio-input w-full pl-9 py-2 text-xs"
        />
      </div>
      <nav className="space-y-1 flex-1">
        {(search ? filteredTabs : TABS).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all ${
              tab === t.id
                ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/20"
                : "text-white/45 hover:bg-white/5 hover:text-white/80"
            }`}
          >
            {t.icon}
            <div>
              <p className="text-sm font-medium leading-none">{t.label}</p>
              <p className="text-[9px] text-white/30 mt-1">{t.desc}</p>
            </div>
          </button>
        ))}
      </nav>
      <p className="text-[9px] text-white/25 mt-4 pt-4 border-t border-white/[0.06]">
        Publish from Settings or Design Studio to go live.
      </p>
    </>
  );

  return (
    <AdminShell
      title="COMMAND CENTER"
      subtitle={`Vidya Chinthana · ${user.name}`}
      version={draft.version}
      onBack={() => setPage("dashboard")}
      sidebar={sidebar}
    >
      <div className="lg:hidden flex gap-1 overflow-x-auto mb-6 pb-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs cursor-pointer ${
              tab === t.id ? "bg-cyan-500/25 text-cyan-300" : "text-white/40"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <AdminOverviewPanel onTab={setTab} />
      )}
      {tab === "content" && (
        <AdminContentPanel draft={draft} onSiteChange={(next) => { patchDraft(next); setDraft(next); }} />
      )}
      {tab === "settings" && (
        <AdminSettingsPanel
          draft={draft}
          onChange={(next) => {
            patchDraft(next);
            setDraft(next);
          }}
        />
      )}
      {tab === "users" && <AdminUsersPanel />}
      {tab === "system" && (
        <AdminSystemPanel draft={draft} onImport={(cfg) => patchDraft(cfg)} />
      )}
    </AdminShell>
  );
}
