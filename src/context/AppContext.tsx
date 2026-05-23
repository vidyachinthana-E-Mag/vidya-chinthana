import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, PlatformStats, SessionUser } from "../api/client";
import { Lang } from "../lib/labels";
import { KEYS, loadJson, saveJson } from "../lib/storage";
import { Article, AuthorProfile, GlossaryTerm, Issue } from "../types";
import { normalizeAuthorSocial } from "../lib/social";
import { isCategoryId } from "../lib/categories";
import { SiteConfig, DEFAULT_SITE_CONFIG } from "../types/site";
import { mergeSiteConfig } from "../lib/mergeSiteConfig";
import { applySiteTheme } from "../lib/applyTheme";
import { applySiteAdmin } from "../lib/applySiteAdmin";
import { ToastState } from "../components/ui/Toast";

export type Page =
  | "home"
  | "articles"
  | "issue"
  | "authors"
  | "about"
  | "dashboard"
  | "cms"
  | "studio"
  | "admin"
  | "profile"
  | "account"
  | "privacy"
  | "terms"
  | "read"
  | "category"
  | "issues"
  | "login"
  | "page";

type AppContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  page: Page;
  setPage: (p: Page | string) => void;
  user: SessionUser | null;
  login: (u: string, p: string) => Promise<void>;
  register: (u: string, p: string, n: string) => Promise<void>;
  logout: () => void;
  articles: Article[];
  drafts: Article[];
  issues: Issue[];
  glossary: GlossaryTerm[];
  stats: PlatformStats | null;
  refresh: () => Promise<{ articles: Article[]; drafts: Article[]; } | void>;
  search: string;
  setSearch: (s: string) => void;
  category: string;
  setCategory: (c: string) => void;
  activeIssueId: string | null;
  setActiveIssueId: (id: string | null) => void;
  openIssue: (id: string) => void;
  openCategory: (id: string) => void;
  openIssuesIndex: () => void;
  readingArticle: Article | null;
  openArticle: (a: Article) => void;
  closeArticle: () => void;
  completedIds: string[];
  toggleCompleted: (id: string) => void;
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  readProgress: Record<string, number>;
  setReadProgress: (id: string, pct: number) => void;
  lastArticleId: string | null;
  toast: ToastState;
  notify: (message: string, type?: "success" | "error" | "info") => void;
  dismissToast: () => void;
  saveArticle: (a: Article) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  setStatus: (id: string, status: Article["status"]) => Promise<void>;
  addComment: (id: string, text: string) => Promise<void>;
  saveIssue: (issue: Issue) => Promise<void>;
  saveGlossary: (t: GlossaryTerm) => Promise<void>;
  deleteGlossary: (term: string) => Promise<void>;
  deleteIssue: (id: string) => Promise<void>;
  profiles: AuthorProfile[];
  activeProfileSlug: string | null;
  activePageSlug: string | null;
  openProfile: (slug: string) => void;
  openCustomPage: (slug: string) => void;
  saveProfile: (p: AuthorProfile) => Promise<void>;
  saveMyProfile: (p: AuthorProfile, username: string, password: string) => Promise<AuthorProfile>;
  deleteProfile: (id: string) => Promise<void>;
  siteConfig: SiteConfig;
  setSiteConfigDraft: (config: SiteConfig) => void;
  saveSiteConfig: (
    config: SiteConfig,
    username: string,
    password: string
  ) => Promise<void>;
  resetSiteConfig: (username: string, password: string) => Promise<SiteConfig>;
  dataReady: boolean;
};

const AppContext = createContext<AppContextValue | null>(null);

