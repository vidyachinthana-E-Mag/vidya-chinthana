import { useEffect } from "react";

export type PageMetaOptions = {
  title: string;
  description?: string;
  /** Hash path e.g. `/home`, `/read/abc` */
  path?: string;
  image?: string;
  ogType?: "website" | "article" | "profile";
  jsonLd?: object | object[];
  noIndex?: boolean;
};

const DEFAULT_TITLE = "Vidya Chinthana";

function setMeta(name: string, content: string, property = false) {
  if (!content) return;
  const attr = property ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  if (!href) return;
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function upsertJsonLd(id: string, data: object | object[]) {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  const items = Array.isArray(data) ? data : [data];
  items.forEach((item, i) => {
    const script = document.createElement("script");
    script.id = items.length > 1 ? `${id}-${i}` : id;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(item);
    document.head.appendChild(script);
  });
}

function removeJsonLd(id: string) {
  document.querySelectorAll(`[id^="${id}"]`).forEach((el) => el.remove());
}

export function usePageMeta({
  title,
  description,
  path,
  image,
  ogType = "website",
  jsonLd,
  noIndex,
}: PageMetaOptions) {
  useEffect(() => {
    const fullTitle = title ? `${title} · ${DEFAULT_TITLE}` : DEFAULT_TITLE;
    document.title = fullTitle;

    if (description) setMeta("description", description);
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", description || "", true);
    setMeta("og:type", ogType, true);
    if (image) setMeta("og:image", image, true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description || "");
    if (image) setMeta("twitter:image", image);

    if (path) {
      const url =
        typeof window !== "undefined"
          ? `${window.location.origin}${window.location.pathname}#${path.replace(/^\//, "")}`
          : "";
      setMeta("og:url", url, true);
      setLink("canonical", url);
    }

    setMeta("robots", noIndex ? "noindex, nofollow" : "index, follow");

    if (jsonLd) upsertJsonLd("vc-jsonld", jsonLd);
    else removeJsonLd("vc-jsonld");

    return () => {
      removeJsonLd("vc-jsonld");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- jsonLd compared by snapshot
  }, [title, description, path, image, ogType, noIndex, jsonLd ? JSON.stringify(jsonLd) : ""]);
}
