// url=https://www.figma.com/design/REPLACE_FILE_KEY/Vidya-Chinthana?node-id=0-0
// source=src/components/magazine/MagazineFront.tsx
// component=MagazineFront
import figma from "figma";
const instance = figma.selectedInstance;

const leadTitle = instance.getString("Lead title EN") ?? "Lead story title";

export default {
  id: "magazine-front",
  example: figma.code`<MagazineFront
  articles={[
    {
      id: "art-1",
      titleEn: ${JSON.stringify(leadTitle)},
      titleSi: "ප්‍රධාන ලිපිය",
      category: "science",
      summaryEn: "Lead summary",
      summarySi: "සාරාංශය",
      authorId: "auth-1",
      authorName: "Contributor",
      readingTimeMin: 9,
      coverUrl: "https://picsum.photos/seed/lead/1200/800",
      layoutTemplate: "editorial-serif",
      status: "published",
      version: 1,
      blocks: [],
    },
  ]}
  onOpen={() => {}}
/>`,
  imports: [
    'import MagazineFront from "./MagazineFront"',
    'import { Article } from "../../types"',
  ],
};
