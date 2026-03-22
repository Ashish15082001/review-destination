interface EmailTemplateProps {
  userName: string;
  passwordResetLink: string;
}

export function EmailTemplate({
  userName,
  passwordResetLink,
}: EmailTemplateProps) {
  return (
    <div>
      <h1>Welcome, {userName}!</h1>
      <p>
        You requested a password reset. Click the link below to reset your
        password:
      </p>
      <a href={passwordResetLink}>Reset Password</a>
    </div>
  );
}
