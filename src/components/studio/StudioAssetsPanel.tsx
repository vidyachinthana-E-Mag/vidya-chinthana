import { useCallback, useEffect, useState } from "react";
import { api } from "../../api/client";
import ImageUploadField from "../ui/ImageUploadField";
import { Copy, RefreshCw, Image as ImageIcon } from "lucide-react";

export default function StudioAssetsPanel({
  username,
  password,
  onPickUrl,
}: {
  username: string;
  password: string;
  onPickUrl: (url: string) => void;
}) {
  const [assets, setAssets] = useState<{ name: string; url: string; uploadedAt: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [logoTarget, setLogoTarget] = useState("");

  const refresh = useCallback(async () => {
    if (!password) return;
    setLoading(true);
    try {
      const list = await api.listUploads(username, password);
      setAssets(list);
    } catch {
      setAssets([]);
    } finally {
      setLoading(false);
    }
  }, [username, password]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <div className="space-y-5">
      <ImageUploadField
        label="Upload new asset"
        value={logoTarget}
        onChange={(url) => {
          setLogoTarget(url);
          void refresh();
        }}
        lang="EN"
        username={username}
        password={password}
        aspect="wide"
        variant="studio"
        hint="PNG, JPG, WebP up to 8MB"
      />

      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
          Asset library ({assets.length})
        </span>
        <button
          type="button"
          onClick={() => void refresh()}
          className="p-1.5 rounded hover:bg-white/10 cursor-pointer text-white/50"
          title="Refresh"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
        {assets.length === 0 ? (
          <p className="col-span-2 text-xs text-white/35 py-4 text-center">No uploads yet</p>
        ) : (
          assets.map((a) => (
            <button
              key={a.name}
              type="button"
              onClick={() => onPickUrl(a.url)}
              className="group rounded-lg overflow-hidden border border-white/10 hover:border-cyan-500/40 cursor-pointer text-left"
            >
              <img
                src={a.url}
                alt=""
                className="w-full h-20 object-cover group-hover:opacity-90"
                referrerPolicy="no-referrer"
              />
              <div className="p-1.5 flex items-center justify-between gap-1">
                <span className="text-[8px] text-white/40 truncate flex-1">{a.name}</span>
                <Copy
                  className="w-3 h-3 text-cyan-400 opacity-0 group-hover:opacity-100 shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    void navigator.clipboard.writeText(
                      `${window.location.origin}${a.url}`
                    );
                  }}
                />
              </div>
            </button>
          ))
        )}
      </div>

      <p className="text-[10px] text-white/35 flex items-start gap-1.5">
        <ImageIcon className="w-3 h-3 shrink-0 mt-0.5" />
        Click an asset to copy URL into the focused media field (logo / hero).
      </p>
    </div>
  );
}

function StudioField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
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
