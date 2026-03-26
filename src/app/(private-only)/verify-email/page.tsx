import VerifyEmailForm from "@/components/forms/verify-email-form/verify-email-form";

export default async function VerifyEmailPage({
  searchParams,
}: PageProps<"/verify-email">) {
  const { token } = await searchParams;

  if (!token || typeof token !== "string") {
    throw new Error("Token is required to verify email.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-900">
      <VerifyEmailForm token={token} />
    </main>
  );
}
