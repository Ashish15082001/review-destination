"use server";

import AuthForm from "@/components/forms/auth-form/auth-form";
import { AuthMode } from "@/types/auth-mode";

export default async function AuthPage({ searchParams }: PageProps<"/auth">) {
  const modeParam = (await searchParams).mode;
  const authMode: AuthMode =
    modeParam &&
    typeof modeParam === "string" &&
    Object.values(AuthMode).includes(modeParam as AuthMode)
      ? (modeParam as AuthMode)
      : AuthMode.SIGN_IN;

  return <AuthForm mode={authMode} key={authMode} />;
}
