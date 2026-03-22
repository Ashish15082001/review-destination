import { EmailTemplate } from "@/components/email-template/email-template";
import { ApiResponse } from "@/types/apiResponse";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  userName: string;
  passwordResetLink: string;
  recipientEmail: string;
  subject: string;
}

export default async function sendEmail({
  userName,
  passwordResetLink,
  recipientEmail,
  subject,
}: SendEmailParams): Promise<ApiResponse> {
  try {
    console.log("Sending email with the following details:", {
      userName,
      passwordResetLink,
      recipientEmail,
    });
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: subject,
      react: EmailTemplate({ userName, passwordResetLink }),
    });

    if (error) {
      return { type: "error", message: "Failed to send email." };
    }

    return {
      type: "success",
      message: "Please check your email for the password reset link.",
    };
  } catch (error) {
    return {
      type: "error",
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}
