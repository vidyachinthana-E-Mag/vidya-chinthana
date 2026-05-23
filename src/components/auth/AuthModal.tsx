import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { t } from "../../lib/labels";
import { X } from "lucide-react";

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const { lang, login, register, siteConfig } = useApp();
  const allowRegister = siteConfig.admin.features.allowRegistration;
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") await login(username, password);
      else await register(username, password, name);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white dark:bg-[#14141c] border border-black/10 dark:border-white/10 shadow-2xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold">
              {mode === "login"
                ? t(lang, "Sign In", "පිවිසෙන්න")
                : t(lang, "Register", "ලියාපදිංචි වන්න")}
            </h2>
            <p className="text-xs text-[#5c5c6e] mt-1">Vidya Chinthana</p>
          </div>
          <button onClick={onClose} className="p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
            {error}
          </p>
        )}

        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t(lang, "Full name", "සම්පූර්ණ නම")}
              required
              className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-sm"
            />
          )}
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t(lang, "Username", "පරිශීලක නාමය")}
            required
            className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-sm"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t(lang, "Password", "මුරපදය")}
            required
            className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#c45c26] text-white font-semibold text-sm cursor-pointer hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "..." : mode === "login" ? t(lang, "Sign In", "පිවිසෙන්න") : t(lang, "Create Account", "ගිණුම සාදන්න")}
          </button>
        </form>

        {allowRegister ? (
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="w-full mt-4 text-xs text-muted cursor-pointer hover:opacity-80"
          >
            {mode === "login"
              ? t(lang, "Need an account? Register", "ගිණුමක් නැද්ද? ලියාපදිංචි වන්න")
              : t(lang, "Have an account? Sign in", "ගිණුමක් තිබේද? පිවිසෙන්න")}
          </button>
        ) : (
          mode === "register" && (
            <p className="mt-4 text-xs text-center text-muted">
              {t(lang, "Registration is closed.", "ලියාපදිංචිය වසා ඇත.")}
            </p>
          )
        )}

        <p className="mt-6 text-[10px] text-center text-[#5c5c6e]">
          Demo: admin / editor / author / reader — password123
        </p>
      </div>
    </div>
  );
}
