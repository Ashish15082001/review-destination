"use server";

import AuthForm from "@/components/auth-form/auth-form";
import { AuthMode } from "@/lib/auth-mode";

export default async function AuthPage({ searchParams }: PageProps<"/auth">) {
  const modeParam = (await searchParams).mode;
  const authMode: AuthMode =
    modeParam &&
    typeof modeParam === "string" &&
    Object.values(AuthMode).includes(modeParam as AuthMode)
      ? (modeParam as AuthMode)
      : AuthMode.SIGN_IN;

  console.log(authMode);

  return <AuthForm mode={authMode} />;
}
