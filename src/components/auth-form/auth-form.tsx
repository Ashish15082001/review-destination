"use client";

import signInUser from "@/actions/sign-in";
import signUpUser from "@/actions/sign-up";
import { useActionState, useEffect, useState } from "react";
import { AuthMode } from "@/lib/auth-mode";
import Link from "next/link";
import { redirect } from "next/navigation";

const HERO_IMAGE_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBcWYScyAD8p7n2j-QA5BDProOkVx_o6_dPuKCtHr_hiMvrj_lORu8NfvMDcRsUesHo7oRCs_je75AUzF7uq219XuUq97SlRrCNuUGUpGJCd5aJ6sUT0G7wVqydxdKK-9hH9UP-TABwffICNE9CL6PFIP37olzAsJkkY8A4eQ_jqyt2SDouy3RlvdM2YrHUjtdWbsJlgQ1Id9n_-kaKYyZb24k0jtUagHrgZta-kv7XDsVD2HtNN7paHDBzu4TSb0rXg61J1eG1UO0t";

const AVATAR_URLS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDeKOn_44nIEK9YZnZxMinptT1iY0lfCy5ySpEGuA_24-Pl8bvsdgv2krxVUH3_nLVTjcNIbGNMOUhMxYqy-4aTCcT--PzwQLn7Ts6SIhqf32EHPDs8GdD6J4YsZxmOvrLwxSWlKfPs2JksMWDM0X9-PdbU16TDpDhz7uBNLtY2AKjOtmx3AtNLyHi-pb-5cscCvc7R0YM_DoxmUN-utl0jEvgLsyn807I4UNEIfZnCHCD0RlXeQlJMKbpaArGcZmd8kvQum3bIUCHj",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDTUHbSkM2HTgkY9tQr-rZOZnfw5GMHNqXg0Ds1XGHg9Xyb9jWjTXA8cGd8tQOKaKGsW7MK-IIlwhGy1zrTI44NIittS6au_DiEwn5Tlkxalyhiyq37gOSRwYoE7Qy4cJlQmrYkZkz1DADFJISESeV1nXadDUtme0s22dxJFRqYmFyYI08xnPMtLKteNM8Vr7hvbjoJCCRGH9NZZ5dYoEC-RKz-vug9GVLwpUfPAPEI-VguhqkB4JG3jjRoe6aSC2ppKDOFKqFBqI28",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCI5YfS80SzEGhJS5p4qqiO9_Sx1-ufz2LlIcc0Ck_QIGxHP7dVmk7BTQf09aHAT-qxOwnLEosHjYMP0Lrwq5-_2Ni6w8Z0DZKpH7xk_o-CwHaQCpGGm90JnhwweL-y-WWhz-zCozrG-9u3rS4micBe3b1GkI7vyjFJlbG2TuTXP93-ZvSneUlJ3baW8ogRuaBOp8r29xKZ_DcKgdUdINzAxJdFGzRQmI9wW76XM8m1sEOSkyUNEeFgdORippw0-Orm54PW5lHTWuD4",
];

