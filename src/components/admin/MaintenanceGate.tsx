import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { t } from "../../lib/labels";
import { Wrench } from "lucide-react";
import Header from "../layout/Header";
import AuthModal from "../auth/AuthModal";

export default function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const { siteConfig, user, lang, page } = useApp();
  const [authOpen, setAuthOpen] = useState(false);
  const f = siteConfig.admin.features;

  const staff =
    user?.role === "owner" || user?.role === "editor" || user?.role === "author";
  const staffPages = ["cms", "dashboard", "admin", "studio", "read"].includes(page);
  const blocked = f.maintenanceMode && !staff && !staffPages;

  if (!blocked) return <>{children}</>;

  return (
    <>
      <Header onAuthOpen={() => setAuthOpen(true)} />
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-6">
          <div
            className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center"
            style={{ background: "color-mix(in srgb, var(--vc-accent) 20%, transparent)" }}
          >
            <Wrench className="w-8 h-8" style={{ color: "var(--vc-accent)" }} />
          </div>
          <h1 className="font-display text-3xl font-medium">
            {t(lang, "Maintenance", "නඩත්තුව")}
          </h1>
          <p className="text-muted leading-relaxed">
            {t(lang, f.maintenanceMessageEn, f.maintenanceMessageSi)}
          </p>
          {!user && (
            <button type="button" onClick={() => setAuthOpen(true)} className="btn-primary">
              {t(lang, "Staff sign in", "කාර්ය මණ්ඩලය පිවිසෙන්න")}
            </button>
          )}
        </div>
      </div>
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  );
}
