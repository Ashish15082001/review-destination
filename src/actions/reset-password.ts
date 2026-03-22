"use server";

import {
  getUserDataByEmail,
  updateUserPasswordByEmail,
} from "@/repository/user";
import crypto from "crypto";
import { ApiResponse } from "@/types/apiResponse";
import {
  deletePasswordResetData,
  getPasswordResetDataByToken,
} from "@/repository/user-password-reset";
import { ResetPasswordFormDataSchema } from "@/schema/user-password-reset";
import getHashedPasswordWithSalt from "@/utils/getHashWithSalt";

const resetPassword = async (
  prevData: ApiResponse,
  formData: FormData,
): Promise<ApiResponse> => {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const validationResult = ResetPasswordFormDataSchema.safeParse({
    token,
    password,
    confirmPassword,
  });

  // Prepare the return value with validation results.
  const returnValue: ApiResponse = {
    type: validationResult.success ? "success" : "error",
    message: validationResult.success
      ? "Your password has been reset successfully."
      : "Please check the form for errors and try again.",
    fields: {
      token: { value: token },
      password: { value: password },
      confirmPassword: { value: confirmPassword },
    },
  };

  // check if password and confirm password match
  if (password !== confirmPassword) {
    returnValue.type = "error";
    returnValue.message = "Passwords do not match.";

    return returnValue;
  }

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

  // get password reset data from database using the token
  const passwordResetData = await getPasswordResetDataByToken({ token });

  if (!passwordResetData) {
    return {
      type: "error",
      message: "Invalid or expired token.",
    };
  }

  // check if the token has expired
  if (passwordResetData.expiresAt < new Date()) {
    // delete the expired token from the database
    await deletePasswordResetData({
      email: passwordResetData.email,
      token,
    });

    return {
      type: "error",
      message: "Token has expired. Please request a new password reset link.",
    };
  }

  const userData = await getUserDataByEmail({ email: passwordResetData.email });

  if (!userData) {
    return {
      type: "error",
      message: "User not found.",
    };
  }

  const { hashedPassword } = await getHashedPasswordWithSalt(password);

  // update the user's password in the database
  const updateResult = await updateUserPasswordByEmail({
    email: userData.email,
    password: hashedPassword,
  });

  if (!updateResult) {
    return {
      type: "error",
      message: "Failed to update password. Please try again.",
    };
  }

  return {
    type: "success",
    message: "Your password has been reset successfully.",
  };
};

export default resetPassword;