function parseHash(): {
  page: Page;
  articleId?: string;
  profileSlug?: string;
  categoryId?: string;
  issueId?: string;
  pageSlug?: string;
} | null {
  const h = window.location.hash.replace(/^#/, "").replace(/^\//, "") || "home";
  const read = h.match(/^read\/(.+)$/);
  if (read) return { page: "read", articleId: read[1] };
  const prof = h.match(/^profile\/(.+)$/);
  if (prof) return { page: "profile", profileSlug: prof[1] };
  const cat = h.match(/^category\/(.+)$/);
  if (cat && isCategoryId(cat[1])) return { page: "category", categoryId: cat[1] };
  const customPage = h.match(/^page\/(.+)$/);
  if (customPage) return { page: "page", pageSlug: customPage[1] };
  const iss = h.match(/^issue\/(.+)$/);
  if (iss) return { page: "issue", issueId: iss[1] };
  const pages: Page[] = [
    "home",
    "articles",
    "authors",
    "about",
    "dashboard",
    "cms",
    "studio",
    "admin",
    "issue",
    "issues",
    "account",
    "privacy",
    "terms",
    "category",
    "login",
    "page",
  ];
  if (pages.includes(h as Page)) return { page: h as Page };
  return null;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(
    () => loadJson<Lang>(KEYS.lang, "BILINGUAL")
  );
  const [theme, setThemeState] = useState<"light" | "dark">(
    () => loadJson<"light" | "dark">(KEYS.theme, "dark")
  );
  const [page, setPage] = useState<Page>("home");
  const [user, setUser] = useState<SessionUser | null>(() =>
    loadJson<SessionUser | null>(KEYS.user, null)
  );
  const [articles, setArticles] = useState<Article[]>([]);
  const [drafts, setDrafts] = useState<Article[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [glossary, setGlossary] = useState<GlossaryTerm[]>([]);
  const [profiles, setProfiles] = useState<AuthorProfile[]>([]);
  const [activeProfileSlug, setActiveProfileSlug] = useState<string | null>(null);
  const [activePageSlug, setActivePageSlug] = useState<string | null>(null);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [activeIssueId, setActiveIssueId] = useState<string | null>(null);
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>(() =>
    loadJson(KEYS.completed, [])
  );
  const [bookmarks, setBookmarks] = useState<string[]>(() =>
    loadJson(KEYS.bookmarks, [])
  );
  const [readProgress, setReadProgressState] = useState<Record<string, number>>(
    () => loadJson(KEYS.readProgress, {})
  );
  const [lastArticleId, setLastArticleId] = useState<string | null>(() =>
    loadJson(KEYS.lastArticle, null)
  );
  const [toast, setToast] = useState<ToastState>(null);
  const [dataReady, setDataReady] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);

  const notify = useCallback(
    (message: string, type: "success" | "error" | "info" = "success") => {
      setToast({ message, type });
    },
    []
  );

  const setLang = (l: Lang) => {
    setLangState(l);
    saveJson(KEYS.lang, l);
  };

  const setTheme = (t: "light" | "dark") => {
    setThemeState(t);
    saveJson(KEYS.theme, t);
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const refresh = useCallback(async () => {
    try {
      const [a, d, i, g, pr, s, site] = await Promise.all([
        api.getArticles(),
        api.getDrafts(),
        api.getIssues(),
        api.getGlossary(),
        api.getProfiles().catch(() => []),
        api.getStats().catch(() => null),
        api.getSiteConfig().catch(() => null),
      ]);
      const mergedSite = mergeSiteConfig(site ?? undefined);
      setArticles(a);
      setDrafts(d);
      setIssues(i);
      setGlossary(g);
      setProfiles(pr.map((p) => ({ ...p, social: normalizeAuthorSocial(p.social) })));
      setStats(s);
      setSiteConfig(mergedSite);
      applySiteTheme(mergedSite);
      applySiteAdmin(mergedSite, lang);
      if (mergedSite.admin.features.lockTheme) {
        setThemeState(mergedSite.admin.features.lockTheme);
        saveJson(KEYS.theme, mergedSite.admin.features.lockTheme);
      }
      if (readingArticle) {
        const updated = [...a, ...d].find((x) => x.id === readingArticle.id);
        if (updated) setReadingArticle(updated);
      }
      return { articles: a, drafts: d };
    } catch (e) {
      notify(
        e instanceof Error ? e.message : "Could not load site data",
        "error"
      );
      throw e;
    } finally {
      setDataReady(true);
    }
  }, [readingArticle, lang, notify]);

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#0c0c10" : "#c45c26");
  }, [theme]);

  useEffect(() => {
    const htmlLang = lang === "SI" ? "si" : "en";
    document.documentElement.lang = htmlLang;
    document.documentElement.setAttribute("data-lang", lang);
  }, [lang]);

  useEffect(() => {
    if (!dataReady) return;
    const parsed = parseHash();
    if (!parsed) return;
    if (parsed.page === "read" && parsed.articleId) {
      const art = articles.find((a) => a.id === parsed.articleId);
      if (art) {
        setReadingArticle(art);
        setPage("read");
      }
    } else if (parsed.page === "profile" && parsed.profileSlug) {
      setActiveProfileSlug(parsed.profileSlug);
      setPage("profile");
    } else if (parsed.page === "category" && parsed.categoryId) {
      setCategory(parsed.categoryId);
      setPage("category");
    } else if (parsed.page === "issue") {
      if (parsed.issueId) setActiveIssueId(parsed.issueId);
      setPage("issue");
    } else if (parsed.page === "page" && parsed.pageSlug) {
      setActivePageSlug(parsed.pageSlug);
      setPage("page");
    } else {
      setPage(parsed.page);
    }
  }, [dataReady, articles]);

  const setReadProgress = (id: string, pct: number) => {
    setReadProgressState((prev) => {
      const next = { ...prev, [id]: Math.min(100, Math.max(0, pct)) };
      saveJson(KEYS.readProgress, next);
      return next;
    });
  };

  const login = async (username: string, password: string) => {
    const u = await api.login(username, password);
    setUser(u);
    saveJson(KEYS.user, u);
    await refresh();
    notify(`Welcome, ${u.name}!`);
  };

  const register = async (username: string, password: string, name: string) => {
    const u = await api.register(username, password, name);
    setUser(u);
    saveJson(KEYS.user, u);
    await refresh();
    notify(`Account created. Welcome, ${u.name}!`);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(KEYS.user);
    setPage("home");
    window.location.hash = "/home";
    notify("Signed out");
  };

  const openArticle = (a: Article) => {
    setReadingArticle(a);
    setPage("read");
    setLastArticleId(a.id);
    saveJson(KEYS.lastArticle, a.id);
    window.location.hash = `/read/${a.id}`;
  };

  const closeArticle = () => {
    setReadingArticle(null);
    setPage("home");
    window.location.hash = "/home";
  };

  const openCustomPage = (slug: string) => {
    setActivePageSlug(slug);
    setPage("page");
    window.location.hash = `/page/${slug}`;
  };

  const navigate = (p: Page | string) => {
    if (typeof p === "string" && p.startsWith("page:")) {
      openCustomPage(p.slice(5));
      return;
    }
    const pageId = p as Page;
    setPage(pageId);
    if (pageId !== "profile") setActiveProfileSlug(null);
    if (pageId !== "page") setActivePageSlug(null);
    window.location.hash = `/${pageId}`;
  };

  const openProfile = (slug: string) => {
    setActiveProfileSlug(slug);
    setPage("profile");
    window.location.hash = `/profile/${slug}`;
  };

  const openCategory = (id: string) => {
    if (!isCategoryId(id)) return;
    setCategory(id);
    setPage("category");
    window.location.hash = `/category/${id}`;
  };

  const openIssuesIndex = () => {
    setPage("issues");
    window.location.hash = "/issues";
  };

  const openIssue = (id: string) => {
    setActiveIssueId(id);
    setPage("issue");
    window.location.hash = `/issue/${id}`;
  };

  const toggleCompleted = (id: string) => {
    setCompletedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      saveJson(KEYS.completed, next);
      return next;
    });
  };

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const adding = !prev.includes(id);
      const next = adding ? [...prev, id] : prev.filter((x) => x !== id);
      saveJson(KEYS.bookmarks, next);
      notify(adding ? "Bookmark saved" : "Bookmark removed");
      return next;
    });
  };

  const value = useMemo<AppContextValue>(
    () => ({
      lang,
      setLang,
      theme,
      toggleTheme,
      page,
      setPage: navigate,
      user,
      login,
      register,
      logout,
      articles,
      drafts,
      issues,
      glossary,
      stats,
      refresh,
      search,
      setSearch,
      category,
      setCategory,
      activeIssueId,
      setActiveIssueId,
      openIssue,
      openCategory,
      openIssuesIndex,
      readingArticle,
      openArticle,
      closeArticle,
      completedIds,
      toggleCompleted,
      bookmarks,
      toggleBookmark,
      readProgress,
      setReadProgress,
      lastArticleId,
      toast,
      notify,
      dismissToast: () => setToast(null),
      saveArticle: async (a) => {
        await api.saveArticle(a);
        await refresh();
        notify("Article saved");
      },
      deleteArticle: async (id) => {
        await api.deleteArticle(id);
        await refresh();
        notify("Article deleted", "info");
      },
      setStatus: async (id, status) => {
        await api.setArticleStatus(id, status);
        await refresh();
        notify(status === "published" ? "Published!" : `Status: ${status}`);
      },
      addComment: async (id, text) => {
        if (!user) return;
        await api.addComment(id, user.name, user.role, text);
        await refresh();
        notify("Comment added");
      },
      saveIssue: async (issue) => {
        await api.saveIssue(issue);
        await refresh();
        notify("Issue compiled!");
      },
      saveGlossary: async (t) => {
        await api.saveGlossary(t);
        await refresh();
        notify("Glossary term added");
      },
      deleteGlossary: async (term) => {
        await api.deleteGlossary(term);
        await refresh();
        notify("Term removed", "info");
      },
      deleteIssue: async (id) => {
        await api.deleteIssue(id);
        await refresh();
        notify("Issue deleted", "info");
      },
      profiles,
      activeProfileSlug,
      activePageSlug,
      openProfile,
      openCustomPage,
      saveProfile: async (p) => {
        await api.saveProfile(p);
        await refresh();
        notify("Profile saved");
      },
      saveMyProfile: async (p, username, password) => {
        const saved = await api.saveMyProfile(p, username, password);
        setProfiles((prev) => {
          const idx = prev.findIndex((x) => x.id === saved.id);
          if (idx === -1) return [...prev, saved];
          const next = [...prev];
          next[idx] = saved;
          return next;
        });
        if (user && saved.userId === user.id) {
          const nextUser = { ...user, name: saved.nameEn };
          setUser(nextUser);
          saveJson(KEYS.user, nextUser);
        }
        return saved;
      },
      deleteProfile: async (id) => {
        await api.deleteProfile(id);
        await refresh();
        notify("Profile deleted", "info");
      },
      siteConfig,
      setSiteConfigDraft: (config) => {
        queueMicrotask(() => {
          setSiteConfig(config);
          applySiteTheme(config);
          applySiteAdmin(config, lang);
        });
      },
      saveSiteConfig: async (config, username, password) => {
        const saved = mergeSiteConfig(await api.saveSiteConfig(config, username, password));
        setSiteConfig(saved);
        applySiteTheme(saved);
      },
      resetSiteConfig: async (username, password) => {
        const reset = mergeSiteConfig(await api.resetSiteConfig(username, password));
        setSiteConfig(reset);
        applySiteTheme(reset);
        return reset;
      },
      dataReady,
    }),
    [
      lang,
      theme,
      page,
      user,
      articles,
      drafts,
      issues,
      glossary,
      profiles,
      activeProfileSlug,
      activePageSlug,
      stats,
      refresh,
      search,
      category,
      activeIssueId,
      readingArticle,
      completedIds,
      bookmarks,
      readProgress,
      lastArticleId,
      toast,
      notify,
      siteConfig,
      dataReady,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
