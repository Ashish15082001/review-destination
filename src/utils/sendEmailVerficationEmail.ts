import { EmailVerificationEmailTemplate } from "@/components/email-template/email-verification-email-template";
import { ApiResponse } from "@/types/apiResponse";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailVerificationEmailParams {
  userName: string;
  emailVerificationLink: string;
  recipientEmail: string;
}

export default async function sendEmailVerificationEmail({
  userName,
  emailVerificationLink,
  recipientEmail,
}: SendEmailVerificationEmailParams): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: `Email Verification Request for ${userName}`,
      react: EmailVerificationEmailTemplate({
        userName,
        emailVerificationLink,
      }),
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
