import { Category } from "../types";

export type Lang = "EN" | "SI" | "BILINGUAL";

export const categoryMeta: Record<
  Category,
  { en: string; si: string; color: string }
> = {
  science: { en: "Science", si: "විද්‍යාව", color: "emerald" },
  education: { en: "Education", si: "අධ්‍යාපනය", color: "blue" },
  technology: { en: "Technology", si: "තාක්ෂණය", color: "violet" },
  scifi: { en: "Sci-Fi", si: "විද්‍යා ප්‍රබන්ධ", color: "rose" },
};

export function t(
  lang: Lang,
  en: string,
  si: string
): string {
  if (lang === "SI") return si;
  return en;
}
