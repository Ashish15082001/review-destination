"use client";

import SendEmailVerificationLinkActionButton from "@/components/action-buttons/send-email-verification-link-action-button";
import Link from "next/link";

export default function ErrorPage({ error }: { error: Error }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-900">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Invalid or Expired Token
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {error?.message ||
              "The email verification link is invalid or has expired. Please request a new one."}
          </p>
        </div>

        {/* <SendEmailVerificationLinkActionButton /> */}
      </div>
    </main>
  );
}
