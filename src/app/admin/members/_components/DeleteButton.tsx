"use client";

import { useTransition } from "react";
import { deleteMember } from "../actions";
import { useLanguage } from "@/context/LanguageContext";

export default function DeleteButton({
  memberId,
  memberName,
}: {
  memberId: number;
  memberName: string;
}) {
  const [isPending, startTransition] = useTransition();
  const { t } = useLanguage();

  function handleDelete() {
    const message = t.adminMembersList.deleteConfirm.replace(
      "{name}",
      memberName,
    );
    const confirmed = window.confirm(message);
    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteMember(memberId);
      if (result.error) {
        window.alert(result.error);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? t.adminMembersList.deleting : t.adminMembersList.deleteBtn}
    </button>
  );
}
