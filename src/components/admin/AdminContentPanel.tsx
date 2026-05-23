import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { SiteConfig } from "../../types/site";
import { AuthorProfile } from "../../types";
import { slugify } from "../../lib/authors";
import { EMPTY_AUTHOR_SOCIAL } from "../../lib/social";
import {
  FileText,
  Layers,
  BookMarked,
  Navigation,
  UserCircle,
  Plus,
  Trash2,
  Pencil,
  ExternalLink,
} from "lucide-react";

type ContentTab = "articles" | "issues" | "glossary" | "profiles" | "navigation";

export default function AdminContentPanel({
  draft,
  onSiteChange,
}: {
  draft: SiteConfig;
  onSiteChange: (c: SiteConfig) => void;
}) {
  const {
    articles,
    drafts,
    issues,
    glossary,
    profiles,
    deleteArticle,
    deleteIssue,
    deleteGlossary,
    deleteProfile,
    saveProfile,
    setPage,
    notify,
  } = useApp();

  const [tab, setTab] = useState<ContentTab>("articles");
  const [editingProfile, setEditingProfile] = useState<AuthorProfile | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [confirm, setConfirm] = useState<{ type: string; id: string; label: string } | null>(null);
  const [contentSearch, setContentSearch] = useState("");

  const tabs: { id: ContentTab; icon: React.ReactNode; label: string }[] = [
    { id: "articles", icon: <FileText className="w-4 h-4" />, label: "Articles" },
    { id: "issues", icon: <Layers className="w-4 h-4" />, label: "Issues" },
    { id: "glossary", icon: <BookMarked className="w-4 h-4" />, label: "Glossary" },
    { id: "profiles", icon: <UserCircle className="w-4 h-4" />, label: "Profiles" },
    { id: "navigation", icon: <Navigation className="w-4 h-4" />, label: "Navigation" },
  ];

  const allArticles = [...articles, ...drafts];
  const q = contentSearch.toLowerCase().trim();
  const filterByQ = (label: string) => !q || label.toLowerCase().includes(q);

  const runDelete = async () => {
    if (!confirm) return;
    try {
      if (confirm.type === "article") await deleteArticle(confirm.id);
      else if (confirm.type === "issue") await deleteIssue(confirm.id);
      else if (confirm.type === "glossary") await deleteGlossary(confirm.id);
      else if (confirm.type === "profile") await deleteProfile(confirm.id);
      setConfirm(null);
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : "Delete failed", "error");
    }
  };

  const newProfile = (): AuthorProfile => ({
    id: `prof-${Date.now()}`,
    slug: "new-contributor",
    nameEn: "New Contributor",
    nameSi: "නව සහයෝගී",
    titleEn: "Contributor",
    titleSi: "සහයෝගී",
    bioEn: "",
    bioSi: "",
    avatarUrl: "https://picsum.photos/seed/new/400/400",
    coverUrl: "https://picsum.photos/seed/new-cover/1200/400",
    expertise: [],
    locationEn: "Sri Lanka",
    locationSi: "ශ්‍රී ලංකාව",
    featured: false,
    social: { ...EMPTY_AUTHOR_SOCIAL },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer ${
              tab === t.id ? "bg-cyan-500/20 text-cyan-400" : "text-white/45 hover:bg-white/5"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setPage("cms")}
          className="ml-auto px-3 py-2 rounded-lg text-xs border border-white/10 cursor-pointer flex items-center gap-1 hover:bg-white/5"
        >
          <ExternalLink className="w-3 h-3" /> Open CMS
        </button>
      </div>

      <input
        value={contentSearch}
        onChange={(e) => setContentSearch(e.target.value)}
        placeholder="Search in this tab..."
        className="studio-input w-full max-w-md px-3 py-2 text-xs"
      />

      {tab === "articles" && (
        <div className="rounded-xl border border-white/[0.08] overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.03] text-[10px] uppercase text-white/40">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 hidden sm:table-cell">Author</th>
                <th className="px-4 py-3 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allArticles.filter((a) => filterByQ(`${a.titleEn} ${a.authorName} ${a.status}`)).map((a) => (
                <tr key={a.id} className="border-t border-white/[0.06]">
                  <td className="px-4 py-3 font-medium line-clamp-1">{a.titleEn}</td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-white/5">{a.status}</span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-white/50 text-xs">{a.authorName}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setPage("cms")}
                        className="p-1.5 rounded hover:bg-white/10 cursor-pointer"
                        title="Edit in CMS"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirm({ type: "article", id: a.id, label: a.titleEn })}
                        className="p-1.5 rounded hover:bg-red-500/20 text-red-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "issues" && (
        <div className="space-y-2">
          {issues.filter((iss) => filterByQ(`${iss.titleEn} ${iss.titleSi} vol ${iss.volume}`)).map((iss) => (
            <div
              key={iss.id}
              className="flex items-center justify-between p-4 rounded-xl border border-white/[0.08] bg-white/[0.02]"
            >
              <div>
                <p className="font-medium text-sm">{iss.titleEn}</p>
                <p className="text-[10px] text-white/40">Vol {iss.volume} · {iss.articleIds.length} articles</p>
              </div>
              <button
                type="button"
                onClick={() => setConfirm({ type: "issue", id: iss.id, label: iss.titleEn })}
                className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "glossary" && (
        <div className="grid sm:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
          {glossary.filter((g) => filterByQ(`${g.term} ${g.termSi} ${g.definitionEn}`)).map((g) => (
            <div
              key={g.term}
              className="flex justify-between items-start p-3 rounded-lg border border-white/[0.08] text-xs"
            >
              <div>
                <p className="font-bold">{g.term}</p>
                <p className="text-white/40 italic">{g.termSi}</p>
              </div>
              <button
                type="button"
                onClick={() => setConfirm({ type: "glossary", id: g.term, label: g.term })}
                className="p-1 text-red-400 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "profiles" && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setEditingProfile(newProfile())}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add profile
          </button>
          {profiles.filter((p) => filterByQ(`${p.nameEn} ${p.slug} ${p.titleEn}`)).map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.08]"
            >
              <img src={p.avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{p.nameEn}</p>
                <p className="text-[10px] text-white/40">/{p.slug}</p>
              </div>
              <button type="button" onClick={() => setEditingProfile(p)} className="p-2 cursor-pointer hover:bg-white/10 rounded-lg">
                <Pencil className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setConfirm({ type: "profile", id: p.id, label: p.nameEn })}
                className="p-2 text-red-400 cursor-pointer hover:bg-red-500/10 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "navigation" && (
        <div className="space-y-4 max-w-lg">
          {draft.navItems.map((item, i) => (
            <div key={item.id} className="p-4 rounded-xl border border-white/[0.08] space-y-2">
              <div className="flex justify-between">
                <span className="text-[10px] text-white/40">#{item.id}</span>
                <button
                  type="button"
                  onClick={() => {
                    const next = structuredClone(draft);
                    next.navItems = next.navItems.filter((_, j) => j !== i);
                    onSiteChange(next);
                  }}
                  className="text-red-400 cursor-pointer text-[10px]"
                >
                  Remove
                </button>
              </div>
              <input
                value={item.labelEn}
                onChange={(e) => {
                  const next = structuredClone(draft);
                  next.navItems[i].labelEn = e.target.value;
                  onSiteChange(next);
                }}
                className="studio-input w-full px-2 py-1.5"
                placeholder="Label EN"
              />
              <input
                value={item.labelSi}
                onChange={(e) => {
                  const next = structuredClone(draft);
                  next.navItems[i].labelSi = e.target.value;
                  onSiteChange(next);
                }}
                className="studio-input w-full px-2 py-1.5"
                placeholder="Label SI"
              />
              <select
                value={item.page}
                onChange={(e) => {
                  const next = structuredClone(draft);
                  next.navItems[i].page = e.target.value;
                  onSiteChange(next);
                }}
                className="studio-input w-full px-2 py-1.5"
              >
                {["home", "articles", "authors", "about"].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <label className="flex gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.visible}
                  onChange={(e) => {
                    const next = structuredClone(draft);
                    next.navItems[i].visible = e.target.checked;
                    onSiteChange(next);
                  }}
                />
                Visible
              </label>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const next = structuredClone(draft);
              next.navItems.push({
                id: `n-${Date.now()}`,
                page: "articles",
                labelEn: "New Link",
                labelSi: "නව සබැඳිය",
                visible: true,
              });
              onSiteChange(next);
            }}
            className="w-full py-2 rounded-lg border border-dashed border-white/20 text-xs cursor-pointer hover:bg-white/5"
          >
            + Add nav item
          </button>
          <p className="text-[10px] text-white/35">Publish site settings from Settings tab to save nav changes live.</p>
        </div>
      )}

      {editingProfile && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/80 p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#12121a] p-6 space-y-3 my-8">
            <h3 className="font-bold">Edit contributor profile</h3>
            {(["nameEn", "nameSi", "titleEn", "titleSi", "slug", "locationEn", "locationSi"] as const).map((key) => (
              <input
                key={key}
                value={editingProfile[key]}
                onChange={(e) => {
                  const v = e.target.value;
                  setEditingProfile((p) =>
                    p
                      ? {
                          ...p,
                          [key]: v,
                          ...(key === "nameEn" ? { slug: slugify(v) } : {}),
                        }
                      : p
                  );
                }}
                className="studio-input w-full px-3 py-2"
                placeholder={key}
              />
            ))}
            <textarea
              value={editingProfile.bioEn}
              onChange={(e) => setEditingProfile((p) => (p ? { ...p, bioEn: e.target.value } : p))}
              className="studio-input w-full px-3 py-2 min-h-[80px]"
              placeholder="Bio EN"
            />
            <textarea
              value={editingProfile.bioSi}
              onChange={(e) => setEditingProfile((p) => (p ? { ...p, bioSi: e.target.value } : p))}
              className="studio-input w-full px-3 py-2 min-h-[80px]"
              placeholder="Bio SI"
            />
            <input
              value={editingProfile.avatarUrl}
              onChange={(e) => setEditingProfile((p) => (p ? { ...p, avatarUrl: e.target.value } : p))}
              className="studio-input w-full px-3 py-2"
              placeholder="Avatar URL"
            />
            <input
              value={editingProfile.coverUrl}
              onChange={(e) => setEditingProfile((p) => (p ? { ...p, coverUrl: e.target.value } : p))}
              className="studio-input w-full px-3 py-2"
              placeholder="Cover URL"
            />
            <input
              value={editingProfile.expertise.join(", ")}
              onChange={(e) =>
                setEditingProfile((p) =>
                  p ? { ...p, expertise: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) } : p
                )
              }
              className="studio-input w-full px-3 py-2"
              placeholder="Expertise (comma separated)"
            />
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={editingProfile.featured}
                onChange={(e) => setEditingProfile((p) => (p ? { ...p, featured: e.target.checked } : p))}
              />
              Featured contributor
            </label>
            <p className="text-[10px] uppercase tracking-widest text-white/40 pt-2">Social links</p>
            {(
              [
                ["email", "Email"],
                ["whatsapp", "WhatsApp (9477… or URL)"],
                ["facebook", "Facebook handle or URL"],
                ["instagram", "Instagram handle or URL"],
                ["twitter", "X / Twitter handle or URL"],
                ["website", "Website URL"],
              ] as const
            ).map(([key, label]) => (
              <input
                key={key}
                value={editingProfile.social[key]}
                onChange={(e) =>
                  setEditingProfile((p) =>
                    p ? { ...p, social: { ...p.social, [key]: e.target.value } } : p
                  )
                }
                className="studio-input w-full px-3 py-2"
                placeholder={label}
              />
            ))}
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setEditingProfile(null)} className="flex-1 py-2 rounded-lg border border-white/15 text-sm cursor-pointer">
                Cancel
              </button>
              <button
                type="button"
                disabled={profileSaving}
                onClick={async () => {
                  setProfileSaving(true);
                  try {
                    await saveProfile(editingProfile);
                    notify("Profile saved", "success");
                    setEditingProfile(null);
                  } catch (e: unknown) {
                    notify(e instanceof Error ? e.message : "Save failed", "error");
                  } finally {
                    setProfileSaving(false);
                  }
                }}
                className="flex-1 py-2 rounded-lg bg-cyan-400 text-black text-sm font-bold cursor-pointer disabled:opacity-50"
              >
                {profileSaving ? "Saving…" : "Save profile"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirm && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center bg-black/80 p-4">
          <div className="max-w-sm w-full rounded-2xl border border-red-500/30 bg-[#1a1010] p-6 space-y-4">
            <p className="text-sm font-medium text-red-200/90">Confirm deletion</p>
            <p className="text-sm text-white/70">
              Remove <strong className="text-white">{confirm.label}</strong> ({confirm.type})? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setConfirm(null)} className="flex-1 py-2 rounded-lg border border-white/15 text-sm cursor-pointer">
                Cancel
              </button>
              <button type="button" onClick={runDelete} className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-bold cursor-pointer">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
