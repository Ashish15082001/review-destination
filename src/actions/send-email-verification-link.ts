"use server";

import { getUserDataByEmail } from "@/repository/user";
import crypto from "crypto";
import generateEmailVerificationLink from "@/utils/generateEmailVerificationLink";
import { ApiResponse } from "@/types/apiResponse";
import { insertEmailVerificationData } from "@/repository/email-verification";
import { SendEmailVerificationLinkFormDataSchema } from "@/schema/email-verification";
import sendEmailVerificationEmail from "@/utils/sendEmailVerficationEmail";

export default async function sendEmailVerificationLink(
  prevData: ApiResponse,
  formData: FormData,
): Promise<ApiResponse> {
  const email = formData.get("email") as string;

  const validationResult = SendEmailVerificationLinkFormDataSchema.safeParse({
    email,
  });

  // Prepare the return value with validation results.
  const returnValue: ApiResponse = {
    type: validationResult.success ? "success" : "error",
    message: validationResult.success
      ? "If an account with this email exists, a verification link has been sent."
      : "Please check your email and try again.",
    fields: {
      email: { value: email },
    },
  };

  // If validation fails, attach error messages to the respective fields.
  if (!validationResult.success) {
    validationResult.error.issues.forEach((issue) => {
      const fieldName = issue.path[0];
      if (returnValue.fields)
        returnValue.fields[fieldName] = {
          ...returnValue.fields[fieldName],
          error: issue.message,
        };
      else returnValue.fields = { [fieldName]: { error: issue.message } };
    });

    return returnValue;
  }

  const userData = await getUserDataByEmail({ email });

  if (userData) {
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const emailVerificationLink =
      generateEmailVerificationLink(verificationToken);

    const sendEmailResponse = await sendEmailVerificationEmail({
      emailVerificationLink: emailVerificationLink,
      userName: userData.userName,
      recipientEmail: userData.email,
    });

    await insertEmailVerificationData({
      email: userData.email,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // Set token to expire in 10 minutes. Adjust as needed.
    });

    return sendEmailResponse;
  }

  return {
    type: "success",
    message:
      "If an account with this email exists, a verification link has been sent.",
  };
}
