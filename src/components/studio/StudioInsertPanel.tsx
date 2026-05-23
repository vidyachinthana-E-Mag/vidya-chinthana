import { Plus, LayoutGrid, Megaphone, Navigation, Sparkles } from "lucide-react";
import { SiteConfig } from "../../types/site";
import { Page } from "../../context/AppContext";

const HOME_BLOCKS = [
  { id: "announcement", label: "Announcement bar", key: "showAnnouncement" as const },
  { id: "hero", label: "Hero", key: null },
  { id: "stats", label: "Stats row", key: "showStats" as const },
  { id: "continue", label: "Continue reading", key: "showContinueReading" as const },
  { id: "bookmarks", label: "Bookmarks", key: "showBookmarks" as const },
  { id: "issues", label: "Issues sidebar", key: "showIssuesSidebar" as const },
  { id: "articles", label: "Article grid", key: null },
];

const HERO_PRESETS: { id: string; label: string; badgeEn: string; headlineEn: string }[] = [
  {
    id: "science",
    label: "Science editorial",
    badgeEn: "Science · Issue 02",
    headlineEn: "Discovery, decoded.",
  },
  {
    id: "scifi",
    label: "Sci-fi neon",
    badgeEn: "Sci-Fi · Special",
    headlineEn: "Future minds, today.",
  },
  {
    id: "education",
    label: "Education calm",
    badgeEn: "Education",
    headlineEn: "Learning without limits.",
  },
];

const NAV_PAGES: { page: Page; label: string }[] = [
  { page: "home", label: "Home" },
  { page: "issues", label: "Issues" },
  { page: "articles", label: "Articles" },
  { page: "authors", label: "Authors" },
  { page: "about", label: "About" },
  { page: "login", label: "Login" },
];

export default function StudioInsertPanel({
  draft,
  onPatch,
}: {
  draft: SiteConfig;
  onPatch: (fn: (c: SiteConfig) => SiteConfig) => void;
}) {
  const insertBlock = (blockId: string) => {
    onPatch((c) => {
      if (!c.homeSections.order.includes(blockId)) {
        c.homeSections.order = [...c.homeSections.order, blockId];
      }
      const row = HOME_BLOCKS.find((b) => b.id === blockId);
      if (row?.key) (c.homeSections as unknown as Record<string, boolean>)[row.key] = true;
      if (blockId === "announcement") c.announcement.enabled = true;
      return c;
    });
  };

  const applyHeroPreset = (preset: (typeof HERO_PRESETS)[0]) => {
    onPatch((c) => {
      c.hero.badgeEn = preset.badgeEn;
      c.hero.headlineEn = preset.headlineEn;
      if (preset.id === "scifi") {
        c.hero.backgroundStyle = "cybergrid";
        c.effects.neonGlow = true;
        c.effects.gridOverlay = true;
      } else if (preset.id === "education") {
        c.hero.backgroundStyle = "mesh";
        c.effects.neonGlow = false;
      } else {
        c.hero.backgroundStyle = "aurora";
      }
      return c;
    });
  };

  const addNavLink = () => {
    onPatch((c) => {
      c.navItems.push({
        id: `nav-${Date.now()}`,
        page: "articles",
        labelEn: "New link",
        labelSi: "නව සබැඳිය",
        visible: true,
      });
      return c;
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-[10px] text-white/40 leading-relaxed">
        Figma-style <strong className="text-cyan-400/80">Insert</strong> — add home blocks, hero presets, and nav
        links. Publish to push live.
      </p>

      <section>
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-cyan-400/80 mb-3 flex items-center gap-1.5">
          <LayoutGrid className="w-3 h-3" /> Home blocks
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {HOME_BLOCKS.map((b) => {
            const on = draft.homeSections.order.includes(b.id);
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => insertBlock(b.id)}
                className={`p-3 rounded-lg border text-left text-[10px] cursor-pointer transition-colors ${
                  on
                    ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-200"
                    : "border-white/10 hover:border-white/20 text-white/50"
                }`}
              >
                {b.label}
                {on && <span className="block text-[8px] mt-1 opacity-60">on canvas</span>}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-cyan-400/80 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" /> Hero presets
        </h4>
        <div className="space-y-2">
          {HERO_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => applyHeroPreset(p)}
              className="w-full p-2.5 rounded-lg border border-white/10 hover:border-cyan-500/30 text-left text-[10px] cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-cyan-400/80 mb-3 flex items-center gap-1.5">
          <Megaphone className="w-3 h-3" /> Quick banner
        </h4>
        <button
          type="button"
          onClick={() =>
            onPatch((c) => {
              c.announcement.enabled = true;
              if (!c.homeSections.order.includes("announcement")) {
                c.homeSections.order = ["announcement", ...c.homeSections.order];
              }
              return c;
            })
          }
          className="w-full py-2 rounded-lg border border-dashed border-white/20 text-[10px] text-white/50 hover:text-cyan-300 cursor-pointer"
        >
          + Enable announcement bar
        </button>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-cyan-400/80 flex items-center gap-1.5">
            <Navigation className="w-3 h-3" /> Navigation
          </h4>
          <button
            type="button"
            onClick={addNavLink}
            className="p-1 rounded hover:bg-white/10 cursor-pointer text-cyan-400"
            title="Add nav item"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-[9px] text-white/30 mb-2">Pages: {NAV_PAGES.map((n) => n.label).join(", ")}</p>
        <p className="text-[9px] text-white/30">Edit labels in Nav panel → set page id (e.g. login, issues).</p>
      </section>
    </div>
  );
}
