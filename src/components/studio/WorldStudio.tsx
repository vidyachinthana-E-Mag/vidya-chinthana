import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";
import { SiteConfig, HeroBackground } from "../../types/site";
import { THEME_PRESETS, mergePresetIntoConfig } from "../../lib/scifiPresets";
import { applySiteTheme } from "../../lib/applyTheme";
import SitePreview from "./SitePreview";
import {
  ArrowLeft,
  Save,
  RotateCcw,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Monitor,
  Tablet,
  Smartphone,
  Layers,
  Palette,
  Sparkles,
  Layout,
  Navigation,
  FileText,
  Eye,
  Zap,
  GripVertical,
  ChevronRight,
  Image,
  Command,
  FolderOpen,
  HelpCircle,
  Plus,
  Search,
  ExternalLink,
} from "lucide-react";
import StudioInsertPanel from "./StudioInsertPanel";
import StudioPageBuilder from "./StudioPageBuilder";
import StudioFooterPanel from "./StudioFooterPanel";
import { motion, Reorder } from "motion/react";
import StudioCommandPalette, { StudioCommand } from "./StudioCommandPalette";
import StudioAssetsPanel from "./StudioAssetsPanel";
import StudioShortcutsHelp from "./StudioShortcutsHelp";
import ImageUploadField from "../ui/ImageUploadField";
import StudioAIPanel from "./StudioAIPanel";
import { Wand2 } from "lucide-react";

type Panel =
  | "brand"
  | "theme"
  | "hero"
  | "home"
  | "nav"
  | "footer"
  | "about"
  | "effects"
  | "media"
  | "assets"
  | "insert"
  | "ai"
  | "pages";

type MediaField = "logoUrl" | "faviconUrl" | "heroImageUrl";

const SECTION_LABELS: Record<string, string> = {
  announcement: "Announcement bar",
  hero: "Hero section",
  stats: "Statistics",
  continue: "Continue reading",
  bookmarks: "Bookmarks",
  issues: "Issues sidebar",
  articles: "Article grid",
};

function StudioField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  key?: React.Key;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-cyan-400/80">
          {label}
        </span>
        {hint && <span className="text-[9px] text-white/25">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function BiInput({
  en,
  si,
  onEn,
  onSi,
  multiline,
}: {
  en: string;
  si: string;
  onEn: (v: string) => void;
  onSi: (v: string) => void;
  multiline?: boolean;
}) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <span className="text-[8px] text-white/30 uppercase mb-1 block">EN</span>
        <Tag
          value={en}
          onChange={(e) => onEn(e.target.value)}
          className="studio-input w-full px-2.5 py-2"
          rows={multiline ? 2 : undefined}
          placeholder="English"
        />
      </div>
      <div>
        <span className="text-[8px] text-white/30 uppercase mb-1 block">SI</span>
        <Tag
          value={si}
          onChange={(e) => onSi(e.target.value)}
          className="studio-input w-full px-2.5 py-2"
          rows={multiline ? 2 : undefined}
          placeholder="සිංහල"
        />
      </div>
    </div>
  );
}

