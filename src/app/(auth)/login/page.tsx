"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import { translateNumbers } from "@/utils/translateNumbers";
import { ArrowLeft, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { t, lang, toggleLang } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      if (
        authError.message.includes("Invalid login credentials") ||
        authError.message.includes("invalid_credentials")
      ) {
        setError(t.login.error.invalidCredentials);
      } else if (authError.message.includes("Email not confirmed")) {
        setError(t.login.error.unconfirmedEmail);
      } else if (authError.message.includes("Too many requests")) {
        setError(t.login.error.tooManyRequests);
      } else {
        setError(t.login.error.general);
      }
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#0a1628] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Warm gold glow behind the card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-[#c9a84c]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Language Toggle at Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={toggleLang}
          aria-label={lang === "bn" ? "Switch to English" : "বাংলায় দেখুন"}
          className="flex items-center bg-white/10 rounded-full p-0.5 gap-0.5"
        >
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${lang === "bn" ? "bg-[#c9a84c] text-[#0a1628]" : "text-white/60 hover:text-white"}`}
          >
            বাং
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${lang === "en" ? "bg-[#c9a84c] text-[#0a1628]" : "text-white/60 hover:text-white"}`}
          >
            EN
          </span>
        </button>
      </div>

      {/* ── Card ─────────────────────────────────────────────────────────── */}
      <div className="relative w-full max-w-md animate-fade-up">
        {/* Back to home link */}
        <div className="mb-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-gray-400 hover:text-[#c9a84c] text-sm transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.login.back}
          </Link>
        </div>

        {/* Card container */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-black/30 overflow-hidden">
          {/* Gold accent bar at top */}
          <div className="h-1.5 bg-gradient-to-r from-[#c9a84c] to-[#e8c96d]" />

          <div className="px-8 py-10 sm:px-10">
            {/* Brand header */}
            <div className="text-center mb-8">
              <div className="inline-flex w-16 h-16 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#e8c96d] items-center justify-center text-[#0a1628] font-bold text-2xl shadow-lg mb-4">
                তী
              </div>
              <h1 className="text-2xl font-bold text-[#0a1628] mb-1">
                {t.login.title}
              </h1>
              <p className="text-sm text-gray-500">{t.login.subtitle}</p>
            </div>

            {/* Error alert */}
            {error && (
              <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm animate-fade-up">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Login form */}
            <form
              onSubmit={handleLogin}
              className="flex flex-col gap-5"
              noValidate
            >
              {/* Email field */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-[#0a1628]"
                >
                  {t.login.emailLabel}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.login.emailPlaceholder}
                  required
                  autoComplete="email"
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-[#0a1628] placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              {/* Password field with show/hide toggle */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-[#0a1628]"
                >
                  {t.login.passwordLabel}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.login.passwordPlaceholder}
                    required
                    autoComplete="current-password"
                    disabled={loading}
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-gray-50 text-[#0a1628] placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a84c] focus:border-transparent transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  {/* Show/hide password toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0a1628] transition-colors p-1"
                    aria-label={
                      showPassword ? t.login.hidePassword : t.login.showPassword
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full py-3 rounded-xl font-bold text-[#0a1628] bg-gradient-to-r from-[#c9a84c] to-[#e8c96d] hover:opacity-90 transition-all duration-200 shadow-md shadow-[#c9a84c]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t.login.loggingInBtn}
                  </>
                ) : (
                  t.login.loginBtn
                )}
              </button>
            </form>
          </div>

          {/* Card footer */}
          <div className="px-8 py-4 sm:px-10 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">{t.login.footerNote}</p>
          </div>
        </div>

        {/* Below-card note */}
        <p className="text-center text-xs text-gray-600 mt-6">
          {t.login.copyright.replace(
            "{year}",
            translateNumbers(new Date().getFullYear().toString(), lang) ??
              new Date().getFullYear().toString(),
          )}
        </p>
      </div>
    </div>
  );
}
