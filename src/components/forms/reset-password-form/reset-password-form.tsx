"use client";

import Link from "next/link";
import resetPassword from "@/actions/reset-password";
import { useActionState } from "react";

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState(resetPassword, {});

  return (
    <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Reset Password
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Set a new password for your account.
        </p>
      </div>

      {state.message && (
        <div
          className={`rounded-xl border p-3 text-sm ${
            state.type === "success"
              ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900/60 dark:bg-green-900/20 dark:text-green-300"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-300"
          }`}
        >
          {state.message}
        </div>
      )}

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="token" value={token ?? ""} />

        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            New Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#853853] focus:ring-2 focus:ring-[#853853]/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={6}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#853853] focus:ring-2 focus:ring-[#853853]/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <button
          type="submit"
          className="w-full cursor-pointer rounded-xl bg-[#853853] px-4 py-3 font-semibold text-white transition-colors hover:bg-[#6f2f46]"
          disabled={isPending}
        >
          {isPending ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Back to{" "}
        <Link
          href="/auth?mode=sign-in"
          className="font-semibold text-[#853853] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
