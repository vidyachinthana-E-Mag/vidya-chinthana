import { Article, AuthorProfile } from "../types";
import { articlesForProfile } from "./authors";

export function profileArticleStats(profile: AuthorProfile, articles: Article[]) {
  const theirs = articlesForProfile(profile, articles);
  const byCategory: Record<string, number> = {};
  for (const a of theirs) {
    byCategory[a.category] = (byCategory[a.category] ?? 0) + 1;
  }
  const totalMin = theirs.reduce((s, a) => s + a.readingTimeMin, 0);
  const featured =
    theirs.find((a) => a.status === "published") ?? theirs[0] ?? null;
  return {
    articles: theirs,
    count: theirs.length,
    totalMin,
    categories: Object.entries(byCategory).sort((a, b) => b[1] - a[1]),
    featured,
  };
}
