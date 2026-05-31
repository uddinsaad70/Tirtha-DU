"use client";

import { useActionState, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { updateGalleryAlbum, type ActionState } from "../../../actions";
import { ArrowLeft, ImageIcon, X, Loader2, Check } from "lucide-react";

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

export default function GalleryEditForm({ album }: { album: any }) {
  const { t } = useLanguage();
  const boundAction = updateGalleryAlbum.bind(
    null,
    album.id,
    album.image_urls || [],
  );
  const [state, formAction, isPending] = useActionState(
    boundAction,
    INITIAL_STATE,
  );

  const [retainedUrls, setRetainedUrls] = useState<string[]>(
    album.image_urls || [],
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const takenAtValue = album.taken_at
    ? new Date(album.taken_at).toISOString().split("T")[0]
    : "";
  const totalPhotos = retainedUrls.length + selectedFiles.length;

  useEffect(() => {
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [selectedFiles]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const spaceLeft = 20 - retainedUrls.length - selectedFiles.length;
      const combinedFiles = [...selectedFiles, ...newFiles].slice(
        0,
        selectedFiles.length + spaceLeft,
      );
      setSelectedFiles(combinedFiles);
      syncInputFiles(combinedFiles);
    }
  }

  function removeNewFile(index: number) {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    syncInputFiles(updatedFiles);
  }

  function removeRetainedUrl(urlToRemove: string) {
    setRetainedUrls((prev) => prev.filter((url) => url !== urlToRemove));
  }

  function syncInputFiles(files: File[]) {
    if (fileInputRef.current) {
      const dt = new DataTransfer();
      files.forEach((f) => dt.items.add(f));
      fileInputRef.current.files = dt.files;
    }
  }

  return (
    <div className="p-5 sm:p-7 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-7">
        <Link
          href="/admin/gallery"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#c9a84c] transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> {t.adminGalleryEdit.back}
        </Link>
        <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-1">
          {t.adminGalleryEdit.supertitle}
        </p>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0a1628]">
            {t.adminGalleryEdit.titleEdit}
          </h1>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-500 max-w-sm">
            <span className="truncate">{album.title}</span>
            <span className="shrink-0 text-gray-300">#</span>
            <span className="shrink-0 font-mono text-gray-400">{album.id}</span>
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
            name="retained_urls"
            value={JSON.stringify(retainedUrls)}
          />

          <div className="p-6 sm:p-8 flex flex-col gap-5">
            <SectionHeading title={t.adminGalleryEdit.sectionBasic} />
            <Field
              label={t.adminGalleryEdit.fieldTitle}
              required
              hint={t.adminGalleryEdit.fieldTitleHint}
            >
              <input
                type="text"
                name="title"
                defaultValue={album.title}
                required
                className={inputCls}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field
                label={t.adminGalleryEdit.fieldEvent}
                hint={t.adminGalleryEdit.fieldEventHint}
              >
                <input
                  type="text"
                  name="event_name"
                  defaultValue={album.event_name || ""}
                  className={inputCls}
                />
              </Field>
              <Field
                label={t.adminGalleryEdit.fieldDate}
                hint={t.adminGalleryEdit.fieldDateHint}
              >
                <input
                  type="date"
                  name="taken_at"
                  defaultValue={takenAtValue}
                  className={inputCls}
                />
              </Field>
            </div>
          </div>

          <div className="p-6 sm:p-8 flex flex-col gap-6">
            <SectionHeading
              title={`${t.adminGalleryEdit.currentImagesTitle} (${retainedUrls.length})`}
            />

            {retainedUrls.length === 0 ? (
              <p className="text-sm text-red-500 bg-red-50 p-4 rounded-xl border border-red-100">
                {t.adminGalleryEdit.noCurrentImagesHint}
              </p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {retainedUrls.map((url, i) => (
                  <div
                    key={i}
                    className="relative group rounded-xl overflow-hidden ring-1 ring-[#c9a84c]/30 aspect-square"
                  >
                    <img
                      src={url}
                      alt="Saved"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeRetainedUrl(url)}
                      className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
                      title={t.adminGalleryEdit.removeImageBtn}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <SectionHeading
              title={`${t.adminGalleryEdit.fieldNewImages} (${selectedFiles.length})`}
            />

            <Field
              label={t.adminGalleryEdit.fieldNewImages}
              hint={`${t.adminGalleryEdit.fieldNewImagesHint} (Total: ${totalPhotos}/20)`}
            >
              <div
                onClick={() => {
                  if (totalPhotos < 20) fileInputRef.current?.click();
                }}
                className={`relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed transition-all ${
                  totalPhotos >= 20
                    ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                    : "border-gray-200 hover:border-[#c9a84c]/50 hover:bg-[#c9a84c]/5 cursor-pointer group"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFileChange}
                />
                <div className="text-center">
                  <p className="text-sm font-semibold text-[#0a1628]">
                    + {t.adminGalleryEdit.uploadLabel}
                  </p>
                </div>
              </div>
            </Field>

            {selectedFiles.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-2">
                {previewUrls.map((url, i) => (
                  <div
                    key={i}
                    className="relative group rounded-xl overflow-hidden ring-1 ring-blue-300 aspect-square"
                  >
                    <img
                      src={url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-0 left-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg">
                      {t.adminGalleryEdit.badgeNew}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNewFile(i);
                      }}
                      className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8 bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {state.error ? (
              <div className="text-sm text-red-600 px-4 py-2.5 rounded-xl bg-red-50 border border-red-100">
                {state.error}
              </div>
            ) : (
              <div />
            )}
            <div className="flex items-center gap-3">
              <Link
                href="/admin/gallery"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50"
              >
                {t.adminGalleryEdit.cancelBtn}
              </Link>
              <button
                type="submit"
                disabled={isPending || totalPhotos === 0}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-[#0a1628] bg-gradient-to-r from-[#c9a84c] to-[#e8c96d] hover:opacity-90 disabled:opacity-60 shadow-sm inline-flex items-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />{" "}
                    {t.adminGalleryEdit.updatingBtn}
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />{" "}
                    {t.adminGalleryEdit.updateBtn.replace("✓ ", "")}
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
