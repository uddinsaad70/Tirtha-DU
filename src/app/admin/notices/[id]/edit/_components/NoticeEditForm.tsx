"use client";

import { useActionState, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { updateNotice, type ActionState } from "../../../actions";
import {
  ArrowLeft,
  FileText,
  Paperclip,
  Trash2,
  Check,
  Loader2,
  ExternalLink,
} from "lucide-react";

const INITIAL_STATE: ActionState = { error: null };
const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#0a1628] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c] transition-all bg-white";

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-[#0a1628]">
        {label} {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 leading-relaxed">{hint}</p>}
    </div>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
      <h2 className="text-sm font-bold text-[#0a1628] uppercase tracking-wider">
        {title}
      </h2>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

function ExistingFileCard({
  fileUrl,
  fileType,
  onRemove,
  t,
}: {
  fileUrl: string;
  fileType: "image" | "pdf" | "none";
  onRemove: () => void;
  t: any;
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-[#c9a84c]/20 bg-[#c9a84c]/5">
      {fileType === "image" ? (
        <img
          src={fileUrl}
          alt="Preview"
          className="w-16 h-16 rounded-lg object-cover ring-1 ring-gray-200 shrink-0"
        />
      ) : (
        <div className="w-16 h-16 rounded-lg bg-orange-50 ring-1 ring-orange-100 flex items-center justify-center text-orange-500 shrink-0">
          <FileText className="w-8 h-8" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-0.5">
          {t.adminNoticesEdit.fileCurrentLabel}
        </p>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-[#c9a84c] hover:underline truncate"
        >
          {t.adminNoticesEdit.fileViewNewTab}{" "}
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />{" "}
        {t.adminNoticesEdit.fileRemoveBtn.replace("🗑️ ", "")}
      </button>
    </div>
  );
}

export default function NoticeEditForm({ notice }: { notice: any }) {
  const { t } = useLanguage();
  const boundAction = updateNotice.bind(
    null,
    notice.id,
    notice.file_url,
    notice.file_type,
  );
  const [state, formAction, isPending] = useActionState(
    boundAction,
    INITIAL_STATE,
  );

  const [removeFile, setRemoveFile] = useState(false);
  const [newFile, setNewFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasExistingFile =
    notice.file_url && notice.file_type !== "none" && !removeFile;
  const newFilePreviewUrl = newFile ? URL.createObjectURL(newFile) : null;
  const expiresAtValue = notice.expires_at
    ? new Date(notice.expires_at).toISOString().split("T")[0]
    : "";
  // Format the ISO datetime string to yyyy-MM-ddTHH:mm for datetime-local input
  const publishedAtValue = notice.published_at
    ? new Date(notice.published_at).toISOString().slice(0, 16)
    : "";

  return (
    <div className="p-5 sm:p-7 lg:p-8 max-w-3xl mx-auto">
      {/* ── হেডার অংশ এখানে নিয়ে আসা হয়েছে ── */}
      <div className="mb-7">
        <Link
          href="/admin/notices"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#c9a84c] transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> {t.adminNoticesEdit.back}
        </Link>
        <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-1">
          {t.adminNoticesEdit.supertitle}
        </p>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0a1628]">
            {t.adminNoticesEdit.titleEdit}
          </h1>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-500 max-w-sm">
            <span className="truncate">{notice.title}</span>
            <span className="shrink-0 text-gray-300">#</span>
            <span className="shrink-0 font-mono text-gray-400">
              {notice.id}
            </span>
          </div>
        </div>
      </div>

      <form
        action={formAction}
        className="divide-y divide-gray-50 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        <input
          type="hidden"
          name="remove_file"
          value={removeFile ? "true" : "false"}
        />

        <div className="p-6 sm:p-8 flex flex-col gap-5">
          <SectionHeading title={t.adminNoticesEdit.sectionBasic} />
          <Field
            label={t.adminNoticesEdit.fieldTitle}
            required
            hint={t.adminNoticesEdit.fieldTitleHint}
          >
            <input
              type="text"
              name="title"
              required
              defaultValue={notice.title}
              placeholder={t.adminNoticesEdit.fieldTitlePlaceholder}
              className={inputCls}
            />
          </Field>
          <Field
            label={t.adminNoticesEdit.fieldBody}
            hint={t.adminNoticesEdit.fieldBodyHint}
          >
            <textarea
              name="body"
              rows={5}
              defaultValue={notice.body ?? ""}
              placeholder={t.adminNoticesEdit.fieldBodyPlaceholder}
              className={`${inputCls} resize-none`}
            />
          </Field>
          <Field
            label={t.adminNoticesEdit.fieldExpiry}
            hint={t.adminNoticesEdit.fieldExpiryHint}
          >
            <input
              type="date"
              name="expires_at"
              defaultValue={expiresAtValue}
              className={inputCls}
            />
          </Field>

          <Field
            label={t.adminNoticesEdit.fieldPublishedAt}
            hint={t.adminNoticesEdit.fieldPublishedAtHint}
          >
            <input
              type="datetime-local"
              name="published_at"
              defaultValue={publishedAtValue}
              className={inputCls}
            />
          </Field>
        </div>

        <div className="p-6 sm:p-8 flex flex-col gap-4">
          <SectionHeading title={t.adminNoticesEdit.sectionFile} />
          {hasExistingFile && (
            <ExistingFileCard
              fileUrl={notice.file_url!}
              fileType={notice.file_type}
              onRemove={() => {
                setRemoveFile(true);
                setNewFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              t={t}
            />
          )}
          {!hasExistingFile && (
            <Field
              label={
                notice.file_url
                  ? t.adminNoticesEdit.fileReplaceLabel
                  : t.adminNoticesEdit.fieldFile
              }
              hint={t.adminNoticesEdit.fieldFileHint}
            >
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#c9a84c]/50 hover:bg-[#c9a84c]/5 transition-all cursor-pointer group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  name="file"
                  accept=".pdf,image/*"
                  className="sr-only"
                  onChange={(e) => {
                    setNewFile(e.target.files?.[0] ?? null);
                    setRemoveFile(false);
                  }}
                />
                {newFile ? (
                  <div className="flex flex-col items-center gap-2 text-center">
                    {newFile.type === "application/pdf" ? (
                      <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                        <FileText className="w-7 h-7" />
                      </div>
                    ) : newFilePreviewUrl ? (
                      <img
                        src={newFilePreviewUrl}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-xl ring-2 ring-[#c9a84c]/20"
                      />
                    ) : null}
                    <p className="text-sm font-semibold text-[#0a1628]">
                      {newFile.name}
                    </p>
                    <p className="text-xs text-[#c9a84c]">
                      {t.adminNoticesEdit.fileChangeHint}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-[#c9a84c]/10 flex items-center justify-center text-gray-500 transition-colors">
                      <Paperclip className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-[#0a1628]">
                        {t.adminNoticesEdit.fileUploadLabel}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {t.adminNoticesEdit.fileUploadHint}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </Field>
          )}
          {removeFile && notice.file_url && (
            <button
              type="button"
              onClick={() => setRemoveFile(false)}
              className="self-start text-xs text-[#c9a84c] hover:underline"
            >
              {t.adminNoticesEdit.fileKeepPrev}
            </button>
          )}
        </div>

        <div className="p-6 sm:p-8 flex flex-col gap-5">
          <SectionHeading title={t.adminNoticesEdit.sectionDisplay} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field
              label={t.adminNoticesEdit.fieldTicker}
              hint={t.adminNoticesEdit.fieldTickerHint}
            >
              <select
                name="is_ticker"
                defaultValue={notice.is_ticker ? "true" : "false"}
                className={inputCls}
              >
                <option value="false">{t.adminNoticesEdit.tickerNo}</option>
                <option value="true">{t.adminNoticesEdit.tickerYes}</option>
              </select>
            </Field>
            <Field
              label={t.adminNoticesEdit.fieldStatus}
              hint={t.adminNoticesEdit.fieldStatusHint}
            >
              <select
                name="is_published"
                defaultValue={notice.is_published ? "true" : "false"}
                className={inputCls}
              >
                <option value="true">{t.adminNoticesEdit.statusPub}</option>
                <option value="false">{t.adminNoticesEdit.statusDraft}</option>
              </select>
            </Field>
          </div>
        </div>

        <div className="p-6 sm:p-8 bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {state.error ? (
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
              <span className="text-base">⚠️</span>
              <span>{state.error}</span>
            </div>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <Link
              href="/admin/notices"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {t.adminNoticesEdit.cancelBtn}
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-[#0a1628] bg-gradient-to-r from-[#c9a84c] to-[#e8c96d] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity shadow-sm"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />{" "}
                  {t.adminNoticesEdit.updatingBtn}
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />{" "}
                  {t.adminNoticesEdit.updateBtn.replace("✓ ", "")}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
