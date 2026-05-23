import React from "react";
import { useApp } from "../../context/AppContext";
import { t } from "../../lib/labels";
import {
  FileText,
  Layers,
  Users,
  Palette,
  Settings,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import AdminQualityPanel from "./AdminQualityPanel";

export default function AdminOverviewPanel({
  onTab,
}: {
  onTab: (tab: "settings" | "design" | "users" | "system" | "content") => void;
}) {
  const { lang, stats, siteConfig, articles, drafts, user } = useApp();
  const f = siteConfig.admin.features;

  const cards = [
    { icon: FileText, label: t(lang, "Published", "ප්‍රකාශිත"), val: stats?.articles ?? 0 },
    { icon: BookOpen, label: t(lang, "Drafts", "කෙටුම්පත්"), val: stats?.drafts ?? 0 },
    { icon: Layers, label: t(lang, "Issues", "කලාප"), val: stats?.issues ?? 0 },
    { icon: Users, label: t(lang, "Glossary", "පද"), val: stats?.glossary ?? 0 },
  ];

  const actions = [
    { id: "content" as const, icon: Layers, en: "Content manager", si: "අන්තර්ගත කළමනාකරු", desc: "Add, edit, delete" },
    { id: "design" as const, icon: Palette, en: "Design Studio", si: "Design Studio", desc: "Colors, hero, layout" },
    { id: "settings" as const, icon: Settings, en: "Site settings", si: "සයිට් සැකසුම්", desc: "SEO, features, analytics" },
    { id: "users" as const, icon: Users, en: "Users & roles", si: "පරිශීලකයින්", desc: "Role management" },
    { id: "system" as const, icon: Layers, en: "System", si: "පද්ධතිය", desc: "Export / import / reset" },
  ];

  return (
    <div className="space-y-8">
      {f.maintenanceMode && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          {t(lang, "Maintenance mode is ON for public visitors.", "ප්‍රධාන පිටු maintenance mode එකේ.")}
        </div>
      )}

      <p className="text-sm text-white/50">
        {t(lang, `Welcome, ${user?.name}. Command center for Vidya Chinthana.`, `සාදරයෙන්, ${user?.name}. විද්‍යා චින්තන command center.`)}
      </p>

      <AdminQualityPanel />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map(({ icon: Icon, label, val }) => (
          <div key={label} className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02]">
            <Icon className="w-4 h-4 text-cyan-400 mb-2" />
            <p className="text-2xl font-bold">{val}</p>
            <p className="text-[10px] uppercase text-white/40 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-white/30">
        {articles.length} live · {drafts.length} in CMS pipeline
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {actions.map(({ id, icon: Icon, en, si, desc }) => (
          <button
            key={id}
            type="button"
            onClick={() => onTab(id)}
            className="text-left p-5 rounded-xl border border-white/[0.08] hover:border-cyan-500/30 hover:bg-cyan-500/5 cursor-pointer transition-all group"
          >
            <Icon className="w-5 h-5 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-sm">{t(lang, en, si)}</p>
            <p className="text-[11px] text-white/40 mt-1">{desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
