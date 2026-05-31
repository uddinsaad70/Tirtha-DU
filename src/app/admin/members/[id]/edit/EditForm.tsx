"use client";

import { useActionState, useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import DesignationSelect from "../../../../members/_components/DesignationSelect";
import { updateMember, type ActionState } from "../../actions";

import DepartmentSelect from "@/components/DepartmentSelect";
import SessionSelect from "@/components/SessionSelect";
import CommitteeYearSelect from "@/components/CommitteeYearSelect";

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
    <div className="flex items-center gap-3 pb-2 border-b border-gray-100 mt-2">
      <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
        {title}
      </h2>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

export default function MemberEditForm({ member }: { member: any }) {
  const { t, lang } = useLanguage();

  // actions.tsx এর রিকোয়ারমেন্ট অনুযায়ী id এবং photo_url বাইন্ড করা হলো
  const updateMemberBound = updateMember.bind(
    null,
    member.id,
    member.photo_url,
  );

  const [state, formAction, isPending] = useActionState(
    updateMemberBound,
    INITIAL_STATE,
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // কন্ডিশনাল লজিক: যদি মেম্বারের ডেটাবেজে designation থাকে, তাহলে সে কমিটির সদস্য
  const [role, setRole] = useState(
    member.designation ? "committee" : "general",
  );

  const filePreviewUrl = selectedFile
    ? URL.createObjectURL(selectedFile)
    : member.photo_url;

  return (
    <div className="p-5 sm:p-7 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-7">
        <Link
          href="/admin/members"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#c9a84c] transition-colors mb-4"
        >
          ← {t.adminMembersEdit.back}
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0a1628]">
          {t.adminMembers.editPageTitle}
        </h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <form action={formAction} className="divide-y divide-gray-50">
          <input type="hidden" name="id" value={member.id} />
          {!selectedFile && member.photo_url && (
            <input
              type="hidden"
              name="existing_photo_url"
              value={member.photo_url}
            />
          )}

          <div className="p-6 sm:p-8 flex flex-col gap-5">
            <Field label={t.adminMembersEdit.fieldName} required>
              <input
                type="text"
                name="name"
                required
                defaultValue={member.name}
                className={inputCls}
              />
            </Field>

            <Field label={t.adminMembersEdit.fieldDept}>
              <DepartmentSelect
                currentLang={lang}
                name="department"
                disabled={isPending}
                defaultValue={member.department ?? ""}
              />
            </Field>

            <Field label={t.adminMembersEdit.fieldSession}>
              <SessionSelect
                currentLang={lang}
                name="session"
                disabled={isPending}
                defaultValue={member.session ?? ""}
              />
            </Field>

            <Field label={t.adminMembersEdit.fieldBlood}>
              <select
                name="blood_group"
                className={inputCls}
                defaultValue={member.blood_group ?? ""}
              >
                <option value="" disabled>
                  {t.adminMembersEdit.selectPlaceholder}
                </option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                  (bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ),
                )}
              </select>
            </Field>

            <Field label={t.adminMembersEdit.fieldPhone}>
              <input
                type="tel"
                name="phone"
                defaultValue={member.phone ?? ""}
                className={inputCls}
              />
            </Field>

            <Field label={t.adminMembersEdit.fieldFb}>
              <input
                type="url"
                name="facebook_url"
                defaultValue={member.facebook_url ?? ""}
                className={inputCls}
              />
            </Field>

            <Field
              label={t.adminMembersEdit.fieldPhoto}
              hint={t.adminMembersEdit.photoHint}
            >
              <div className="flex items-center gap-4 border border-gray-200 rounded-xl p-3 bg-white">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm font-medium rounded-lg transition-colors"
                >
                  Choose File
                </button>
                <span className="text-sm text-gray-500 truncate">
                  {selectedFile ? selectedFile.name : "No file chosen"}
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  name="photo"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                />
              </div>
              {filePreviewUrl && (
                <img
                  src={filePreviewUrl}
                  alt="Preview"
                  className="mt-3 w-20 h-20 object-cover rounded-xl border border-gray-200"
                />
              )}
            </Field>

            <Field label={t.adminMembersEdit.fieldBio}>
              <textarea
                name="bio"
                rows={3}
                defaultValue={member.bio ?? ""}
                className={`${inputCls} resize-none`}
              />
            </Field>

            <SectionHeading title={t.adminMembersEdit.sectionMembership} />

            <Field label={t.adminMembersEdit.fieldType} required>
              <select
                name="is_alumni"
                defaultValue={member.is_alumni ? "true" : "false"}
                className={inputCls}
              >
                <option value="false">{t.adminMembersEdit.typeCurrent}</option>
                <option value="true">{t.adminMembersEdit.typeAlumni}</option>
              </select>
            </Field>

            <Field label={t.adminMembersEdit.fieldRole} required>
              <select
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={inputCls}
              >
                <option value="general">
                  {t.adminMembersEdit.roleGeneral}
                </option>
                <option value="committee">
                  {t.adminMembersEdit.roleCommittee}
                </option>
              </select>
            </Field>

            {role === "committee" && (
              <>
                <Field label={t.adminMembersEdit.fieldCommitteeYear}>
                  <CommitteeYearSelect
                    currentLang={lang}
                    name="committee_year"
                    disabled={isPending}
                    defaultValue={member.committee_year ?? ""}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {t.adminMembersEdit.committeeYearHint}
                  </p>
                </Field>

                <Field label={t.adminMembersEdit.fieldDesignation} required>
                  <DesignationSelect
                    currentLang={lang}
                    name="designation"
                    required
                    disabled={isPending}
                    defaultValue={member.designation ?? ""}
                  />
                </Field>
              </>
            )}
          </div>

          <div className="p-6 sm:p-8 bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {state.error ? (
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                <span>⚠️</span>
                <span>{state.error}</span>
              </div>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <Link
                href="/admin/members"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                {t.adminMembersEdit.cancelBtn}
              </Link>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-[#0a1628] bg-[#c9a84c] hover:bg-[#b89945] disabled:opacity-60 transition-colors shadow-sm"
              >
                {isPending
                  ? t.adminMembersEdit.updatingBtn
                  : t.adminMembersEdit.updateBtn}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
