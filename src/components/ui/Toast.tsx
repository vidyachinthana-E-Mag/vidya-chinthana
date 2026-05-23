import React, { useEffect } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

export type ToastState = {
  message: string;
  type: "success" | "error" | "info";
} | null;

export default function Toast({
  toast,
  onClose,
}: {
  toast: ToastState;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] px-4 py-3 rounded-xl shadow-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#14141c] flex items-center gap-2 text-sm font-medium animate-[fadeUp_0.3s_ease-out]">
      {toast.type === "success" ? (
        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 text-[#c45c26] shrink-0" />
      )}
      {toast.message}
    </div>
  );
}
