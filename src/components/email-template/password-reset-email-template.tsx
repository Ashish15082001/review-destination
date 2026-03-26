interface PasswordResetEmailTemplateProps {
  userName: string;
  passwordResetLink: string;
}

export function PasswordResetEmailTemplate({
  userName,
  passwordResetLink,
}: PasswordResetEmailTemplateProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome, {userName}!</h1>
      <p className="mt-2">
        You requested a password reset. Click the link below to reset your
        password:
      </p>
      <a href={passwordResetLink} className="text-blue-500 hover:underline">
        Reset Password
      </a>

      {/* note */}
      <div className="mt-4 rounded-md border-l-4 border-yellow-400 bg-yellow-50 p-4">
        <p className="text-sm text-yellow-700">
          If you did not request a password reset, please ignore this email.
        </p>
        <p className="mt-2 text-sm text-yellow-700">
          For security reasons, the password reset link will expire in 10
          minutes. If you need to reset your password after that, please request
          a new password reset link.
        </p>
      </div>
    </div>
  );
}
