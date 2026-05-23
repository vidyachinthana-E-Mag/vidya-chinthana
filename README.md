# Vidya Chinthana (විද්‍යා චින්තන)

Premium bilingual digital science magazine — upgraded full-stack platform.

## What's included

- **Public magazine**: Home, articles, issues, authors, about
- **Reading engine**: Scroll + flip-book, glossary highlights, share links, reading progress
- **User dashboard**: Bookmarks, in-progress articles, theme & language prefs
- **Editorial CMS**: Drafts, preview, AI outline/translate, glossary, issue compiler
- **API**: Search, stats, per-article fetch, Gemini AI assist
- **PWA-ready**: manifest, icons, mobile meta tags

## Quick start / ආරම්භය

**English**

```bash
npm install
cp .env.example .env   # optional: set GEMINI_API_KEY
npm run dev
```

Open **http://localhost:3000** — Vite + Express API on one port.

**සිංහල**

```bash
npm install
cp .env.example .env   # අවශ්‍ය නම් GEMINI_API_KEY එක් කරන්න
npm run dev
```

බ්‍රවුසරයෙන් **http://localhost:3000** විවෘත කරන්න. `npm run dev` මගින් සංවර්ධන සේවාදායකය (Vite + API) එකම port එකේ ධාවනය වේ.

Optional / විකල්ප: add `GEMINI_API_KEY=your_key` to `.env` for live AI features in CMS (AI outline, translate).

## Demo accounts

| User   | Password     | Role   |
|--------|--------------|--------|
| admin  | password123  | Owner  |
| editor | password123  | Editor |
| author | password123  | Author |
| reader | password123  | Reader |

## Scripts

| Command       | Description              |
|---------------|--------------------------|
| `npm run dev` | Development server       |
| `npm run build` | Production build       |
| `npm run start` | Run production server  |
| `npm run lint`  | TypeScript check       |

## Blueprint

Full specification: `Blueprint/Vidya_Chinthana_Project_Blueprint.txt`
