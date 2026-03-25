"use client";

import signOutUser from "@/actions/sign-out";
import { ApiResponse } from "@/types/apiResponse";
import { useActionState } from "react";

const initialState: ApiResponse = {};

function SignOutActionButton() {
  const [state, action, isPending] = useActionState(signOutUser, initialState);

  return (
    <form action={action}>
      <button
        type="submit"
        className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-[#F3F4F4] text-[#2C2C2C] text-sm font-bold border border-[#853853]/10 hover:border-[#853853]/30 transition-all"
        disabled={isPending}
      >
        {isPending ? "Signing Out..." : "Sign Out"}
      </button>
    </form>
  );
}

export default SignOutActionButton;
