import { Article, AuthorProfile } from "../types";

export function articlesForProfile(profile: AuthorProfile, articles: Article[]): Article[] {
  return articles.filter(
    (a) =>
      a.authorId === profile.id ||
      a.authorId === profile.userId ||
      a.authorName === profile.nameEn
  );
}

export function findProfileBySlug(
  slug: string,
  profiles: AuthorProfile[]
): AuthorProfile | undefined {
  return profiles.find((p) => p.slug === slug);
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
