"use client";

import verifyEmail from "@/actions/verify-email";
import { redirect } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";

export default function VerifyEmailForm({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState(verifyEmail, {});
  const formRef = useRef<HTMLFormElement | null>(null);

  // auto submit the form when the component mounts
  useEffect(() => {
    if (formRef.current) formRef.current.requestSubmit();
  }, []);

  // start timer for redirecting to profile page after successful verification
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (state.type === "success") {
      timer = setTimeout(() => {
        redirect("/profile");
      }, 3000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [state.type]);

  return (
    <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Email Verification
        </h1>
        {isPending && (
          <p className="text-slate-500 dark:text-slate-400">
            Verifying your email...
          </p>
        )}

        {state.type === "error" && (
          <p className="text-red-500 dark:text-red-400">
            {state.message || "Failed to verify email. Please try again."}
          </p>
        )}

        {state.type === "success" && (
          <p className="text-green-500 dark:text-green-400">
            Your email has been verified successfully. Redirecting to Profile
            page...
          </p>
        )}
      </div>

      <form hidden action={formAction} className="space-y-5" ref={formRef}>
        <input hidden type="hidden" name="token" value={token} />

        <button
          type="submit"
          className="w-full cursor-pointer rounded-xl bg-[#853853] px-4 py-3 font-semibold text-white transition-colors hover:bg-[#6f2f46]"
          disabled={isPending}
          hidden
        />
      </form>
    </div>
  );
}
