"use client";

import { useState, useTransition } from "react";
import { deleteNotice } from "../actions";
import { useLanguage } from "@/context/LanguageContext";
import { Trash2 } from "lucide-react";

interface Props {
  noticeId: number;
}

export default function DeleteButton({ noticeId }: Props) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteNotice(noticeId);
      if (result.error) {
        setError(result.error);
        setShowConfirm(false);
      }
    });
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-1.5">
        {error && <span className="text-xs text-red-500 mr-1">{error}</span>}
        <span className="text-xs text-gray-500 hidden sm:inline">
          {t.adminNoticesList.delete.confirmPrompt}
        </span>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 transition-colors"
        >
          {isPending
            ? t.adminNoticesList.delete.deleting
            : t.adminNoticesList.delete.confirmYes}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isPending}
          className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          {t.adminNoticesList.delete.confirmNo}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
    >
      <Trash2 className="w-3.5 h-3.5" />{" "}
      {t.adminNoticesList.delete.deleteBtn.replace("🗑️ ", "")}
    </button>
  );
}
