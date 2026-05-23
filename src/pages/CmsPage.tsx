import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { api } from "../api/client";
import { t } from "../lib/labels";
import { Article, ArticleBlock, Category, GlossaryTerm, Issue, LayoutTemplate } from "../types";
import { Plus, Trash2, Sparkles, Lock, Eye, Pencil, Languages } from "lucide-react";

export default function CmsPage() {
  const {
    lang,
    user,
    drafts,
    articles,
    glossary,
    issues,
    saveArticle,
    deleteArticle,
    setStatus,
    saveGlossary,
    deleteGlossary,
    saveIssue,
    setPage,
  } = useApp();

  const [tab, setTab] = useState<"drafts" | "compose" | "glossary" | "issues">("drafts");
  const [composeView, setComposeView] = useState<"edit" | "preview">("edit");
  const [editing, setEditing] = useState<Article | null>(null);

  const [titleEn, setTitleEn] = useState("");
  const [titleSi, setTitleSi] = useState("");
  const [category, setCategory] = useState<Category>("science");
  const [summaryEn, setSummaryEn] = useState("");
  const [summarySi, setSummarySi] = useState("");
  const [layoutTemplate, setLayoutTemplate] = useState<LayoutTemplate>("academic");
  const [blocks, setBlocks] = useState<ArticleBlock[]>([
    { id: "b1", type: "paragraph", valueEn: "", valueSi: "" },
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  const [glTerm, setGlTerm] = useState("");
  const [glTermSi, setGlTermSi] = useState("");
  const [glDefEn, setGlDefEn] = useState("");
  const [glDefSi, setGlDefSi] = useState("");

  const [issueTitleEn, setIssueTitleEn] = useState("");
  const [issueTitleSi, setIssueTitleSi] = useState("");
  const [selectedArts, setSelectedArts] = useState<string[]>([]);

  if (!user || user.role === "reader") {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <Lock className="w-12 h-12 text-[#c45c26] mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold mb-2">
          {t(lang, "CMS Restricted", "CMS සීමා කළ")}
        </h2>
        <p className="text-sm text-[#5c5c6e] mb-6">
          {t(lang, "Authors and editors only.", "ලේඛක සහ සංස්කාරකයින් පමණි.")}
        </p>
        <button
          onClick={() => setPage("home")}
          className="px-6 py-2.5 rounded-lg bg-[#c45c26] text-white text-sm font-semibold cursor-pointer"
        >
          {t(lang, "Go Home", "මුල් පිටුව")}
        </button>
      </div>
    );
  }

  const loadDraft = (d: Article) => {
    setEditing(d);
    setTitleEn(d.titleEn);
    setTitleSi(d.titleSi);
    setCategory(d.category);
    setSummaryEn(d.summaryEn);
    setSummarySi(d.summarySi);
    setLayoutTemplate(d.layoutTemplate);
    setBlocks(d.blocks.length ? d.blocks : [{ id: "b1", type: "paragraph", valueEn: "", valueSi: "" }]);
    setTab("compose");
  };

  const resetForm = () => {
    setEditing(null);
    setTitleEn("");
    setTitleSi("");
    setSummaryEn("");
    setSummarySi("");
    setBlocks([{ id: "b1", type: "paragraph", valueEn: "", valueSi: "" }]);
  };

  const handleSave = async (asDraft = true) => {
    const article: Article = {
      id: editing?.id || `art-${Date.now()}`,
      titleEn,
      titleSi,
      category,
      summaryEn,
      summarySi,
      blocks,
      authorId: user.id,
      authorName: user.name,
      readingTimeMin: Math.max(3, Math.ceil(blocks.length * 1.5)),
      coverUrl: editing?.coverUrl || `https://picsum.photos/seed/${Date.now()}/800/600`,
      layoutTemplate,
      status: asDraft ? "draft" : editing?.status || "draft",
      version: (editing?.version || 0) + 1,
      comments: editing?.comments,
    };
    await saveArticle(article);
    resetForm();
    setTab("drafts");
  };

  const runAiOutline = async () => {
    if (!titleEn.trim()) return;
    setAiLoading(true);
    try {
      const result = await api.geminiAssist({
        action: "outline",
        prompt: titleEn,
      });
      const newBlocks: ArticleBlock[] = result
        .split("\n")
        .filter((l) => l.trim())
        .slice(0, 8)
        .map((line, i) => ({
          id: `ai-${i}`,
          type: line.startsWith("#") ? "heading" as const : "paragraph" as const,
          valueEn: line.replace(/^#+\s*/, ""),
          valueSi: "",
        }));
      if (newBlocks.length) setBlocks(newBlocks);
    } finally {
      setAiLoading(false);
    }
  };

  const compileIssue = async () => {
    if (!issueTitleEn || !issueTitleSi || !selectedArts.length) return;
    const issue: Issue = {
      id: `issue-${Date.now()}`,
      titleEn: issueTitleEn,
      titleSi: issueTitleSi,
      volume: 1,
      number: issues.length + 1,
      publishedAt: new Date().toLocaleString("en-US", { month: "long", year: "numeric" }),
      coverImage: `https://picsum.photos/seed/issue${Date.now()}/1200/800`,
      descriptionEn: "Compiled magazine edition.",
      descriptionSi: "සංකලන කළ සඟරා කලාපය.",
      articleIds: selectedArts,
    };
    await saveIssue(issue);
    setIssueTitleEn("");
    setIssueTitleSi("");
    setSelectedArts([]);
  };

  return (
    <div className="page-enter max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl font-bold mb-6">
        {t(lang, "Editorial Workspace", "සංස්කාරක වැඩබිම")}
      </h1>

      <div className="flex flex-wrap gap-2 mb-8 border-b border-black/8 dark:border-white/10 pb-4">
        {(["drafts", "compose", "glossary", "issues"] as const).map((tname) => {
          if (tname === "issues" && user.role !== "owner" && user.role !== "editor") return null;
          return (
            <button
              key={tname}
              onClick={() => setTab(tname)}
              className={`px-4 py-2 text-sm rounded-lg cursor-pointer capitalize ${
                tab === tname
                  ? "bg-[#c45c26] text-white font-semibold"
                  : "text-[#5c5c6e] hover:bg-black/5"
              }`}
            >
              {tname}
            </button>
          );
        })}
      </div>

      {tab === "drafts" && (
        <div className="space-y-3">
          <button
            onClick={() => {
              resetForm();
              setTab("compose");
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a24] dark:bg-[#e8e4df] text-white dark:text-[#0c0c10] text-sm font-semibold cursor-pointer mb-4"
          >
            <Plus className="w-4 h-4" />
            {t(lang, "New Draft", "නව කෙටුම්පත")}
          </button>
          {drafts.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between p-4 rounded-xl border border-black/8 dark:border-white/10"
            >
              <div>
                <p className="font-semibold text-sm">{d.titleEn || "(Untitled)"}</p>
                <p className="text-[10px] text-[#5c5c6e] capitalize">{d.status}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => loadDraft(d)} className="text-xs text-[#c45c26] cursor-pointer font-semibold">
                  Edit
                </button>
                {(user.role === "editor" || user.role === "owner") && (
                  <button
                    onClick={() => setStatus(d.id, "published")}
                    className="text-xs text-emerald-600 cursor-pointer font-semibold"
                  >
                    Publish
                  </button>
                )}
                <button onClick={() => deleteArticle(d.id)} className="text-xs text-red-500 cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "compose" && (
        <div className="space-y-4 max-w-3xl">
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setComposeView("edit")}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg cursor-pointer ${
                composeView === "edit" ? "bg-[#c45c26] text-white" : "border border-black/10"
              }`}
            >
              <Pencil className="w-3.5 h-3.5" /> Edit
            </button>
            <button
              onClick={() => setComposeView("preview")}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg cursor-pointer ${
                composeView === "preview" ? "bg-[#c45c26] text-white" : "border border-black/10"
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
          </div>

          {composeView === "preview" ? (
            <article className="p-8 rounded-2xl border border-black/8 dark:border-white/10 bg-white dark:bg-[#14141c]">
              <h1 className="font-display text-3xl font-bold">{titleEn || "Untitled"}</h1>
              {titleSi && <p className="italic text-[#5c5c6e] mt-2">{titleSi}</p>}
              <p className="text-sm text-[#5c5c6e] mt-4">{summaryEn}</p>
              <hr className="my-8 border-black/10" />
              {blocks.map((b) => (
                <div key={b.id} className="mb-6">
                  {b.type === "heading" && <h2 className="font-display text-xl font-bold">{b.valueEn}</h2>}
                  {b.type === "quote" && <blockquote className="border-l-4 border-[#c45c26] pl-4 italic">{b.valueEn}</blockquote>}
                  {b.type === "highlight" && <div className="p-4 bg-[#c45c26]/10 rounded-lg">{b.valueEn}</div>}
                  {b.type === "paragraph" && <p className="font-serif leading-relaxed">{b.valueEn}</p>}
                  {b.valueSi && <p className="text-sm italic text-[#5c5c6e] mt-2">{b.valueSi}</p>}
                </div>
              ))}
            </article>
          ) : (
          <>
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="Title (English)"
              className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-sm"
            />
            <input
              value={titleSi}
              onChange={(e) => setTitleSi(e.target.value)}
              placeholder="ශීර්ෂය (සිංහල)"
              className="px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-sm"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-sm"
          >
            <option value="science">Science</option>
            <option value="education">Education</option>
            <option value="technology">Technology</option>
            <option value="scifi">Sci-Fi</option>
          </select>
          <textarea
            value={summaryEn}
            onChange={(e) => setSummaryEn(e.target.value)}
            placeholder="Summary (EN)"
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-sm resize-none"
          />
          <button
            onClick={runAiOutline}
            disabled={aiLoading}
            className="flex items-center gap-2 text-sm text-[#c45c26] font-semibold cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {aiLoading ? "Generating..." : "AI Outline"}
          </button>
          {blocks.map((b, i) => (
            <div key={b.id} className="p-4 rounded-xl border border-black/8 dark:border-white/10 space-y-2">
              <select
                value={b.type}
                onChange={(e) => {
                  const next = [...blocks];
                  next[i] = { ...b, type: e.target.value as ArticleBlock["type"] };
                  setBlocks(next);
                }}
                className="text-xs rounded-lg border border-black/10 px-2 py-1 bg-transparent"
              >
                <option value="paragraph">Paragraph</option>
                <option value="heading">Heading</option>
                <option value="quote">Quote</option>
                <option value="highlight">Highlight</option>
              </select>
              <textarea
                value={b.valueEn}
                onChange={(e) => {
                  const next = [...blocks];
                  next[i] = { ...b, valueEn: e.target.value };
                  setBlocks(next);
                }}
                placeholder="English"
                rows={3}
                className="w-full text-sm bg-transparent resize-none"
              />
              <textarea
                value={b.valueSi}
                onChange={(e) => {
                  const next = [...blocks];
                  next[i] = { ...b, valueSi: e.target.value };
                  setBlocks(next);
                }}
                placeholder="සිංහල"
                rows={2}
                className="w-full text-sm bg-transparent resize-none"
              />
              {b.valueEn.trim() && (
                <button
                  type="button"
                  disabled={aiLoading}
                  onClick={async () => {
                    setAiLoading(true);
                    try {
                      const tr = await api.geminiAssist({
                        action: "translate",
                        text: b.valueEn,
                        targetLang: "Sinhala",
                      });
                      const next = [...blocks];
                      next[i] = { ...b, valueSi: tr };
                      setBlocks(next);
                    } finally {
                      setAiLoading(false);
                    }
                  }}
                  className="flex items-center gap-1 text-[10px] text-[#c45c26] font-semibold cursor-pointer"
                >
                  <Languages className="w-3 h-3" />
                  AI → Sinhala
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() =>
              setBlocks([
                ...blocks,
                { id: `b-${Date.now()}`, type: "paragraph", valueEn: "", valueSi: "" },
              ])
            }
            className="text-xs text-[#c45c26] cursor-pointer font-semibold"
          >
            + Add block
          </button>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => handleSave(true)}
              className="px-6 py-2.5 rounded-lg bg-[#c45c26] text-white text-sm font-semibold cursor-pointer"
            >
              {t(lang, "Save Draft", "කෙටුම්පත සුරකින්න")}
            </button>
          </div>
          </>
          )}
        </div>
      )}

      {tab === "glossary" && (
        <div className="max-w-xl space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input value={glTerm} onChange={(e) => setGlTerm(e.target.value)} placeholder="Term" className="px-3 py-2 rounded-lg border border-black/10 text-sm bg-transparent" />
            <input value={glTermSi} onChange={(e) => setGlTermSi(e.target.value)} placeholder="සිංහල" className="px-3 py-2 rounded-lg border border-black/10 text-sm bg-transparent" />
          </div>
          <textarea value={glDefEn} onChange={(e) => setGlDefEn(e.target.value)} placeholder="Definition EN" rows={2} className="w-full px-3 py-2 rounded-lg border border-black/10 text-sm bg-transparent resize-none" />
          <button
            onClick={() => {
              saveGlossary({ term: glTerm, termSi: glTermSi, definitionEn: glDefEn, definitionSi: glDefSi, category: "general" });
              setGlTerm(""); setGlTermSi(""); setGlDefEn(""); setGlDefSi("");
            }}
            className="px-4 py-2 rounded-lg bg-[#c45c26] text-white text-sm cursor-pointer"
          >
            Add term
          </button>
          <div className="space-y-2 mt-6">
            {glossary.map((g) => (
              <div key={g.term} className="flex justify-between p-3 rounded-lg border border-black/8 text-sm">
                <span><strong>{g.term}</strong> — {g.termSi}</span>
                <button onClick={() => deleteGlossary(g.term)} className="text-red-500 cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "issues" && (
        <div className="max-w-xl space-y-4">
          <input value={issueTitleEn} onChange={(e) => setIssueTitleEn(e.target.value)} placeholder="Issue title EN" className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm bg-transparent" />
          <input value={issueTitleSi} onChange={(e) => setIssueTitleSi(e.target.value)} placeholder="කලාප ශීර්ෂය" className="w-full px-4 py-3 rounded-xl border border-black/10 text-sm bg-transparent" />
          <p className="text-xs text-[#5c5c6e]">Select published articles:</p>
          {articles.map((a) => (
            <label key={a.id} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={selectedArts.includes(a.id)}
                onChange={(e) => {
                  setSelectedArts((prev) =>
                    e.target.checked ? [...prev, a.id] : prev.filter((id) => id !== a.id)
                  );
                }}
              />
              {a.titleEn}
            </label>
          ))}
          <button onClick={compileIssue} className="px-6 py-2.5 rounded-lg bg-[#c45c26] text-white text-sm font-semibold cursor-pointer">
            {t(lang, "Compile Issue", "කලාපය සංකලනය")}
          </button>
        </div>
      )}
    </div>
  );
}
