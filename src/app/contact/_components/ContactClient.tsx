"use client";

import { useActionState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { sendContactMessage, type ContactActionState } from "../actions";
import {
  MapPin,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { siteConfig } from "@/config/siteConfig";

// ─── Initial state for useActionState ────────────────────────────────────────

const INITIAL_STATE: ContactActionState = { status: "idle", error: null };

// ─── Info Row sub-component ───────────────────────────────────────────────────

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 shrink-0 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-[#c9a84c]">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-[#0a1628] text-sm mb-1">{label}</h3>
        {children}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ContactClient() {
  const { t } = useLanguage();

  // useActionState wires the server action directly to the form —
  // no manual fetch, no useState for loading, works without JS too.
  const [state, formAction, isPending] = useActionState(
    sendContactMessage,
    INITIAL_STATE,
  );

  return (
    <div className="bg-[#f5f3ee] min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="bg-[#0a1628] text-white py-14 text-center px-4">
        <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-widest mb-2">
          {t.contact.heroBadge}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold">
          {t.contact.heroTitle}
        </h1>
        <p className="mt-3 text-gray-400 text-sm max-w-md mx-auto">
          {t.contact.heroSubtitle}
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* ── Left: Contact Info ───────────────────────────────────────── */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#0a1628] mb-4">
                {t.contact.addressTitle}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t.contact.addressDesc}
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <InfoRow
                icon={<MapPin className="w-5 h-5" strokeWidth={1.8} />}
                label={t.contact.officeLabel}
              >
                <p className="text-sm text-gray-500">
                  {t.contact.officeAddress1}
                  <br />
                  {t.contact.officeAddress2}
                </p>
              </InfoRow>

              <InfoRow
                icon={<Mail className="w-5 h-5" strokeWidth={1.8} />}
                label={t.contact.emailLabel}
              >
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-sm text-[#c9a84c] hover:underline font-semibold"
                >
                  {siteConfig.contact.email}
                </a>
              </InfoRow>

              <InfoRow
                icon={
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                }
                label={t.contact.socialLabel}
              >
                <a
                  href={siteConfig.links.facebookGroup}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#c9a84c] hover:underline font-semibold"
                >
                  {t.contact.fbGroupText}
                </a>
              </InfoRow>
            </div>
          </div>

          {/* ── Right: Contact Form ──────────────────────────────────────── */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#0a1628] mb-6">
              {t.contact.formTitle}
            </h2>

            {/* Success state — shown after server action returns success */}
            {state.status === "success" ? (
              <div className="flex flex-col items-center justify-center gap-4 py-10 text-center animate-fade-up">
                <CheckCircle2
                  className="w-14 h-14 text-green-500"
                  strokeWidth={1.5}
                />
                <div>
                  <p className="text-base font-bold text-[#0a1628]">
                    {t.contact.successTitle}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {t.contact.successMessage}
                  </p>
                </div>
              </div>
            ) : (
              <form action={formAction} className="flex flex-col gap-4">
                {/* Server-side error banner */}
                {state.status === "error" && state.error && (
                  <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 animate-fade-up">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{state.error}</span>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                    {t.contact.nameLabel}
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    disabled={isPending}
                    className="w-full bg-[#f5f3ee] border border-transparent focus:border-[#c9a84c] rounded-lg px-4 py-3 text-sm outline-none transition-colors disabled:opacity-60"
                    placeholder={t.contact.namePlaceholder}
                  />
                </div>

                {/* Email or Phone */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                    {t.contact.contactLabel}
                  </label>
                  <input
                    type="text"
                    name="contact"
                    required
                    disabled={isPending}
                    className="w-full bg-[#f5f3ee] border border-transparent focus:border-[#c9a84c] rounded-lg px-4 py-3 text-sm outline-none transition-colors disabled:opacity-60"
                    placeholder={t.contact.contactPlaceholder}
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                    {t.contact.messageLabel}
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    disabled={isPending}
                    className="w-full bg-[#f5f3ee] border border-transparent focus:border-[#c9a84c] rounded-lg px-4 py-3 text-sm outline-none transition-colors resize-none disabled:opacity-60"
                    placeholder={t.contact.messagePlaceholder}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="mt-2 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#c9a84c] to-[#e8c96d] text-[#0a1628] font-bold py-3.5 rounded-lg shadow-md hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t.contact.submittingBtn}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" strokeWidth={2} />
                      {t.contact.submitBtn}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
