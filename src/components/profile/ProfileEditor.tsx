import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { AuthorProfile } from "../../types";
import { t } from "../../lib/labels";
import { slugify } from "../../lib/authors";
import { EMPTY_AUTHOR_SOCIAL, normalizeAuthorSocial } from "../../lib/social";
import { Save, User, MapPin, Link2 } from "lucide-react";
import ImageUploadField from "../ui/ImageUploadField";

function emptyProfileForUser(userId: string, name: string): AuthorProfile {
  const slug = slugify(name) || "contributor";
  return {
    id: `prof-${userId}`,
    slug,
    userId,
    nameEn: name,
    nameSi: name,
    titleEn: "Contributor",
    titleSi: "සහයෝගී",
    bioEn: "",
    bioSi: "",
    avatarUrl: "https://picsum.photos/seed/new-user/400/400",
    coverUrl: "https://picsum.photos/seed/new-user-cover/1200/400",
    expertise: [],
    locationEn: "Sri Lanka",
    locationSi: "ශ්‍රී ලංකාව",
    featured: false,
    social: { ...EMPTY_AUTHOR_SOCIAL },
  };
}

export default function ProfileEditor({
  initial,
  onSaved,
}: {
  initial?: AuthorProfile;
  onSaved?: (p: AuthorProfile) => void;
}) {
  const { lang, user, saveMyProfile, notify } = useApp();
  const [draft, setDraft] = useState<AuthorProfile>(() =>
    initial
      ? { ...initial, social: normalizeAuthorSocial(initial.social) }
      : user
        ? emptyProfileForUser(user.id, user.name)
        : emptyProfileForUser("new", "Contributor")
  );
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"identity" | "media" | "social">("identity");

  if (!user) return null;

  const canEdit = ["owner", "editor", "author"].includes(user.role);

  const patch = (fn: (p: AuthorProfile) => AuthorProfile) =>
    setDraft((prev) => fn(structuredClone(prev)));

  const save = async () => {
    if (!password.trim()) {
      notify(t(lang, "Enter your password to save.", "සුරැකීමට password එක් කරන්න."), "error");
      return;
    }
    setSaving(true);
    try {
      const saved = await saveMyProfile(draft, user.username, password);
      setPassword("");
      notify(t(lang, "Profile saved!", "පැතිකඩ සුරකින ලදී!"));
      onSaved?.(saved);
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  if (!canEdit) {
    return (
      <div className="premium-card p-6 text-sm text-muted">
        {t(
          lang,
          "Contributor profiles are managed by editors. Contact the newsroom to publish under your name.",
          "ලේඛක පැතිකඩ සංස්කාරකයින් කළමනාකරණය කරයි. ඔබේ නමින් ලිවීමට සම්බන්ධ වන්න."
        )}
      </div>
    );
  }

  return (
    <section className="premium-card p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-medium flex items-center gap-2">
            <User className="w-5 h-5" style={{ color: "var(--vc-accent)" }} />
            {t(lang, "Edit public profile", "ප්‍රසිද්ධ පැතිකඩ සංස්කරණය")}
          </h3>
          <p className="text-xs text-muted mt-1">
            {t(lang, "Names, photos, bio, and social links visitors see.", "නම්, ඡායාරූප, bio, social links.")}
          </p>
        </div>
        <div className="flex gap-1">
          {(["identity", "media", "social"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`pill text-xs capitalize ${tab === id ? "pill-active" : ""}`}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {tab === "identity" && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block text-xs text-muted">
              {t(lang, "Name (EN)", "නම (ඉංග්‍රීසි)")}
              <input
                value={draft.nameEn}
                onChange={(e) =>
                  patch((p) => {
                    p.nameEn = e.target.value;
                    if (!initial) p.slug = slugify(e.target.value) || p.slug;
                    return p;
                  })
                }
                className="input-premium mt-1"
              />
            </label>
            <label className="block text-xs text-muted">
              {t(lang, "Name (SI)", "නම (සිංහල)")}
              <input
                value={draft.nameSi}
                onChange={(e) => patch((p) => { p.nameSi = e.target.value; return p; })}
                className="input-premium mt-1"
              />
            </label>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block text-xs text-muted">
              {t(lang, "Title (EN)", "තනතුර (ඉං.)")}
              <input
                value={draft.titleEn}
                onChange={(e) => patch((p) => { p.titleEn = e.target.value; return p; })}
                className="input-premium mt-1"
              />
            </label>
            <label className="block text-xs text-muted">
              {t(lang, "Title (SI)", "තනතුර (සිං.)")}
              <input
                value={draft.titleSi}
                onChange={(e) => patch((p) => { p.titleSi = e.target.value; return p; })}
                className="input-premium mt-1"
              />
            </label>
          </div>
          <label className="block text-xs text-muted">
            URL slug
            <input
              value={draft.slug}
              onChange={(e) => patch((p) => { p.slug = slugify(e.target.value); return p; })}
              className="input-premium mt-1 font-mono text-sm"
            />
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block text-xs text-muted">
              <MapPin className="w-3 h-3 inline mr-1" />
              {t(lang, "Location (EN)", "ස්ථානය")}
              <input
                value={draft.locationEn}
                onChange={(e) => patch((p) => { p.locationEn = e.target.value; return p; })}
                className="input-premium mt-1"
              />
            </label>
            <label className="block text-xs text-muted">
              {t(lang, "Location (SI)", "ස්ථානය (සිං.)")}
              <input
                value={draft.locationSi}
                onChange={(e) => patch((p) => { p.locationSi = e.target.value; return p; })}
                className="input-premium mt-1"
              />
            </label>
          </div>
          <label className="block text-xs text-muted">
            {t(lang, "Bio (EN)", "Bio (ඉං.)")}
            <textarea
              value={draft.bioEn}
              onChange={(e) => patch((p) => { p.bioEn = e.target.value; return p; })}
              className="input-premium mt-1 min-h-[100px]"
            />
          </label>
          <label className="block text-xs text-muted">
            {t(lang, "Bio (SI)", "Bio (සිං.)")}
            <textarea
              value={draft.bioSi}
              onChange={(e) => patch((p) => { p.bioSi = e.target.value; return p; })}
              className="input-premium mt-1 min-h-[100px]"
            />
          </label>
          <label className="block text-xs text-muted">
            {t(lang, "Expertise (comma separated)", "විශේෂඥතා")}
            <input
              value={draft.expertise.join(", ")}
              onChange={(e) =>
                patch((p) => {
                  p.expertise = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                  return p;
                })
              }
              className="input-premium mt-1"
            />
          </label>
        </div>
      )}

      {tab === "media" && (
        <div className="space-y-6">
          <p className="text-[11px] text-muted">
            {t(
              lang,
              "Upload a photo or paste a URL. Use the same password as below to upload files (max 8MB).",
              "ඡායාරූපය upload කරන්න හෝ URL එක් කරන්න. Upload සඳහා පහළ password එකම භාවිතා කරන්න."
            )}
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            <ImageUploadField
              label={t(lang, "Avatar", "ඡායාරූපය")}
              value={draft.avatarUrl}
              onChange={(url) => patch((p) => { p.avatarUrl = url; return p; })}
              lang={lang}
              username={user.username}
              password={password}
              aspect="square"
              hint={t(lang, "PNG, JPG, WebP", "PNG, JPG, WebP")}
            />
            <ImageUploadField
              label={t(lang, "Cover banner", "කවර් ඡායාරූපය")}
              value={draft.coverUrl}
              onChange={(url) => patch((p) => { p.coverUrl = url; return p; })}
              lang={lang}
              username={user.username}
              password={password}
              aspect="wide"
            />
          </div>
        </div>
      )}

      {tab === "social" && (
        <div className="space-y-3">
          <p className="text-xs text-muted flex items-center gap-1">
            <Link2 className="w-3.5 h-3.5" />
            WhatsApp: phone digits only (e.g. 94771234567)
          </p>
          {(
            [
              ["email", "Email"],
              ["whatsapp", "WhatsApp"],
              ["facebook", "Facebook"],
              ["instagram", "Instagram"],
              ["twitter", "X / Twitter"],
              ["website", "Website"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block text-xs text-muted">
              {label}
              <input
                value={draft.social[key]}
                onChange={(e) =>
                  patch((p) => {
                    p.social[key] = e.target.value;
                    return p;
                  })
                }
                className="input-premium mt-1"
              />
            </label>
          ))}
        </div>
      )}

      <div className="pt-4 border-t border-[var(--vc-border)] flex flex-col sm:flex-row gap-3 sm:items-end">
        <label className="flex-1 text-xs text-muted">
          {t(lang, "Your password (to confirm save)", "සුරැකීමට password")}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-premium mt-1"
            autoComplete="current-password"
          />
        </label>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="btn-primary shrink-0 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? "..." : t(lang, "Save profile", "පැතිකඩ සුරකින්න")}
        </button>
      </div>
    </section>
  );
}
