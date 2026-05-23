import { useEffect } from "react";

const DEFAULT = "Vidya Chinthana";

export function useDocumentTitle(title: string | null) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} · ${DEFAULT}` : DEFAULT;
    return () => {
      document.title = prev;
    };
  }, [title]);
}
