import React, { useRef, useState } from "react";
import { Upload, Link2, Loader2, X } from "lucide-react";
import { t } from "../../lib/labels";
import { Lang } from "../../lib/labels";
import { api } from "../../api/client";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  lang,
  username,
  password,
  aspect = "square",
  hint,
  variant = "default",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  lang: Lang;
  username?: string;
  password?: string;
  aspect?: "square" | "wide";
  hint?: string;
  variant?: "default" | "studio";
}) {
  const isStudio = variant === "studio";
  const inputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError(t(lang, "Images only", "ඡායාරූප පමණි"));
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError(t(lang, "Max 8MB", "උපරිම 8MB"));
      return;
    }
    if (!username || !password) {
      setError(t(lang, "Enter password below first", "පළමුව password එක් කරන්න"));
      return;
    }
    setUploading(true);
    setError("");
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const { url } = await api.uploadImage(dataUrl, username, password, file.name);
      onChange(url);
      setUrlInput("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) void uploadFile(file);
  };

  const applyUrl = () => {
    const u = urlInput.trim();
    if (u) {
      onChange(u);
      setUrlInput("");
    }
  };

  const previewClass =
    aspect === "wide" ? "w-full h-28 rounded-xl object-cover" : "w-28 h-28 rounded-2xl object-cover";

  const labelClass = isStudio
    ? "text-[10px] font-semibold uppercase tracking-widest text-cyan-400/80"
    : "text-xs text-muted font-medium";
  const dropClass = isStudio
    ? `border-2 border-dashed rounded-xl p-4 text-center transition-colors ${
        dragOver ? "border-cyan-500/50 bg-cyan-500/10" : "border-white/15"
      }`
    : `border-2 border-dashed rounded-xl p-5 text-center transition-colors ${
        dragOver
          ? "border-[var(--vc-accent)] bg-[color-mix(in_srgb,var(--vc-accent)_8%,transparent)]"
          : "border-[var(--vc-border)]"
      }`;
  const inputClass = isStudio ? "studio-input w-full px-2 py-2 text-xs" : "input-premium flex-1 text-xs";
  const uploadBtnClass = isStudio
    ? "px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 cursor-pointer"
    : "btn-primary text-xs py-2 px-4";
  const mutedClass = isStudio ? "text-white/40" : "text-muted";

  return (
    <div className="space-y-3">
      <span className={labelClass}>{label}</span>
      {value && (
        <div className="relative inline-block">
          <img src={value} alt="" className={previewClass} referrerPolicy="no-referrer" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white cursor-pointer shadow"
            aria-label="Remove"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={dropClass}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void uploadFile(f);
            e.target.value = "";
          }}
        />
        {uploading ? (
          <Loader2 className={`w-6 h-6 mx-auto animate-spin ${mutedClass}`} />
        ) : (
          <>
            <Upload className={`w-6 h-6 mx-auto mb-2 ${mutedClass}`} />
            <p className={`text-xs mb-3 ${mutedClass}`}>
              {t(lang, "Drag & drop or choose file", "ඇදලා දාන්න හෝ file එක් කරන්න")}
            </p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className={uploadBtnClass}
            >
              {t(lang, "Upload image", "ඡායාරූපය යවන්න")}
            </button>
          </>
        )}
      </div>
      <div className="flex gap-2">
        <input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder={t(lang, "Or paste image URL…", "URL එක් කරන්න…")}
          className={inputClass}
        />
        <button
          type="button"
          onClick={applyUrl}
          className={isStudio ? "p-2 rounded-lg border border-white/10 hover:bg-white/10 cursor-pointer shrink-0" : "btn-ghost text-xs shrink-0"}
        >
          <Link2 className="w-3.5 h-3.5" />
        </button>
      </div>
      {hint && <p className={`text-[10px] ${mutedClass}`}>{hint}</p>}
      {error && <p className="text-[10px] text-red-500">{error}</p>}
    </div>
  );
}