export default function WorldStudio({
  embedded = false,
  onExit,
}: {
  embedded?: boolean;
  onExit?: () => void;
} = {}) {
  const {
    lang,
    user,
    siteConfig: liveConfig,
    setSiteConfigDraft,
    saveSiteConfig,
    resetSiteConfig,
    setPage,
    notify,
  } = useApp();

  const [draft, setDraft] = useState<SiteConfig>(() => structuredClone(liveConfig));
  const [history, setHistory] = useState<SiteConfig[]>(() => [structuredClone(liveConfig)]);
  const [histIdx, setHistIdx] = useState(0);
  const [panel, setPanel] = useState<Panel>("hero");
  const [zoom, setZoom] = useState(85);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [showSave, setShowSave] = useState(false);
  const [saveMode, setSaveMode] = useState<"publish" | "reset">("publish");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [canvasTab, setCanvasTab] = useState<"preview" | "layers">("preview");
  const [commandOpen, setCommandOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [panelSearch, setPanelSearch] = useState("");
  const [mediaFocus, setMediaFocus] = useState<MediaField>("logoUrl");

  const hasUnsaved = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(liveConfig),
    [draft, liveConfig]
  );

  const pushHistory = useCallback((next: SiteConfig) => {
    setHistory((h) => {
      const trimmed = h.slice(0, histIdx + 1);
      return [...trimmed, structuredClone(next)].slice(-40);
    });
    setHistIdx((i) => Math.min(i + 1, 39));
  }, [histIdx]);

  const patch = useCallback(
    (fn: (c: SiteConfig) => SiteConfig) => {
      setDraft((prev) => {
        const next = fn(structuredClone(prev));
        pushHistory(next);
        return next;
      });
    },
    [pushHistory]
  );

  useEffect(() => {
    setSiteConfigDraft(draft);
    applySiteTheme(draft);
  }, [draft, setSiteConfigDraft]);

  const undo = () => {
    if (histIdx <= 0) return;
    const i = histIdx - 1;
    setHistIdx(i);
    const prev = structuredClone(history[i]);
    setDraft(prev);
    setSiteConfigDraft(prev);
    applySiteTheme(prev);
  };

  const redo = () => {
    if (histIdx >= history.length - 1) return;
    const i = histIdx + 1;
    setHistIdx(i);
    const next = structuredClone(history[i]);
    setDraft(next);
    setSiteConfigDraft(next);
    applySiteTheme(next);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
      if (e.key === "Escape") {
        setCommandOpen(false);
        setShortcutsOpen(false);
      }
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        const t = e.target as HTMLElement;
        if (t.tagName !== "INPUT" && t.tagName !== "TEXTAREA") {
          e.preventDefault();
          setShortcutsOpen((v) => !v);
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "y" || (e.shiftKey && e.key.toLowerCase() === "z"))) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const deviceWidth = useMemo(() => {
    if (device === "mobile") return 375;
    if (device === "tablet") return 768;
    return 1100;
  }, [device]);

  const panels: { id: Panel; icon: React.ReactNode; label: string }[] = [
    { id: "pages", icon: <Layers className="w-3.5 h-3.5" />, label: "Pages" },
    { id: "insert", icon: <Plus className="w-3.5 h-3.5" />, label: "Insert" },
    { id: "hero", icon: <Layout className="w-3.5 h-3.5" />, label: "Hero" },
    { id: "theme", icon: <Palette className="w-3.5 h-3.5" />, label: "Theme" },
    { id: "effects", icon: <Zap className="w-3.5 h-3.5" />, label: "FX" },
    { id: "media", icon: <Image className="w-3.5 h-3.5" />, label: "Media" },
    { id: "assets", icon: <FolderOpen className="w-3.5 h-3.5" />, label: "Assets" },
    { id: "ai", icon: <Wand2 className="w-3.5 h-3.5" />, label: "Copilot" },
    { id: "brand", icon: <Sparkles className="w-3.5 h-3.5" />, label: "Brand" },
    { id: "home", icon: <Eye className="w-3.5 h-3.5" />, label: "Layout" },
    { id: "nav", icon: <Navigation className="w-3.5 h-3.5" />, label: "Nav" },
    { id: "footer", icon: <FileText className="w-3.5 h-3.5" />, label: "Footer" },
    { id: "about", icon: <FileText className="w-3.5 h-3.5" />, label: "About" },
  ];

  const filteredPanels = useMemo(
    () =>
      panels.filter((p) =>
        p.label.toLowerCase().includes(panelSearch.toLowerCase())
      ),
    [panels, panelSearch]
  );

  const studioCommands: StudioCommand[] = useMemo(
    () => [
      ...panels.map((p) => ({
        id: `panel-${p.id}`,
        label: `Open ${p.label} panel`,
        group: "Panels",
        run: () => setPanel(p.id),
      })),
      {
        id: "publish",
        label: "Publish site to live",
        group: "Actions",
        run: () => {
          setSaveMode("publish");
          setShowSave(true);
        },
      },
      { id: "undo", label: "Undo", group: "Edit", run: undo },
      { id: "redo", label: "Redo", group: "Edit", run: redo },
      {
        id: "preview",
        label: "Show canvas preview",
        group: "View",
        run: () => setCanvasTab("preview"),
      },
      {
        id: "layers",
        label: "Show layers",
        group: "View",
        run: () => setCanvasTab("layers"),
      },
      {
        id: "assets",
        label: "Open Assets library",
        group: "Panels",
        run: () => setPanel("assets"),
      },
      {
        id: "insert",
        label: "Insert blocks (Figma-style)",
        group: "Panels",
        run: () => setPanel("insert"),
      },
      {
        id: "pages-panel",
        label: "Page builder — custom pages",
        group: "Panels",
        run: () => setPanel("pages"),
      },
      {
        id: "shortcuts",
        label: "Keyboard shortcuts",
        group: "Help",
        run: () => setShortcutsOpen(true),
      },
    ],
    [panels, undo, redo]
  );

  const applyMediaUrl = (field: MediaField, url: string) => {
    patch((c) => {
      c.admin.media[field] = url;
      return c;
    });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      if (saveMode === "reset") {
        const reset = await resetSiteConfig(user.username, password);
        setDraft(structuredClone(reset));
        setHistory([structuredClone(reset)]);
        setHistIdx(0);
      } else {
        await saveSiteConfig(draft, user.username, password);
      }
      setShowSave(false);
      setPassword("");
      notify(saveMode === "reset" ? "Reset complete" : "Site live!");
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : "Failed", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#09090f] text-[#e2e8f0] overflow-hidden select-none">
      {/* Top command bar — Figma-style */}
      <header className="h-12 shrink-0 flex items-center justify-between px-3 border-b border-white/[0.06] bg-[#0c0c14]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              applySiteTheme(liveConfig);
              if (embedded && onExit) onExit();
              else setPage(embedded ? "admin" : "dashboard");
            }}
            className="p-2 rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 px-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center text-[10px] font-black text-black">
              V
            </div>
            <div>
              <p className="text-xs font-bold tracking-wide">VIDYA STUDIO</p>
              <p className="text-[9px] text-white/35">World-class site editor</p>
            </div>
          </div>
          {hasUnsaved && (
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Unsaved
            </span>
          )}
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg border border-white/10 text-[10px] text-white/50 hover:bg-white/5 cursor-pointer"
            title="Command palette (Ctrl+K)"
          >
            <Command className="w-3 h-3" />
            <kbd className="font-mono text-[9px]">⌘K</kbd>
          </button>
          <button
            type="button"
            onClick={() => setShortcutsOpen(true)}
            className="p-2 rounded-lg hover:bg-white/5 cursor-pointer text-white/40"
            title="Shortcuts (?)"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1 bg-black/40 rounded-lg p-0.5 border border-white/[0.06]">
          <button onClick={undo} disabled={histIdx <= 0} className="p-1.5 rounded hover:bg-white/10 disabled:opacity-25 cursor-pointer" title="Undo">
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={redo} disabled={histIdx >= history.length - 1} className="p-1.5 rounded hover:bg-white/10 disabled:opacity-25 cursor-pointer" title="Redo">
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          {[{ id: "desktop" as const, icon: Monitor }, { id: "tablet" as const, icon: Tablet }, { id: "mobile" as const, icon: Smartphone }].map(
            ({ id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setDevice(id)}
                className={`p-1.5 rounded cursor-pointer ${device === id ? "bg-cyan-500/20 text-cyan-400" : "text-white/40 hover:text-white/70"}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            )
          )}
          <div className="w-px h-5 bg-white/10 mx-1" />
          <button onClick={() => setZoom((z) => Math.max(50, z - 10))} className="p-1.5 cursor-pointer text-white/50 hover:text-white">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono w-8 text-center text-cyan-400">{zoom}%</span>
          <button onClick={() => setZoom((z) => Math.min(120, z + 10))} className="p-1.5 cursor-pointer text-white/50 hover:text-white">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.open(`${window.location.origin}${window.location.pathname}#/home`, "_blank")}
            className="hidden md:flex px-3 py-1.5 text-[10px] rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer items-center gap-1 text-white/50"
          >
            <ExternalLink className="w-3 h-3" /> Live site
          </button>
          <button
            onClick={() => { setSaveMode("reset"); setShowSave(true); }}
            className="px-3 py-1.5 text-[10px] rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
          <button
            onClick={() => { setSaveMode("publish"); setShowSave(true); }}
            className="px-4 py-1.5 text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1.5 bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-black"
          >
            <Save className="w-3.5 h-3.5" /> Publish
          </button>
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        {/* Left icon rail */}
        <aside className="w-12 shrink-0 border-r border-white/[0.06] bg-[#0a0a12] flex flex-col items-center py-2 gap-1 overflow-y-auto">
          {filteredPanels.map((p) => (
            <button
              key={p.id}
              onClick={() => setPanel(p.id)}
              title={p.label}
              className={`w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                panel === p.id
                  ? "bg-cyan-500/20 text-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                  : "text-white/35 hover:text-white/70 hover:bg-white/5"
              }`}
            >
              {p.icon}
            </button>
          ))}
        </aside>

        {/* Properties inspector */}
        <div className="w-[320px] shrink-0 border-r border-white/[0.06] bg-[#0e0e16] overflow-y-auto flex flex-col">
          <div className="p-3 border-b border-white/[0.06] space-y-2 shrink-0">
            <div className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-cyan-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/50 flex-1">
                {panels.find((p) => p.id === panel)?.label ?? panel}
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/25" />
              <input
                value={panelSearch}
                onChange={(e) => setPanelSearch(e.target.value)}
                placeholder="Find panel…"
                className="studio-input w-full pl-7 py-1.5 text-[10px]"
              />
            </div>
          </div>
          <div className="p-4 space-y-5 flex-1">
            {panel === "theme" && (
              <>
                <StudioField label="Color presets">
                  <div className="grid grid-cols-2 gap-2">
                    {THEME_PRESETS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => patch((c) => mergePresetIntoConfig(c, p.id))}
                        className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                          draft.themePreset === p.id
                            ? "border-cyan-400 bg-cyan-500/10"
                            : "border-white/10 hover:border-white/25"
                        }`}
                      >
                        <div className="flex gap-1 mb-1">
                          <span className="w-3 h-3 rounded-full" style={{ background: p.theme.accent }} />
                          <span className="w-3 h-3 rounded-full" style={{ background: p.theme.accentSoft }} />
                        </div>
                        <span className="text-[9px] font-medium">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </StudioField>
                {(["accent", "accentSoft", "accentAlt", "neon"] as const).map((key) => (
                  <StudioField key={key} label={key}>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={draft.theme[key]}
                        onChange={(e) => patch((c) => { c.theme[key] = e.target.value; return c; })}
                        className="w-9 h-9 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        value={draft.theme[key]}
                        onChange={(e) => patch((c) => { c.theme[key] = e.target.value; return c; })}
                        className="studio-input flex-1 px-2 font-mono text-[10px]"
                      />
                    </div>
                  </StudioField>
                ))}
                <StudioField label="Typography (site-wide)">
                  <div className="space-y-2">
                    {(["display", "body", "ui", "article"] as const).map((key) => (
                      <div key={key}>
                        <span className="text-[8px] text-white/30 capitalize">{key}</span>
                        <input
                          value={draft.typography[key]}
                          onChange={(e) =>
                            patch((c) => {
                              c.typography[key] = e.target.value;
                              applySiteTheme(c);
                              return c;
                            })
                          }
                          className="studio-input w-full px-2 py-1.5 text-[10px] font-mono"
                        />
                      </div>
                    ))}
                  </div>
                </StudioField>
              </>
            )}

            {panel === "effects" && (
              <>
                {[
                  ["scanlines", "CRT scanlines"],
                  ["gridOverlay", "Grid overlay"],
                  ["neonGlow", "Neon glow text"],
                  ["reducedMotion", "Reduce motion"],
                ].map(([key, label]) => (
                  <label key={key} className="flex justify-between items-center text-xs cursor-pointer py-1">
                    <span className="text-white/60">{label}</span>
                    <input
                      type="checkbox"
                      checked={draft.effects[key as keyof typeof draft.effects]}
                      onChange={(e) =>
                        patch((c) => {
                          c.effects[key as keyof typeof c.effects] = e.target.checked;
                          applySiteTheme(c);
                          return c;
                        })
                      }
                      className="accent-cyan-400"
                    />
                  </label>
                ))}
                <StudioField label="Hero FX">
                  <select
                    value={draft.hero.backgroundStyle}
                    onChange={(e) =>
                      patch((c) => {
                        c.hero.backgroundStyle = e.target.value as HeroBackground;
                        return c;
                      })
                    }
                    className="studio-input w-full px-2 py-2"
                  >
                    <option value="cybergrid">Cyber Grid</option>
                    <option value="particles">Particle Field</option>
                    <option value="aurora">Aurora Nebula</option>
                    <option value="mesh">Plasma Mesh</option>
                    <option value="gradient">Gradient Pulse</option>
                    <option value="minimal">None</option>
                  </select>
                </StudioField>
              </>
            )}

            {panel === "brand" && (
              <>
                <StudioField label="Site identity">
                  <BiInput
                    en={draft.branding.siteNameEn}
                    si={draft.branding.siteNameSi}
                    onEn={(v) => patch((c) => { c.branding.siteNameEn = v; return c; })}
                    onSi={(v) => patch((c) => { c.branding.siteNameSi = v; return c; })}
                  />
                </StudioField>
                <StudioField label="Tagline">
                  <BiInput
                    en={draft.branding.taglineEn}
                    si={draft.branding.taglineSi}
                    onEn={(v) => patch((c) => { c.branding.taglineEn = v; return c; })}
                    onSi={(v) => patch((c) => { c.branding.taglineSi = v; return c; })}
                  />
                </StudioField>
              </>
            )}

            {panel === "pages" && <StudioPageBuilder draft={draft} onPatch={patch} />}

            {panel === "ai" && <StudioAIPanel draft={draft} onPatch={patch} />}

            {panel === "insert" && (
              <StudioInsertPanel draft={draft} onPatch={patch} />
            )}

            {panel === "hero" && (
              <>
                <StudioField label="Badge">
                  <BiInput en={draft.hero.badgeEn} si={draft.hero.badgeSi} onEn={(v) => patch((c) => { c.hero.badgeEn = v; return c; })} onSi={(v) => patch((c) => { c.hero.badgeSi = v; return c; })} />
                </StudioField>
                <StudioField label="Headline">
                  <BiInput en={draft.hero.headlineEn} si={draft.hero.headlineSi} onEn={(v) => patch((c) => { c.hero.headlineEn = v; return c; })} onSi={(v) => patch((c) => { c.hero.headlineSi = v; return c; })} />
                </StudioField>
                <StudioField label="Subhead">
                  <BiInput en={draft.hero.subheadEn} si={draft.hero.subheadSi} onEn={(v) => patch((c) => { c.hero.subheadEn = v; return c; })} onSi={(v) => patch((c) => { c.hero.subheadSi = v; return c; })} multiline />
                </StudioField>
                <label className="flex gap-2 text-xs cursor-pointer">
                  <input type="checkbox" checked={draft.hero.showSearch} onChange={(e) => patch((c) => { c.hero.showSearch = e.target.checked; return c; })} />
                  Show search
                </label>
              </>
            )}

            {panel === "home" && (
              <>
                <StudioField label="Section order" hint="Drag to reorder">
                  <Reorder.Group
                    axis="y"
                    values={draft.homeSections.order}
                    onReorder={(order) => patch((c) => { c.homeSections.order = order; return c; })}
                    className="space-y-1"
                  >
                    {draft.homeSections.order.map((id) => (
                      <Reorder.Item
                        key={id}
                        value={id}
                        className="flex items-center gap-2 p-2 rounded-lg bg-black/30 border border-white/[0.06] cursor-grab active:cursor-grabbing"
                      >
                        <GripVertical className="w-3 h-3 text-white/30" />
                        <span className="text-[10px] flex-1">{SECTION_LABELS[id] || id}</span>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                </StudioField>
                {[
                  ["showStats", "Stats"],
                  ["showContinueReading", "Continue"],
                  ["showBookmarks", "Bookmarks"],
                  ["showIssuesSidebar", "Issues"],
                  ["showAnnouncement", "Banner"],
                ].map(([key, label]) => (
                  <label key={key} className="flex justify-between text-xs cursor-pointer">
                    <span>{label}</span>
                    <input
                      type="checkbox"
                      checked={draft.homeSections[key as keyof typeof draft.homeSections] as boolean}
                      onChange={(e) => patch((c) => { (c.homeSections as unknown as Record<string, boolean>)[key] = e.target.checked; return c; })}
                    />
                  </label>
                ))}
                {draft.announcement.enabled && (
                  <StudioField label="Banner text">
                    <BiInput en={draft.announcement.messageEn} si={draft.announcement.messageSi} onEn={(v) => patch((c) => { c.announcement.messageEn = v; return c; })} onSi={(v) => patch((c) => { c.announcement.messageSi = v; return c; })} />
                  </StudioField>
                )}
              </>
            )}

            {panel === "nav" &&
              draft.navItems.map((item, i) => (
                <div key={item.id} className="p-2 rounded-lg border border-white/[0.06] space-y-2">
                  <label className="flex gap-2 text-[10px]">
                    <input type="checkbox" checked={item.visible} onChange={(e) => patch((c) => { c.navItems[i].visible = e.target.checked; return c; })} />
                    Visible
                  </label>
                  <BiInput en={item.labelEn} si={item.labelSi} onEn={(v) => patch((c) => { c.navItems[i].labelEn = v; return c; })} onSi={(v) => patch((c) => { c.navItems[i].labelSi = v; return c; })} />
                </div>
              ))}

            {panel === "footer" && <StudioFooterPanel draft={draft} onPatch={patch} />}

            {panel === "about" && (
              <>
                <StudioField label="Title"><BiInput en={draft.about.titleEn} si={draft.about.titleSi} onEn={(v) => patch((c) => { c.about.titleEn = v; return c; })} onSi={(v) => patch((c) => { c.about.titleSi = v; return c; })} /></StudioField>
                <StudioField label="Body"><BiInput en={draft.about.bodyEn} si={draft.about.bodySi} onEn={(v) => patch((c) => { c.about.bodyEn = v; return c; })} onSi={(v) => patch((c) => { c.about.bodySi = v; return c; })} multiline /></StudioField>
              </>
            )}

            {panel === "media" && (
              <>
                <StudioField label="Upload password" hint="Same as Publish">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="studio-input w-full px-2 py-2 text-xs"
                    placeholder="password123"
                    autoComplete="current-password"
                  />
                </StudioField>
                <div className="flex gap-1 flex-wrap">
                  {(
                    [
                      ["logoUrl", "Logo"],
                      ["faviconUrl", "Favicon"],
                      ["heroImageUrl", "Hero"],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setMediaFocus(key)}
                      className={`text-[9px] px-2 py-1 rounded border cursor-pointer ${
                        mediaFocus === key
                          ? "border-cyan-500/50 bg-cyan-500/15 text-cyan-300"
                          : "border-white/10 text-white/40"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <StudioField label={`${mediaFocus === "logoUrl" ? "Logo" : mediaFocus === "faviconUrl" ? "Favicon" : "Hero"} URL`}>
                  <input
                    value={draft.admin.media[mediaFocus]}
                    onChange={(e) => applyMediaUrl(mediaFocus, e.target.value)}
                    className="studio-input w-full px-2 py-2 text-xs"
                  />
                </StudioField>
                <ImageUploadField
                  label="Upload to selected field"
                  value={draft.admin.media[mediaFocus]}
                  onChange={(url) => applyMediaUrl(mediaFocus, url)}
                  lang="EN"
                  username={user?.username}
                  password={password}
                  aspect={mediaFocus === "heroImageUrl" ? "wide" : "square"}
                  variant="studio"
                  hint="Select Logo / Favicon / Hero above first"
                />
                <p className="text-[10px] text-white/35">
                  Publish to apply logo/favicon site-wide. Asset library: Assets panel.
                </p>
              </>
            )}

            {panel === "assets" && user && (
              <>
                <StudioField label="Upload password" hint="Required for library">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="studio-input w-full px-2 py-2 text-xs"
                    autoComplete="current-password"
                  />
                </StudioField>
                <p className="text-[10px] text-white/35">
                  Target field:{" "}
                  <span className="text-cyan-400/80">
                    {mediaFocus === "logoUrl" ? "Logo" : mediaFocus === "faviconUrl" ? "Favicon" : "Hero"}
                  </span>{" "}
                  (change in Media panel)
                </p>
                <StudioAssetsPanel
                  username={user.username}
                  password={password}
                  onPickUrl={(url) => applyMediaUrl(mediaFocus, url)}
                />
              </>
            )}
          </div>
        </div>

        {/* Canvas — Figma artboard */}
        <div className="flex-1 flex flex-col min-w-0 studio-grid-bg">
          <div className="h-9 shrink-0 flex items-center gap-2 px-4 border-b border-white/[0.06] bg-[#0c0c14]/80">
            <button onClick={() => setCanvasTab("preview")} className={`text-[10px] font-bold uppercase cursor-pointer ${canvasTab === "preview" ? "text-cyan-400" : "text-white/35"}`}>Canvas</button>
            <button onClick={() => setCanvasTab("layers")} className={`text-[10px] font-bold uppercase cursor-pointer flex items-center gap-1 ${canvasTab === "layers" ? "text-cyan-400" : "text-white/35"}`}>
              <Layers className="w-3 h-3" /> Layers
            </button>
          </div>

          <div className="flex-1 overflow-auto flex items-start justify-center p-8">
            {canvasTab === "layers" ? (
              <div className="w-64 space-y-1 text-xs">
                {draft.homeSections.order.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setPanel("home");
                      setCanvasTab("preview");
                    }}
                    className="w-full px-3 py-2 rounded bg-white/5 border border-white/[0.06] flex items-center gap-2 text-left cursor-pointer hover:border-cyan-500/30 hover:bg-cyan-500/5"
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    {SECTION_LABELS[id] ?? id}
                  </button>
                ))}
              </div>
            ) : (
              <motion.div
                layout
                className="rounded-xl overflow-hidden shadow-2xl neon-border"
                style={{
                  width: deviceWidth * (zoom / 100),
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "top center",
                }}
              >
                <div className="h-6 bg-[#14141c] border-b border-white/10 flex items-center px-3 gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500/80" />
                  <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
                  <span className="w-2 h-2 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-[9px] text-white/30 font-mono">vidya.local — preview</span>
                </div>
                <SitePreview config={draft} lang="BILINGUAL" scale={1} />
              </motion.div>
            )}
            
            {/* Floating metrics indicator */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="absolute bottom-10 right-10 bg-black/40 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex gap-4 text-[10px] font-mono shadow-2xl pointer-events-none"
            >
               <div>
                  <span className="text-white/40 block mb-1 uppercase tracking-widest text-[8px]">FPS</span>
                  <span className="text-cyan-400 font-bold">60</span>
               </div>
               <div className="w-px h-6 bg-white/10" />
               <div>
                  <span className="text-white/40 block mb-1 uppercase tracking-widest text-[8px]">Bundle</span>
                  <span className="text-fuchsia-400 font-bold">~142kb</span>
               </div>
               <div className="w-px h-6 bg-white/10" />
               <div>
                  <span className="text-white/40 block mb-1 uppercase tracking-widest text-[8px]">Nodes</span>
                  <span className="text-yellow-400 font-bold">34</span>
               </div>
            </motion.div>
          </div>
        </div>
      </div>

      <footer className="h-7 shrink-0 flex items-center justify-between px-4 border-t border-white/[0.06] bg-[#0a0a12] text-[9px] text-white/35 font-mono">
        <span>
          Panel: <span className="text-cyan-400/80">{panel}</span> · {device} · {zoom}%
        </span>
        <span>{hasUnsaved ? "● Unsaved changes" : "○ Synced with draft"}</span>
      </footer>

      <StudioCommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        commands={studioCommands}
      />

      <StudioShortcutsHelp open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />

      {showSave && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm rounded-2xl border border-cyan-500/30 bg-[#12121a] p-6 space-y-4 shadow-[0_0_60px_rgba(0,240,255,0.15)]">
            <h3 className="font-bold text-lg neon-text">{saveMode === "reset" ? "Reset protocol" : "Publish to network"}</h3>
            <p className="text-xs text-white/40">Owner password required</p>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="studio-input w-full px-4 py-3" placeholder="admin password" />
            <div className="flex gap-2">
              <button onClick={() => setShowSave(false)} className="flex-1 py-2.5 rounded-xl border border-white/15 text-sm cursor-pointer">Cancel</button>
              <button onClick={handleSave} disabled={saving || !password} className="flex-1 py-2.5 rounded-xl text-sm font-bold cursor-pointer bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-black disabled:opacity-40">
                {saving ? "..." : "Confirm"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