export default function AuthForm({ mode }: { mode: AuthMode }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [state, formAction, isPending] = useActionState(
    mode === AuthMode.SIGN_IN ? signInUser : signUpUser,
    {},
  );

  useEffect(() => {
    if (state.type === "success") redirect("/");
  }, [state.type]);

  const isSignIn = mode === AuthMode.SIGN_IN;

  return (
    <div className="flex min-h-screen font-[family-name:var(--font-geist-sans)]">
      {/* ── Left Hero Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${HERO_IMAGE_URL}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3 text-white">
            <div className="size-10 bg-amber-400 rounded-xl flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 text-stone-900"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Review Destination
            </h2>
          </div>

          {/* Headline */}
          <div className="max-w-md">
            <h1 className="text-6xl font-extrabold text-white leading-tight mb-6">
              {isSignIn ? "Welcome Back, Explorer!" : "Join the Community!"}
            </h1>
            <p className="text-xl text-white/90 font-medium">
              {isSignIn
                ? "Log in to share your latest adventures and discover hidden gems reviewed by travellers worldwide."
                : "Create your account and start sharing your travel experiences with a community of explorers."}
            </p>
          </div>

          {/* Social proof */}
          <div className="flex gap-4 items-center">
            <div className="flex -space-x-3">
              {AVATAR_URLS.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Traveller ${i + 1}`}
                  className="size-10 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <p className="text-white/80 text-sm">
              Joined by 10k+ adventurers this month
            </p>
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-stone-950">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="size-8 bg-amber-400 rounded-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5 text-stone-900"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Review Destination
            </h2>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {isSignIn ? "Login to Your Account" : "Create an Account"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              {isSignIn
                ? "Enter your credentials to access your travel dashboard"
                : "Fill in the details below to get started"}
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" action={formAction}>
            {/* Username – sign-up only */}
            {!isSignIn && (
              <div className="space-y-1.5">
                <label
                  htmlFor="userName"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Username
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-5"
                    >
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </span>
                  <input
                    id="userName"
                    name="userName"
                    type="text"
                    defaultValue={
                      state.fields?.userName
                        ? (state.fields.userName.value as string)
                        : ""
                    }
                    placeholder="your_username"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all placeholder:text-slate-400"
                  />
                </div>
                {state.fields?.userName?.error && (
                  <p className="text-sm text-red-500 mt-1">
                    {state.fields.userName.error}
                  </p>
                )}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Email
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5"
                  >
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={
                    state.fields?.email
                      ? (state.fields.email.value as string)
                      : ""
                  }
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all placeholder:text-slate-400"
                />
              </div>
              {state.fields?.email?.error && (
                <p className="text-sm text-red-500 mt-1">
                  {state.fields.email.error}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>
                {isSignIn && (
                  <a
                    href="#"
                    className="text-sm font-semibold text-amber-500 hover:text-amber-400 transition-colors"
                  >
                    Forgot Password?
                  </a>
                )}
              </div>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5"
                  >
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                  </svg>
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  defaultValue={
                    state.fields?.password
                      ? (state.fields.password.value as string)
                      : ""
                  }
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-5"
                    >
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-5"
                    >
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                    </svg>
                  )}
                </button>
              </div>
              {state.fields?.password?.error && (
                <p className="text-sm text-red-500 mt-1">
                  {state.fields.password.error}
                </p>
              )}
            </div>

            {/* Confirm Password – sign-up only */}
            {!isSignIn && (
              <div className="space-y-1.5">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Confirm Password
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-5"
                    >
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                    </svg>
                  </span>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-5"
                      >
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-5"
                      >
                        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                      </svg>
                    )}
                  </button>
                </div>
                {state.fields?.confirmPassword?.error && (
                  <p className="text-sm text-red-500 mt-1">
                    {state.fields.confirmPassword.error}
                  </p>
                )}
              </div>
            )}

            {/* Global message */}
            {state.message && (
              <div
                className={`rounded-xl p-4 ${
                  state.type === "success"
                    ? "bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800"
                    : "bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800"
                }`}
              >
                <p
                  className={`text-sm ${
                    state.type === "success"
                      ? "text-green-700 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {state.message}
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-amber-400 hover:bg-amber-300 disabled:bg-slate-300 disabled:text-slate-500 text-stone-900 font-bold py-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-amber-400/20 cursor-pointer"
            >
              {isPending
                ? isSignIn
                  ? "Signing in…"
                  : "Creating account…"
                : isSignIn
                  ? "Log In"
                  : "Create Account"}
            </button>
          </form>

          {/* Mode toggle */}
          <p className="text-center text-slate-600 dark:text-slate-400 text-sm pt-2">
            {isSignIn ? (
              <>
                New here?{" "}
                <Link
                  href="/auth?mode=sign-up"
                  className="text-amber-500 font-bold hover:underline"
                >
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link
                  href="/auth?mode=sign-in"
                  className="text-amber-500 font-bold hover:underline"
                >
                  Log in
                </Link>
              </>
            )}
          </p>

          {/* Footer links */}
          <div className="flex justify-center gap-6 pt-4">
            <a
              href="#"
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              Help Center
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
