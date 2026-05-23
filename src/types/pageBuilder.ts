/** Studio page builder — custom pages & draggable blocks */

export type PageBlockType =
  | "hero"
  | "richtext"
  | "image"
  | "spacer"
  | "cta"
  | "article_grid"
  | "divider"
  | "columns";

export interface PageBlock {
  id: string;
  type: PageBlockType;
  visible: boolean;
  props: Record<string, string | boolean | number>;
}

export interface CustomPage {
  id: string;
  slug: string;
  titleEn: string;
  titleSi: string;
  showInNav: boolean;
  blocks: PageBlock[];
}

export interface SiteTypography {
  display: string;
  body: string;
  ui: string;
  article: string;
}

export const DEFAULT_TYPOGRAPHY: SiteTypography = {
  display: '"Fraunces", "Instrument Serif", Georgia, serif',
  body: '"Newsreader", "Lora", Georgia, serif',
  ui: '"Outfit", system-ui, sans-serif',
  article: '"Newsreader", "Lora", Georgia, serif',
};

export function newBlock(type: PageBlockType): PageBlock {
  const id = `blk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const defaults: Record<PageBlockType, Record<string, string | boolean | number>> = {
    hero: {
      headlineEn: "New page headline",
      headlineSi: "නව ශීර්ෂය",
      subEn: "Add your story here.",
      subSi: "ඔබේ අන්තර්ගතය.",
      align: "center",
    },
    richtext: {
      bodyEn: "Write your content in Studio — bilingual EN/SI.",
      bodySi: "Studio එකෙන් අන්තර්ගතය සංස්කරණය කරන්න.",
    },
    image: { url: "", altEn: "Image", captionEn: "" },
    spacer: { height: 48 },
    cta: {
      labelEn: "Learn more",
      labelSi: "තව දැනගන්න",
      link: "/home",
      style: "primary",
    },
    article_grid: { count: 6, category: "all" },
    divider: { style: "rule" },
    columns: {
      leftEn: "Left column text.",
      rightEn: "Right column text.",
      leftSi: "",
      rightSi: "",
    },
  };
  return { id, type, visible: true, props: { ...defaults[type] } };
}

export function newCustomPage(): CustomPage {
  const id = `pg-${Date.now()}`;
  return {
    id,
    slug: `page-${id.slice(-6)}`,
    titleEn: "New Page",
    titleSi: "නව පිටුව",
    showInNav: true,
    blocks: [newBlock("hero"), newBlock("richtext")],
  };
}
