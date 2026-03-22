import SendPasswordResetLinkForm from "@/components/forms/send-password-reset-link-form/send-password-reset-link-form";

export default async function SendPasswordResetLinkPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-900">
      <SendPasswordResetLinkForm />
    </main>
  );
}
