// url=https://www.figma.com/design/REPLACE_FILE_KEY/Vidya-Chinthana?node-id=0-0
// source=src/components/ui/ArticleCard.tsx
// component=ArticleCard
import figma from "figma";

const instance = figma.selectedInstance;

const title = instance.getString("Title") ?? "Article title";
const category = instance.getEnum("Category", {
  Featured: "featured",
  Standard: "standard",
});
const featured = category === "featured";

export default {
  id: "article-card",
  example: figma.code`<ArticleCard
  article={article}
  lang={lang}
  featured={${featured}}
  onClick={() => openArticle(article)}
  progress={readProgress[article.id]}
/>`,
  imports: [
    'import ArticleCard from "@/src/components/ui/ArticleCard"',
    'import { useApp } from "@/src/context/AppContext"',
  ],
  metadata: {
    nestable: true,
    props: { title, featured },
  },
};
