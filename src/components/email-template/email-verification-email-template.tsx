interface EmailVerificationEmailTemplateProps {
  userName: string;
  emailVerificationLink: string;
}

export function EmailVerificationEmailTemplate({
  userName,
  emailVerificationLink,
}: EmailVerificationEmailTemplateProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome, {userName}!</h1>
      <p className="mt-2">
        Please click the link below to verify your email address and complete
        your registration:
      </p>
      <a href={emailVerificationLink} className="text-blue-500 hover:underline">
        Verify Email
      </a>

      {/* note */}
      <div className="mt-4 rounded-md border-l-4 border-yellow-400 bg-yellow-50 p-4">
        <p className="text-sm text-yellow-700">
          If you did not request an email verification, please ignore this
          email.
        </p>
        <p className="mt-2 text-sm text-yellow-700">
          For security reasons, the email verification link will expire in 10
          minutes. If you need to verify your email after that, please request a
          new email verification link.
        </p>
      </div>
    </div>
  );
}
