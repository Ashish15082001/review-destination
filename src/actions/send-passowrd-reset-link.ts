"use server";

import { getUserDataByEmail } from "@/repository/user";
import crypto from "crypto";
import generatePasswordResetLink from "@/utils/generatePasswordResetLink";
import sendEmail from "@/utils/sendEmail";
import { ApiResponse } from "@/types/apiResponse";
import { SendPasswordResetLinkFormDataSchema } from "@/schema/user-password-reset";
import { insertPasswordResetData } from "@/repository/user-password-reset";

const sendPasswordResetLink = async (
  prevData: ApiResponse,
  formData: FormData,
): Promise<ApiResponse> => {
  const email = formData.get("email") as string;

  const validationResult = SendPasswordResetLinkFormDataSchema.safeParse({
    email,
  });

  // Prepare the return value with validation results.
  const returnValue: ApiResponse = {
    type: validationResult.success ? "success" : "error",
    message: validationResult.success
      ? "If an account with this email exists, a password reset link has been sent."
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
    // Generate a secure random token. In production, consider using a more robust solution and storing the token with an expiration time in the database.
    const validationToken = crypto.randomBytes(32).toString("hex");
    const passwordResetLink = generatePasswordResetLink(validationToken);

    const sendEmailResponse = await sendEmail({
      passwordResetLink,
      userName: userData.userName,
      recipientEmail: userData.email,
      subject: `Password Reset Request for ${userData.userName}`,
    });

    await insertPasswordResetData({
      email: userData.email,
      token: validationToken,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // Set token to expire in 30 minutes. Adjust as needed.
    });

    return sendEmailResponse;
  }

  return {
    type: "success",
    message:
      "If an account with this email exists, a password reset link has been sent.",
  };
};

export default sendPasswordResetLink;
