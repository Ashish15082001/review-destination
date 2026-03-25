import ResetPasswordForm from "@/components/forms/reset-password-form/reset-password-form";
import { getPasswordResetDataByToken } from "@/repository/user-password-reset";

export default async function ResetPasswordPage({
  searchParams,
}: PageProps<"/reset-password">) {
  const { token } = await searchParams;

  if (!token || typeof token !== "string") {
    throw new Error("Token is required to reset password.");
  }

  const passwordResetData = await getPasswordResetDataByToken({ token });

  if (!passwordResetData)
    throw new Error(
      "Invalid or expired token. Please request a new password reset link.",
    );

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-900">
      <ResetPasswordForm token={token} />
    </main>
  );
}
