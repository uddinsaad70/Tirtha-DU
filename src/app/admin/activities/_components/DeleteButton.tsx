"use client";

import { useState, useTransition } from "react";
import { deleteActivity } from "../actions";
import { useLanguage } from "@/context/LanguageContext";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteButton({ activityId }: { activityId: number }) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteActivity(activityId);
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
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 transition-colors"
          title={t.adminActivitiesList.delete.confirmPrompt}
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
          {isPending
            ? t.adminActivitiesList.delete.deleting
            : t.adminActivitiesList.delete.confirmYes}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isPending}
          className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          {t.adminActivitiesList.delete.confirmNo}
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
      {t.adminActivitiesList.delete.deleteBtn}
    </button>
  );
}
