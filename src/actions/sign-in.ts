"use server";

import { UserSignInData, UserSignInDataSchema } from "@/schema/user";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { getUserDataByEmail } from "@/repository/user";
import { insertUserSession } from "@/repository/userSession";
import { ApiResponse } from "@/types/apiResponse";
import validateCsrfToken from "@/utils/validateCsrfToken";

const BCRYPT_DUMMY_HASH =
  "$2b$10$CwTycUXWue0Thq9StjUM0uJ8z5rZ3G9oFj1Yy/8aK7fXnY2DFe"; // bcrypt hash of "password" (used to prevent timing attacks)

/**
 * Server action to sign in an existing user.
 *
 * Validates credentials using Zod, looks up the user by email, verifies the password,
 * creates a new session (expires in 7 days), and sets the `sessionId` cookie.
 *
 * Follows these steps:
 * 1. Validate the input using Zod. If validation fails, return an error response with field-level error messages.
 * 2. Look up the user by email. If the user does not exist, return a generic "Invalid Credentials" error (do not reveal whether the email exists).
 * 3. If the user exists, compare the provided password with the stored hashed password using bcrypt. If it does not match, return a generic "Invalid Credentials" error.
 * 4. If the password matches, create a new session in the database with an expiration time of 7 days.
 *
 * @param prevData - The previous action state (used by `useActionState`).
 * @param formData - The form data containing `email` and `password`.
 * @returns An object indicating success or error, with a welcome message or field-level validation errors.
 */
export default async function signInUser(
  prevData: ApiResponse,
  formData: FormData,
): Promise<ApiResponse> {
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

    // step 1
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

    // step 2
    const userSignInData: UserSignInData = validationResult.data;
    const userData = await getUserDataByEmail({ email: userSignInData.email });

    if (!userData) {
      returnValue.type = "error";
      returnValue.message = "Invalid Credentials.";
      return returnValue;
    }

    // Step 3
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

    // Step 4
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
}
