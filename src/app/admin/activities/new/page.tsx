"use client";

import { useActionState, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { createActivity, type ActionState } from "../actions";
import { ArrowLeft, Image as ImageIcon, Check, Loader2 } from "lucide-react";

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

export default function NewActivityPage() {
  const { t } = useLanguage();
  const [state, formAction, isPending] = useActionState(
    createActivity,
    INITIAL_STATE,
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // 👇 ক্যাটাগরি ট্র্যাক করার জন্য নতুন স্টেট
  const [selectedCategory, setSelectedCategory] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filePreviewUrl = selectedFile
    ? URL.createObjectURL(selectedFile)
    : null;

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
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0a1628]">
          {t.adminActivitiesEdit.titleNew}
        </h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <form
          action={formAction}
          className="divide-y divide-gray-50"
          noValidate
        >
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
                required
                placeholder={t.adminActivitiesEdit.fieldTitlePlaceholder}
                className={inputCls}
              />
            </Field>

            <Field
              label={t.adminActivitiesEdit.fieldCategory}
              required
              hint={t.adminActivitiesEdit.fieldCategoryHint}
            >
              <select
                name="category"
                required
                className={inputCls}
                defaultValue=""
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="" disabled>
                  {t.adminActivitiesEdit.selectPlaceholder}
                </option>
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
                  defaultValue={0}
                  min={0}
                  className={inputCls}
                />
              </Field>
            )}
          </div>

          {/* === Section 2: Photo Upload === */}
          <div className="p-6 sm:p-8 flex flex-col gap-5">
            <SectionHeading title={t.adminActivitiesEdit.sectionPhoto} />
            <Field
              label={t.adminActivitiesEdit.fieldPhoto}
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
                  onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                />
                {selectedFile ? (
                  <div className="flex flex-col items-center gap-2 text-center">
                    <img
                      src={filePreviewUrl!}
                      alt="Preview"
                      className="w-28 h-28 object-cover rounded-xl ring-2 ring-[#c9a84c]/20"
                    />
                    <p className="text-sm font-semibold text-[#0a1628]">
                      {selectedFile.name}
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
                defaultValue="true"
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
                <span>⚠️</span> <span>{state.error}</span>
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
                    {t.adminActivitiesEdit.publishingBtn}
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />{" "}
                    {t.adminActivitiesEdit.publishBtn.replace("✓ ", "")}
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
