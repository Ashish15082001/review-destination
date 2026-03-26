"use server";

import { getUserDataByEmail, setUserAsVerified } from "@/repository/user";
import { ApiResponse } from "@/types/apiResponse";
import { VerifyEmailFormDataSchema } from "@/schema/email-verification";
import {
  deleteEmailVerificationData,
  getEmailVerificationDataByToken,
} from "@/repository/email-verification";

export default async function verifyEmail(
  prevData: ApiResponse,
  formData: FormData,
): Promise<ApiResponse> {
  const token = formData.get("token") as string;

  const validationResult = VerifyEmailFormDataSchema.safeParse({
    token,
  });

  // Prepare the return value with validation results.
  const returnValue: ApiResponse = {
    type: validationResult.success ? "success" : "error",
    message: validationResult.success
      ? "Your email has been verified successfully."
      : "Please check the form for errors and try again.",
    fields: {
      token: { value: token },
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

  // get email verification data from database using the token
  const emailVerificationData = await getEmailVerificationDataByToken({
    token,
  });

  if (!emailVerificationData) {
    return {
      type: "error",
      message: "Invalid or expired token.",
    };
  }

  // check if the token has expired
  if (emailVerificationData.expiresAt < new Date()) {
    // delete the expired token from the database
    await deleteEmailVerificationData({
      token,
    });

    return {
      type: "error",
      message: "Token has expired. Please request a new password reset link.",
    };
  }

  const userData = await getUserDataByEmail({
    email: emailVerificationData.email,
  });

  if (!userData) {
    return {
      type: "error",
      message: "User not found.",
    };
  }

  //set user as verified in the database
  const updateResult = await setUserAsVerified({
    email: userData.email,
  });

  await deleteEmailVerificationData({
    token,
  });

  if (!updateResult) {
    return {
      type: "error",
      message: "Failed to verify email. Please try again.",
    };
  }

  return {
    type: "success",
    message: "Your email has been verified successfully.",
  };
}
