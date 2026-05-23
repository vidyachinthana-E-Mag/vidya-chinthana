import { SiteConfig } from "../../types/site";

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
      <Tag value={en} onChange={(e) => onEn(e.target.value)} className="studio-input w-full px-2 py-2 text-xs" rows={multiline ? 2 : undefined} placeholder="EN" />
      <Tag value={si} onChange={(e) => onSi(e.target.value)} className="studio-input w-full px-2 py-2 text-xs" rows={multiline ? 2 : undefined} placeholder="SI" />
    </div>
  );
}

export default function StudioFooterPanel({
  draft,
  onPatch,
}: {
  draft: SiteConfig;
  onPatch: (fn: (c: SiteConfig) => SiteConfig) => void;
}) {
  const social = draft.admin.social;

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-[10px] text-white/50 leading-relaxed">
        <p className="font-bold text-cyan-400/80 uppercase tracking-widest mb-2">Live preview</p>
        <p className="text-white/70 font-display text-sm">{draft.branding.siteNameEn}</p>
        <p className="mt-1 line-clamp-2">{draft.footer.textEn}</p>
      </div>

      <div className="space-y-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-cyan-400/80">Footer copy</span>
        <BiInput
          en={draft.footer.textEn}
          si={draft.footer.textSi}
          onEn={(v) => onPatch((c) => { c.footer.textEn = v; return c; })}
          onSi={(v) => onPatch((c) => { c.footer.textSi = v; return c; })}
          multiline
        />
      </div>

      <div className="space-y-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-cyan-400/80">Contact email</span>
        <input
          value={social.contactEmail}
          onChange={(e) => onPatch((c) => { c.admin.social.contactEmail = e.target.value; return c; })}
          className="studio-input w-full px-2 py-2 text-xs"
          placeholder="hello@vidya.lk"
        />
      </div>

      {(["twitter", "facebook", "instagram", "youtube"] as const).map((key) => (
        <div key={key} className="space-y-1">
          <span className="text-[9px] text-white/35 capitalize">{key}</span>
          <input
            value={social[key] || ""}
            onChange={(e) =>
              onPatch((c) => {
                c.admin.social[key] = e.target.value;
                return c;
              })
            }
            className="studio-input w-full px-2 py-2 text-xs"
            placeholder={`https://${key}.com/...`}
          />
        </div>
      ))}
    </div>
  );
}
