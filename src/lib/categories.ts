import { Category } from "../types";

export type CategoryId = Category;

export const CATEGORY_IDS: CategoryId[] = [
  "science",
  "education",
  "technology",
  "scifi",
];

export function isCategoryId(id: string): id is CategoryId {
  return (CATEGORY_IDS as string[]).includes(id);
}

export const CATEGORY_CONFIG: Record<
  CategoryId,
  {
    labelEn: string;
    labelSi: string;
    descEn: string;
    descSi: string;
    accent: string;
    gradient: string;
  }
> = {
  science: {
    labelEn: "Science",
    labelSi: "විද්‍යාව",
    descEn: "Rigorous reporting on discovery, research, and the natural world.",
    descSi: "සොයාගැනීම්, පර්යේෂණ, සහ ස්වභාවික ලෝකය පිළිබඳ වාර්තා.",
    accent: "#0077ed",
    gradient: "linear-gradient(135deg, #0077ed22 0%, #5ac8fa18 50%, transparent 100%)",
  },
  education: {
    labelEn: "Education",
    labelSi: "අධ්‍යාපනය",
    descEn: "Pedagogy, policy, and learning designed for Sri Lanka and beyond.",
    descSi: "ශ්‍රී ලංකාව සහ ලෝකය සඳහා අධ්‍යාපනය, ප්‍රතිපත්ති, ඉගෙනීම.",
    accent: "#30d158",
    gradient: "linear-gradient(135deg, #30d15822 0%, #34c75918 50%, transparent 100%)",
  },
  technology: {
    labelEn: "Technology",
    labelSi: "තාක්ෂණය",
    descEn: "Engineering, AI, and digital life — explained with clarity.",
    descSi: "ඉංජිනේරු විද්‍යාව, AI, ඩිජිටල් ජීවිතය — පැහැදිලිව.",
    accent: "#bf5af2",
    gradient: "linear-gradient(135deg, #bf5af222 0%, #af52de18 50%, transparent 100%)",
  },
  scifi: {
    labelEn: "Science Fiction",
    labelSi: "විද්‍යා ප්‍රබන්ධ",
    descEn: "Speculative futures, cosmic wonder, and imaginative science.",
    descSi: "අනාගත කල්පනා, විශ්වයේ අද්භුතාව, සිතකල්පිත විද්‍යාව.",
    accent: "#00f0ff",
    gradient: "linear-gradient(135deg, #00f0ff22 0%, #bf00ff18 50%, transparent 100%)",
  },
};
