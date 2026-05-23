export function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const KEYS = {
  user: "vidya_current_user",
  theme: "vidya_theme",
  lang: "vidya_lang",
  bookmarks: "bookmarks_vidya",
  completed: "completed_articles_vidya",
  readProgress: "read_progress_vidya",
  lastArticle: "last_read_vidya",
} as const;
