import React, { useState } from "react";
import { SiteConfig } from "../../types/site";
import { useApp } from "../../context/AppContext";
import { applySiteTheme } from "../../lib/applyTheme";
import { applySiteAdmin } from "../../lib/applySiteAdmin";
import {
  Globe,
  ToggleLeft,
  Image,
  Share2,
  BookOpen,
  BarChart2,
  Code,
  Save,
} from "lucide-react";

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
      <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/50">
        {icon}
        {title}
      </div>
      <div className="p-4 space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
  key?: React.Key;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[10px] uppercase tracking-wider text-white/40">{label}</span>
      {children}
    </label>
  );
}

function AdminInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`studio-input w-full px-3 py-2 ${props.className ?? ""}`} />;
}

function AdminTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`studio-input w-full px-3 py-2 min-h-[72px] ${props.className ?? ""}`}
    />
  );
}

export default function AdminSettingsPanel({
  draft,
  onChange,
}: {
  draft: SiteConfig;
  onChange: (next: SiteConfig) => void;
}) {
  const { user, saveSiteConfig, notify, lang } = useApp();
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const patchAdmin = (fn: (c: SiteConfig) => SiteConfig) => {
    const next = fn(structuredClone(draft));
    onChange(next);
    applySiteTheme(next);
    applySiteAdmin(next, lang);
  };

  const a = draft.admin;

  const save = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await saveSiteConfig(draft, user.username, password);
      setShowPw(false);
      setPassword("");
      notify("Admin settings published");
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Section icon={<Globe className="w-4 h-4" />} title="SEO & Meta">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Title (EN)">
            <AdminInput
              value={a.seo.titleEn}
              onChange={(e) => patchAdmin((c) => { c.admin.seo.titleEn = e.target.value; return c; })}
            />
          </Field>
          <Field label="Title (SI)">
            <AdminInput
              value={a.seo.titleSi}
              onChange={(e) => patchAdmin((c) => { c.admin.seo.titleSi = e.target.value; return c; })}
            />
          </Field>
        </div>
        <Field label="Description (EN)">
          <AdminTextarea
            value={a.seo.descriptionEn}
            onChange={(e) => patchAdmin((c) => { c.admin.seo.descriptionEn = e.target.value; return c; })}
          />
        </Field>
        <Field label="Description (SI)">
          <AdminTextarea
            value={a.seo.descriptionSi}
            onChange={(e) => patchAdmin((c) => { c.admin.seo.descriptionSi = e.target.value; return c; })}
          />
        </Field>
        <Field label="Keywords">
          <AdminInput
            value={a.seo.keywords}
            onChange={(e) => patchAdmin((c) => { c.admin.seo.keywords = e.target.value; return c; })}
          />
        </Field>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="OG image URL">
            <AdminInput
              value={a.seo.ogImageUrl}
              onChange={(e) => patchAdmin((c) => { c.admin.seo.ogImageUrl = e.target.value; return c; })}
            />
          </Field>
          <Field label="Canonical URL">
            <AdminInput
              value={a.seo.canonicalUrl}
              onChange={(e) => patchAdmin((c) => { c.admin.seo.canonicalUrl = e.target.value; return c; })}
            />
          </Field>
        </div>
      </Section>

      <Section icon={<ToggleLeft className="w-4 h-4" />} title="Platform features">
        {[
          ["maintenanceMode", "Maintenance mode (blocks public)"],
          ["allowRegistration", "Allow new sign-ups"],
          ["showPlatformStats", "Show stats on home"],
          ["enableReaderComments", "Reader comments"],
          ["enableBookmarks", "Bookmarks feature"],
          ["announcementDismissible", "Dismissible announcement", "advanced"],
        ].map(([key, label, section]) => (
          <label key={key} className="flex justify-between items-center text-sm cursor-pointer py-1">
            <span className="text-white/70">{label}</span>
            <input
              type="checkbox"
              checked={
                section === "advanced"
                  ? (a.advanced as unknown as Record<string, boolean>)[key]
                  : (a.features as unknown as Record<string, boolean>)[key]
              }
              onChange={(e) =>
                patchAdmin((c) => {
                  if (section === "advanced") {
                    (c.admin.advanced as unknown as Record<string, boolean>)[key] =
                      e.target.checked;
                  } else {
                    (c.admin.features as unknown as Record<string, boolean>)[key] =
                      e.target.checked;
                  }
                  return c;
                })
              }
              className="accent-[var(--vc-accent)]"
            />
          </label>
        ))}
        <Field label="Maintenance message (EN)">
          <AdminTextarea
            value={a.features.maintenanceMessageEn}
            onChange={(e) => patchAdmin((c) => { c.admin.features.maintenanceMessageEn = e.target.value; return c; })}
          />
        </Field>
        <Field label="Maintenance message (SI)">
          <AdminTextarea
            value={a.features.maintenanceMessageSi}
            onChange={(e) => patchAdmin((c) => { c.admin.features.maintenanceMessageSi = e.target.value; return c; })}
          />
        </Field>
        <Field label="Default language">
          <select
            value={a.features.defaultLanguage}
            onChange={(e) =>
              patchAdmin((c) => {
                c.admin.features.defaultLanguage = e.target.value as typeof a.features.defaultLanguage;
                return c;
              })
            }
            className="studio-input w-full px-3 py-2"
          >
            <option value="EN">English</option>
            <option value="SI">Sinhala</option>
            <option value="BILINGUAL">Bilingual</option>
          </select>
        </Field>
        <Field label="Lock theme">
          <select
            value={a.features.lockTheme ?? ""}
            onChange={(e) =>
              patchAdmin((c) => {
                c.admin.features.lockTheme = e.target.value
                  ? (e.target.value as "light" | "dark")
                  : null;
                return c;
              })
            }
            className="studio-input w-full px-3 py-2"
          >
            <option value="">User choice</option>
            <option value="light">Always light</option>
            <option value="dark">Always dark</option>
          </select>
        </Field>
      </Section>

      <Section icon={<Image className="w-4 h-4" />} title="Media & brand assets">
        <Field label="Logo URL">
          <AdminInput
            value={a.media.logoUrl}
            onChange={(e) => patchAdmin((c) => { c.admin.media.logoUrl = e.target.value; return c; })}
            placeholder="https://..."
          />
        </Field>
        <Field label="Favicon URL">
          <AdminInput
            value={a.media.faviconUrl}
            onChange={(e) => patchAdmin((c) => { c.admin.media.faviconUrl = e.target.value; return c; })}
          />
        </Field>
        <Field label="Hero image override URL">
          <AdminInput
            value={a.media.heroImageUrl}
            onChange={(e) => patchAdmin((c) => { c.admin.media.heroImageUrl = e.target.value; return c; })}
          />
        </Field>
      </Section>

      <Section icon={<Share2 className="w-4 h-4" />} title="Social & contact">
        <Field label="Contact email">
          <AdminInput
            type="email"
            value={a.social.contactEmail}
            onChange={(e) => patchAdmin((c) => { c.admin.social.contactEmail = e.target.value; return c; })}
          />
        </Field>
        {(["twitter", "facebook", "instagram", "youtube"] as const).map((k) => (
          <Field key={k} label={k}>
            <AdminInput
              value={a.social[k]}
              onChange={(e) => patchAdmin((c) => { c.admin.social[k] = e.target.value; return c; })}
            />
          </Field>
        ))}
      </Section>

      <Section icon={<BookOpen className="w-4 h-4" />} title="Reader experience">
        <Field label="Default reader view">
          <select
            value={a.reader.defaultView}
            onChange={(e) =>
              patchAdmin((c) => {
                c.admin.reader.defaultView = e.target.value as "scroll" | "flip";
                return c;
              })
            }
            className="studio-input w-full px-3 py-2"
          >
            <option value="scroll">Scroll</option>
            <option value="flip">Flip book</option>
          </select>
        </Field>
        <Field label={`Font scale (${a.reader.defaultFontScale}%)`}>
          <input
            type="range"
            min={85}
            max={130}
            value={a.reader.defaultFontScale}
            onChange={(e) =>
              patchAdmin((c) => {
                c.admin.reader.defaultFontScale = Number(e.target.value);
                return c;
              })
            }
            className="w-full accent-[var(--vc-accent)]"
          />
        </Field>
        {[
          ["showReadingTime", "Show reading time"],
          ["enableGlossary", "Glossary highlights"],
        ].map(([key, label]) => (
          <label key={key} className="flex justify-between text-sm cursor-pointer">
            <span className="text-white/70">{label}</span>
            <input
              type="checkbox"
              checked={a.reader[key as keyof typeof a.reader] as boolean}
              onChange={(e) =>
                patchAdmin((c) => {
                  (c.admin.reader as unknown as Record<string, boolean>)[key] =
                    e.target.checked;
                  return c;
                })
              }
            />
          </label>
        ))}
      </Section>

      <Section icon={<BarChart2 className="w-4 h-4" />} title="Analytics">
        <Field label="Google Analytics ID">
          <AdminInput
            value={a.analytics.googleAnalyticsId}
            onChange={(e) => patchAdmin((c) => { c.admin.analytics.googleAnalyticsId = e.target.value; return c; })}
            placeholder="G-XXXXXXXX"
          />
        </Field>
        <Field label="Plausible domain">
          <AdminInput
            value={a.analytics.plausibleDomain}
            onChange={(e) => patchAdmin((c) => { c.admin.analytics.plausibleDomain = e.target.value; return c; })}
          />
        </Field>
      </Section>

      <Section icon={<Code className="w-4 h-4" />} title="Advanced">
        <Field label="Custom CSS (owner only)">
          <AdminTextarea
            value={a.advanced.customCss}
            onChange={(e) => patchAdmin((c) => { c.admin.advanced.customCss = e.target.value; return c; })}
            className="font-mono text-[11px] min-h-[120px]"
            placeholder=".vc-hero { ... }"
          />
        </Field>
        <label className="flex justify-between text-sm cursor-pointer">
          <span className="text-white/70">Sticky navigation</span>
          <input
            type="checkbox"
            checked={a.advanced.navSticky}
            onChange={(e) => patchAdmin((c) => { c.admin.advanced.navSticky = e.target.checked; return c; })}
          />
        </label>
      </Section>

      <button
        type="button"
        onClick={() => setShowPw(true)}
        className="w-full py-3 rounded-xl font-semibold text-sm cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-black"
      >
        <Save className="w-4 h-4" />
        Publish admin settings
      </button>

      {showPw && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#12121a] p-6 space-y-4">
            <h3 className="font-bold">Owner password</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="studio-input w-full px-4 py-3"
            />
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowPw(false)} className="flex-1 py-2.5 rounded-xl border border-white/15 text-sm cursor-pointer">
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={saving || !password}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold cursor-pointer bg-cyan-400 text-black disabled:opacity-40"
              >
                {saving ? "..." : "Publish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
