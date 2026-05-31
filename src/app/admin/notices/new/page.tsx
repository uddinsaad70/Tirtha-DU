"use client";

import { useActionState, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { createNotice, type ActionState } from "../actions";
import { ArrowLeft, FileText, Paperclip, Check, Loader2 } from "lucide-react";

const INITIAL_STATE: ActionState = { error: null };

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
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
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

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#0a1628] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c] transition-all bg-white";

export default function NewNoticePage() {
  const { t } = useLanguage();
  const [state, formAction, isPending] = useActionState(
    createNotice,
    INITIAL_STATE,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedFile(e.target.files?.[0] ?? null);
  }

  const filePreviewUrl = selectedFile
    ? URL.createObjectURL(selectedFile)
    : null;

  return (
    <div className="p-5 sm:p-7 lg:p-8 max-w-3xl mx-auto">
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
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0a1628]">
          {t.adminNoticesEdit.titleNew}
        </h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <form
          action={formAction}
          className="divide-y divide-gray-50"
          noValidate
        >
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
                placeholder={t.adminNoticesEdit.fieldBodyPlaceholder}
                className={`${inputCls} resize-none`}
              />
            </Field>

            <Field
              label={t.adminNoticesEdit.fieldExpiry}
              hint={t.adminNoticesEdit.fieldExpiryHint}
            >
              <input type="date" name="expires_at" className={inputCls} />
            </Field>

            <Field
              label={t.adminNoticesEdit.fieldPublishedAt}
              hint={t.adminNoticesEdit.fieldPublishedAtHint}
            >
              <input
                type="datetime-local"
                name="published_at"
                className={inputCls}
              />
            </Field>
          </div>

          <div className="p-6 sm:p-8 flex flex-col gap-5">
            <SectionHeading title={t.adminNoticesEdit.sectionFile} />

            <Field
              label={t.adminNoticesEdit.fieldFile}
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
                  onChange={handleFileChange}
                />
                {selectedFile ? (
                  <div className="flex flex-col items-center gap-2 text-center">
                    {selectedFile.type === "application/pdf" ? (
                      <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                        <FileText className="w-7 h-7" />
                      </div>
                    ) : filePreviewUrl ? (
                      <img
                        src={filePreviewUrl}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-xl ring-2 ring-[#c9a84c]/20"
                      />
                    ) : null}
                    <p className="text-sm font-semibold text-[#0a1628]">
                      {selectedFile.name}
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
                  className={inputCls}
                  defaultValue="false"
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
                  defaultValue="true"
                  className={inputCls}
                >
                  <option value="true">{t.adminNoticesEdit.statusPub}</option>
                  <option value="false">
                    {t.adminNoticesEdit.statusDraft}
                  </option>
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

            <div className="flex items-center gap-3 self-end sm:self-auto w-full sm:w-auto">
              <Link
                href="/admin/notices"
                className="w-full sm:w-auto text-center px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                {t.adminNoticesEdit.cancelBtn}
              </Link>
              <button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-xl text-sm font-bold text-[#0a1628] bg-gradient-to-r from-[#c9a84c] to-[#e8c96d] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity shadow-sm"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />{" "}
                    {t.adminNoticesEdit.publishingBtn}
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />{" "}
                    {t.adminNoticesEdit.publishBtn.replace("✓ ", "")}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
