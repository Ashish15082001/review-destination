"use server";

import { UserSignInData, UserSignInDataSchema } from "@/schema/user";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { getUserDataByEmail } from "@/repository/user";
import { insertUserSession } from "@/repository/userSession";
import { ApiResponse } from "@/types/apiResponse";
import getHashedPasswordWithSalt from "@/utils/getHashWithSalt";

const BCRYPT_DUMMY_HASH =
  "$2b$10$CwTycUXWue0Thq9StjUM0uJ8z5rZ3G9oFj1Yy/8aK7fXnY2DFe"; // bcrypt hash of "password" (used to prevent timing attacks)

/**
 * Server action to sign in an existing user.
 *
 * Validates credentials using Zod, looks up the user by username, verifies the password,
 * creates a new session (expires in 7 days), and sets the `sessionId` cookie.
 *
 * @param prevData - The previous action state (used by `useActionState`).
 * @param formData - The form data containing `userName` and `password`.
 * @returns An object indicating success or error, with a welcome message or field-level validation errors.
 */
const signInUser = async (
  prevData: ApiResponse,
  formData: FormData,
): Promise<ApiResponse> => {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const validationResult = UserSignInDataSchema.safeParse({
      email,
      password,
    });

    const returnValue: ApiResponse = {
      type: validationResult.success ? "success" : "error",
      fields: {
        email: {
          value: email,
        },
        password: {
          value: "", // never echo passwords back to the client
        },
      },
    };

    if (!validationResult.success) {
      validationResult.error.issues.forEach((issue) => {
        const fieldName = issue.path[issue.path.length - 1];
        if (returnValue.fields)
          returnValue.fields[fieldName] = {
            ...returnValue.fields[fieldName],
            error: issue.message,
          };
        else returnValue.fields = { [fieldName]: { error: issue.message } };
      });

      return returnValue;
    }

    const userSignInData: UserSignInData = validationResult.data;
    const userData = await getUserDataByEmail({ email: userSignInData.email });

    if (!userData) {
      returnValue.type = "error";
      returnValue.message = "Invalid Credentials.";
      return returnValue;
    }

    const doesPasswordMatch = await bcrypt.compare(
      userSignInData.password,
      userData.password,
    );

    if (!doesPasswordMatch) {
      console.warn(
        `Failed login attempt for email: ${userSignInData.email} - Incorrect password.`,
      );
      returnValue.type = "error";
      returnValue.message = "Invalid Credentials.";
      return returnValue;
    }

    const sessionData = await insertUserSession({
      userId: userData._id,
      expiresOn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Session expires in 7 days
    });

    const sessionCookie = await cookies();

    sessionCookie.set("sessionId", sessionData.toString(), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    returnValue.type = "success";
    returnValue.message = `Welcome back, ${userData.userName}!`;
    return returnValue;
  } catch (error) {
    console.log("Error in signInUser action:", error);
    return {
      type: "error",
      message: "An unexpected error occurred. Please try again later.",
    };
  }
};

export default signInUser;
