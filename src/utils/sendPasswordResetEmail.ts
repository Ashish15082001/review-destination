import { PasswordResetEmailTemplate } from "@/components/email-template/password-reset-email-template";
import { ApiResponse } from "@/types/apiResponse";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendPasswordResetEmailParams {
  userName: string;
  passwordResetLink: string;
  recipientEmail: string;
}

export default async function sendPasswordResetEmail({
  userName,
  passwordResetLink,
  recipientEmail,
}: SendPasswordResetEmailParams): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: `Password Reset Request for ${userName}`,
      react: PasswordResetEmailTemplate({ userName, passwordResetLink }),
    });

    if (error) throw new Error();

    return {
      type: "success",
      message: "Please check your inbox.",
    };
  } catch (error) {
    return {
      type: "error",
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}
