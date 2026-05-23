import React, { useRef } from "react";
import { SiteConfig } from "../../types/site";
import { useApp } from "../../context/AppContext";
import { Download, Upload, RotateCcw, Database } from "lucide-react";

export default function AdminSystemPanel({
  draft,
  onImport,
}: {
  draft: SiteConfig;
  onImport: (config: SiteConfig) => void;
}) {
  const { user, resetSiteConfig, notify, setPage } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = React.useState("");
  const [showReset, setShowReset] = React.useState(false);

  const exportConfig = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vidya-site-config-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify("Config exported");
  };

  const importFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as SiteConfig;
        onImport(parsed);
        notify("Config imported — review & publish");
      } catch {
        notify("Invalid JSON file", "error");
      }
    };
    reader.readAsText(file);
  };

  const doReset = async () => {
    if (!user) return;
    try {
      await resetSiteConfig(user.username, password);
      setShowReset(false);
      notify("Site reset to defaults");
      setPage("admin");
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : "Failed", "error");
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div className="rounded-xl border border-white/[0.08] p-5 space-y-3">
        <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-wider">
          <Database className="w-4 h-4" />
          System info
        </div>
        <p className="text-sm">
          Config version: <strong className="text-cyan-400">v{draft.version}</strong>
        </p>
        <p className="text-sm text-white/50">
          Last updated: {new Date(draft.updatedAt).toLocaleString()}
        </p>
        <p className="text-sm text-white/50">Preset: {draft.themePreset}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={exportConfig}
          className="px-4 py-2.5 rounded-xl border border-white/10 text-sm cursor-pointer flex items-center gap-2 hover:bg-white/5"
        >
          <Download className="w-4 h-4" /> Export JSON
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="px-4 py-2.5 rounded-xl border border-white/10 text-sm cursor-pointer flex items-center gap-2 hover:bg-white/5"
        >
          <Upload className="w-4 h-4" /> Import JSON
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) importFile(f);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => setShowReset(true)}
          className="px-4 py-2.5 rounded-xl border border-red-500/30 text-sm text-red-400 cursor-pointer flex items-center gap-2 hover:bg-red-500/10"
        >
          <RotateCcw className="w-4 h-4" /> Factory reset
        </button>
      </div>

      {showReset && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 space-y-3">
          <p className="text-sm text-red-300">This restores default design and admin settings.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="studio-input w-full px-4 py-3"
            placeholder="Owner password"
          />
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowReset(false)} className="flex-1 py-2 rounded-lg border border-white/10 text-sm cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              onClick={doReset}
              disabled={!password}
              className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-bold cursor-pointer disabled:opacity-40"
            >
              Reset all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
