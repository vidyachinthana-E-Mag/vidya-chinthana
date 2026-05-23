import { Article, AuthorProfile, GlossaryTerm, Issue } from "../types";
import { SiteConfig } from "../types/site";

export type SessionUser = {
  id: string;
  username: string;
  name: string;
  role: "owner" | "editor" | "author" | "reader";
};

export type AdminUser = {
  id: string;
  username: string;
  name: string;
  role: SessionUser["role"];
  createdAt: string;
};

export type PlatformStats = {
  articles: number;
  drafts: number;
  issues: number;
  glossary: number;
  categories: Record<string, number>;
};

export const api = {
  async getSiteConfig(): Promise<SiteConfig> {
    const r = await fetch("/api/site-config", { cache: "no-store" });
    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      throw new Error((data as { error?: string }).error || `Site config failed (${r.status})`);
    }
    return r.json();
  },
  async saveSiteConfig(
    config: SiteConfig,
    username: string,
    password: string
  ): Promise<SiteConfig> {
    const r = await fetch("/api/site-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config, username, password }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Save failed");
    return data;
  },
  async resetSiteConfig(username: string, password: string): Promise<SiteConfig> {
    const r = await fetch("/api/site-config/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Reset failed");
    return data;
  },
  async getStats(): Promise<PlatformStats> {
    const r = await fetch("/api/stats");
    return r.json();
  },
  async searchArticles(q: string): Promise<Article[]> {
    const r = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    return r.json();
  },
  async getArticle(id: string): Promise<Article> {
    const r = await fetch(`/api/articles/${id}`);
    if (!r.ok) throw new Error("Article not found");
    return r.json();
  },
  async getArticles(): Promise<Article[]> {
    const r = await fetch("/api/articles");
    return r.json();
  },
  async getDrafts(): Promise<Article[]> {
    const r = await fetch("/api/articles/drafts");
    return r.json();
  },
  async getIssues(): Promise<Issue[]> {
    const r = await fetch("/api/issues");
    return r.json();
  },
  async getGlossary(): Promise<GlossaryTerm[]> {
    const r = await fetch("/api/glossary");
    return r.json();
  },
  async getProfiles(): Promise<AuthorProfile[]> {
    const r = await fetch("/api/profiles");
    return r.json();
  },
  async saveProfile(profile: AuthorProfile): Promise<AuthorProfile> {
    const r = await fetch("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Failed");
    return data;
  },
  async uploadImage(
    dataUrl: string,
    username: string,
    password: string,
    filename?: string
  ): Promise<{ url: string }> {
    const r = await fetch("/api/upload/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, dataUrl, filename }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Upload failed");
    return data;
  },
  async listUploads(
    username: string,
    password: string
  ): Promise<{ name: string; url: string; uploadedAt: string }[]> {
    const q = new URLSearchParams({ username, password });
    const r = await fetch(`/api/uploads?${q}`);
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Failed");
    return data;
  },
  async saveMyProfile(
    profile: AuthorProfile,
    username: string,
    password: string
  ): Promise<AuthorProfile> {
    const r = await fetch("/api/profiles/mine", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, profile }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Failed to save profile");
    return data;
  },
  async deleteProfile(id: string): Promise<void> {
    const r = await fetch(`/api/profiles/${id}`, { method: "DELETE" });
    if (!r.ok) {
      const data = await r.json();
      throw new Error(data.error || "Failed");
    }
  },
  async deleteIssue(id: string): Promise<void> {
    const r = await fetch(`/api/issues/${id}`, { method: "DELETE" });
    if (!r.ok) {
      const data = await r.json();
      throw new Error(data.error || "Failed");
    }
  },
  async login(username: string, password: string) {
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Login failed");
    return data.user as SessionUser;
  },
  async register(username: string, password: string, name: string) {
    const r = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, name }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Registration failed");
    return data.user as SessionUser;
  },
  async saveArticle(article: Article) {
    const r = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(article),
    });
    return r.json();
  },
  async deleteArticle(id: string) {
    await fetch(`/api/articles/${id}`, { method: "DELETE" });
  },
  async setArticleStatus(id: string, status: Article["status"]) {
    const r = await fetch(`/api/articles/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    return r.json();
  },
  async addComment(id: string, author: string, role: string, text: string) {
    await fetch(`/api/articles/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author, role, text }),
    });
  },
  async saveIssue(issue: Issue) {
    const r = await fetch("/api/issues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(issue),
    });
    return r.json();
  },
  async saveGlossary(term: GlossaryTerm) {
    const r = await fetch("/api/glossary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(term),
    });
    return r.json();
  },
  async deleteGlossary(term: string) {
    await fetch(`/api/glossary/${encodeURIComponent(term)}`, {
      method: "DELETE",
    });
  },
  async listAdminUsers(username: string, password: string): Promise<AdminUser[]> {
    const r = await fetch("/api/admin/users/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Failed");
    return data;
  },
  async updateAdminUser(
    id: string,
    updates: { role?: SessionUser["role"]; name?: string },
    username: string,
    password: string
  ): Promise<AdminUser> {
    const r = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...updates, username, password }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Failed");
    return data;
  },
  async geminiAssist(body: Record<string, string>) {
    const r = await fetch("/api/gemini/assist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "AI request failed");
    return data.result as string;
  },
};
