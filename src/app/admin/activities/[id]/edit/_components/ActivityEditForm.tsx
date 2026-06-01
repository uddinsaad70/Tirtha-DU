"use client";

import { useActionState, useRef, useState } from "react";
import Link from "next/link";
import { updateActivity, type ActionState } from "../../../actions";
import { ArrowLeft, Check, ImageIcon, Loader2, Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ActivityEditForm({ activity }: { activity: any }) {
  const { t } = useLanguage();
  const boundAction = updateActivity.bind(
    null,
    activity.id,
    activity.cover_image_url,
  );
  const [state, formAction, isPending] = useActionState(
    boundAction,
    INITIAL_STATE,
  );

  const [removeFile, setRemoveFile] = useState(false);
  const [newFile, setNewFile] = useState<File | null>(null);

  // 👇 ক্যাটাগরি ট্র্যাক করার জন্য নতুন স্টেট, ডিফল্ট ভ্যালু হিসেবে বর্তমান ক্যাটাগরি দেওয়া হলো
  const [selectedCategory, setSelectedCategory] = useState(
    activity?.category || "",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasExistingFile = activity.cover_image_url && !removeFile;
  const newFilePreviewUrl = newFile ? URL.createObjectURL(newFile) : null;

  return (
    <div className="p-5 sm:p-7 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-7">
        <Link
          href="/admin/activities"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#c9a84c] transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> {t.adminActivitiesEdit.back}
        </Link>
        <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-1">
          {t.adminActivitiesEdit.supertitle}
        </p>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0a1628]">
            {t.adminActivitiesEdit.titleEdit}
          </h1>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-500 max-w-sm">
            <span className="truncate">{activity.title}</span>
            <span className="shrink-0 text-gray-300">#</span>
            <span className="shrink-0 font-mono text-gray-400">
              {activity.id}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <form
          action={formAction}
          className="divide-y divide-gray-50"
          noValidate
        >
          <input
            type="hidden"
            name="remove_image"
            value={removeFile ? "true" : "false"}
          />

          {/* === Section 1: Basic Info === */}
          <div className="p-6 sm:p-8 flex flex-col gap-5">
            <SectionHeading title={t.adminActivitiesEdit.sectionBasic} />
            <Field
              label={t.adminActivitiesEdit.fieldTitle}
              required
              hint={t.adminActivitiesEdit.fieldTitleHint}
            >
              <input
                type="text"
                name="title"
                defaultValue={activity.title}
                required
                placeholder={t.adminActivitiesEdit.fieldTitlePlaceholder}
                className={inputCls}
              />
            </Field>
            <Field label={t.adminActivitiesEdit.fieldCategory} required>
              <select
                name="category"
                defaultValue={activity.category}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
                className={inputCls}
              >
                <option value="Academic Care">
                  {t.adminActivitiesEdit.catAcademic}
                </option>
                <option value="Blood Donation">
                  {t.adminActivitiesEdit.catBlood}
                </option>
                <option value="Humanitarian Support">
                  {t.adminActivitiesEdit.catHumanitarian}
                </option>
                <option value="Cultural Programs">
                  {t.adminActivitiesEdit.catCultural}
                </option>
              </select>
            </Field>
            <Field
              label={t.adminActivitiesEdit.fieldBody}
              required
              hint={t.adminActivitiesEdit.fieldBodyHint}
            >
              <textarea
                name="body"
                defaultValue={activity.body}
                required
                rows={5}
                placeholder={t.adminActivitiesEdit.fieldBodyPlaceholder}
                className={`${inputCls} resize-none`}
              />
            </Field>

            {(selectedCategory === "Academic Care" ||
              selectedCategory === "Blood Donation") && (
              <Field
                label={t.adminActivitiesEdit.fieldImpact}
                hint={t.adminActivitiesEdit.fieldImpactHint}
              >
                <input
                  type="number"
                  name="impact_count"
                  defaultValue={activity.impact_count || 0}
                  min={0}
                  className={inputCls}
                />
              </Field>
            )}
          </div>

          {/* === Section 2: Photo Upload === */}
          <div className="p-6 sm:p-8 flex flex-col gap-4">
            <SectionHeading title={t.adminActivitiesEdit.sectionPhoto} />
            {hasExistingFile && (
              <div className="flex items-center gap-4 p-4 rounded-xl border border-[#c9a84c]/20 bg-[#c9a84c]/5">
                <img
                  src={activity.cover_image_url}
                  alt="Current"
                  className="w-16 h-16 rounded-lg object-cover ring-1 ring-gray-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#0a1628] uppercase tracking-wider mb-0.5">
                    {t.adminActivitiesEdit.photoCurrent}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setRemoveFile(true);
                    setNewFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />{" "}
                  {t.adminActivitiesEdit.photoRemove}
                </button>
              </div>
            )}
            {!hasExistingFile && (
              <Field
                label={
                  activity.cover_image_url
                    ? t.adminActivitiesEdit.photoReplace
                    : t.adminActivitiesEdit.fieldPhoto
                }
                hint={t.adminActivitiesEdit.fieldPhotoHint}
              >
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-gray-200 hover:border-[#c9a84c]/50 hover:bg-[#c9a84c]/5 transition-all cursor-pointer group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="cover_image"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      setNewFile(e.target.files?.[0] ?? null);
                      setRemoveFile(false);
                    }}
                  />
                  {newFile ? (
                    <div className="flex flex-col items-center gap-2 text-center">
                      <img
                        src={newFilePreviewUrl!}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-xl ring-2 ring-[#c9a84c]/20"
                      />
                      <p className="text-sm font-semibold text-[#0a1628]">
                        {newFile.name}
                      </p>
                      <p className="text-xs text-[#c9a84c]">
                        {t.adminActivitiesEdit.photoChangeHint}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-[#c9a84c]/10 flex items-center justify-center text-gray-500 transition-colors">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-[#0a1628]">
                          {t.adminActivitiesEdit.photoUploadLabel}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {t.adminActivitiesEdit.photoUploadHint}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </Field>
            )}
            {removeFile && activity.cover_image_url && (
              <button
                type="button"
                onClick={() => setRemoveFile(false)}
                className="self-start text-xs text-[#c9a84c] hover:underline"
              >
                {t.adminActivitiesEdit.photoKeepPrev}
              </button>
            )}
          </div>

          {/* === Section 3: Display Settings === */}
          <div className="p-6 sm:p-8 flex flex-col gap-5">
            <SectionHeading title={t.adminActivitiesEdit.sectionDisplay} />
            <Field
              label={t.adminActivitiesEdit.fieldStatus}
              hint={t.adminActivitiesEdit.fieldStatusHint}
            >
              <select
                name="is_published"
                defaultValue={activity.is_published ? "true" : "false"}
                className={inputCls}
              >
                <option value="true">{t.adminActivitiesEdit.statusPub}</option>
                <option value="false">
                  {t.adminActivitiesEdit.statusDraft}
                </option>
              </select>
            </Field>
          </div>

          {/* === Section 4: Form Actions (Footer) === */}
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
                href="/admin/activities"
                className="w-full sm:w-auto text-center px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                {t.adminActivitiesEdit.cancelBtn}
              </Link>
              <button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-xl text-sm font-bold text-[#0a1628] bg-gradient-to-r from-[#c9a84c] to-[#e8c96d] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity shadow-sm"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />{" "}
                    {t.adminActivitiesEdit.updatingBtn}
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />{" "}
                    {t.adminActivitiesEdit.updateBtn.replace("✓ ", "")}
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
