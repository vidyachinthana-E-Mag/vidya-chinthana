export type UserRole = "owner" | "editor" | "author" | "reader";

export type Category = "science" | "education" | "technology" | "scifi";

export interface ArticleBlock {
  id: string;
  type: "heading" | "paragraph" | "quote" | "highlight" | "image";
  valueEn: string;
  valueSi: string;
  imageCaptionEn?: string;
  imageCaptionSi?: string;
}

export type LayoutTemplate = "academic" | "scifi-neon" | "editorial-serif";

export interface Article {
  id: string;
  titleEn: string;
  titleSi: string;
  category: Category;
  summaryEn: string;
  summarySi: string;
  blocks: ArticleBlock[];
  authorId: string;
  authorName: string;
  publishedAt?: string;
  readingTimeMin: number;
  coverUrl: string;
  layoutTemplate: LayoutTemplate;
  status: "draft" | "under-review" | "approved" | "published";
  version: number;
  issueId?: string;
  comments?: Array<{
    id: string;
    author: string;
    role: UserRole;
    text: string;
    timestamp: string;
  }>;
}

export interface Issue {
  id: string;
  titleEn: string;
  titleSi: string;
  volume: number;
  number: number;
  publishedAt: string;
  coverImage: string;
  descriptionEn: string;
  descriptionSi: string;
  articleIds: string[];
}

export interface GlossaryTerm {
  term: string;
  termSi: string;
  definitionEn: string;
  definitionSi: string;
  category: "physics" | "genetics" | "computing" | "space" | "general";
}

export interface AuthorProfile {
  id: string;
  slug: string;
  userId?: string;
  nameEn: string;
  nameSi: string;
  titleEn: string;
  titleSi: string;
  bioEn: string;
  bioSi: string;
  avatarUrl: string;
  coverUrl: string;
  expertise: string[];
  locationEn: string;
  locationSi: string;
  featured: boolean;
  social: {
    email: string;
    twitter: string;
    website: string;
    facebook: string;
    instagram: string;
    /** E.164 digits or full https://wa.me/ URL */
    whatsapp: string;
  };
}

