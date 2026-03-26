"use client";

import sendEmailVerificationLink from "@/actions/send-email-verification-link";
import { ApiResponse } from "@/types/apiResponse";
import { useActionState } from "react";

const initialState: ApiResponse = {};

interface SendEmailVerificationLinkActionButtonProps {
  email: string;
}

export default function SendEmailVerificationLinkActionButton({
  email,
}: SendEmailVerificationLinkActionButtonProps) {
  const [state, action, isPending] = useActionState(
    sendEmailVerificationLink,
    initialState,
  );

  return (
    <div className="flex items-center justify-center mt-4 space-x-4 flex-col gap-2">
      <form action={action}>
        <input type="hidden" name="email" value={email} />
        <button
          type="submit"
          className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-[#F3F4F4] text-[#2C2C2C] text-sm font-bold border border-[#853853]/10 hover:border-[#853853]/30 transition-all"
          disabled={isPending}
        >
          {isPending ? "Sending..." : "Verify Email"}
        </button>
      </form>
      {state.message && state.type === "success" ? (
        <p className="text-green-600 dark:text-green-400 text-sm mb-2">
          {state.message}
        </p>
      ) : state.message && state.type === "error" ? (
        <p className="text-red-600 dark:text-red-400 text-sm mb-2">
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
