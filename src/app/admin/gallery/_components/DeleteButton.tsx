"use client";

import { useState, useTransition } from "react";
import { deleteGalleryAlbum } from "../actions";
import { useLanguage } from "@/context/LanguageContext";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteButton({
  id,
  title,
}: {
  id: number;
  title: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteGalleryAlbum(id);
      if (result?.error) {
        setError(result.error);
        setShowConfirm(false);
      }
    });
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-1.5 absolute bottom-4 right-4 bg-white p-2 rounded-xl shadow-lg border border-gray-100 z-10">
        {error && <span className="text-xs text-red-500 mr-1">{error}</span>}
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 transition-colors"
          title={t.adminGalleryList.delete.confirmPrompt.replace(
            "{title}",
            title,
          )}
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
          {isPending
            ? t.adminGalleryList.delete.deleting
            : t.adminGalleryList.delete.confirmYes}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isPending}
          className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          {t.adminGalleryList.delete.confirmNo}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      title={`${title} ${t.adminGalleryList.delete.deleteBtn}`}
    >
      <Trash2 className="w-4 h-4" /> {t.adminGalleryList.delete.deleteBtn}
    </button>
  );
}
