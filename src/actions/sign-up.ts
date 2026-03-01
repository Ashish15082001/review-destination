"use server";

import {
  getUserDataByEmail,
  insertUserSession,
  registerNewUser,
} from "@/lib/mongodb";
import { SignUpUserDataFromBrowserSchema } from "@/schema/user";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";

/**
 * Server action to register a new user.
 *
 * Validates credentials using Zod, checks that the email is not already taken,
 * registers the user in the database, creates a new session (expires in 7 days),
 * and sets the `sessionId` cookie.
 *
 * @param prevData - The previous action state (used by `useActionState`).
 * @param formData - The form data containing `email`, `password`, `confirmPassword`, and `userName`.
 * @returns An object indicating success or error, with a welcome message or field-level validation errors.
 */
const signUpUser = async (
  prevData: SignUpUserReturnType,
  formData: FormData,
): Promise<SignUpUserReturnType> => {
  try {
    const userName = formData.get("userName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    console.log("Received form data:", {
      userName,
      email,
      password,
      confirmPassword,
    });

    // Validate form data with Zod
    const validationResult = SignUpUserDataFromBrowserSchema.safeParse({
      userName,
      email,
      password,
      confirmPassword,
    });

    const returnValue: SignUpUserReturnType = {
      type: validationResult.success ? "success" : "error",
      fields: {
        userName: {
          value: userName,
        },
        email: {
          value: email,
        },
        password: {
          value: "",
        },
        confirmPassword: {
          value: "",
        },
      },
    };

    if (password !== confirmPassword) {
      returnValue.type = "error";
      returnValue.fields = {
        ...returnValue.fields,
        confirmPassword: {
          ...returnValue.fields?.confirmPassword,
          error: "Passwords do not match",
        },
      };
      return returnValue;
    }

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

    // check if email already exists
    const existingUserByEmail = await getUserDataByEmail({ email });

    if (existingUserByEmail) {
      returnValue.type = "error";
      returnValue.fields = {
        ...returnValue.fields,
        email: {
          ...returnValue.fields?.email,
          error: "Invalid credentials. Please try again.",
        },
      };
      return returnValue;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const registeredUserId = await registerNewUser({
      userName,
      email,
      password: hashedPassword,
      registeredAt: new Date(),
    });

    const sessionData = await insertUserSession({
      userId: registeredUserId,
      expiresOn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Session expires in 7 days
    });

    const sessionCookie = await cookies();

    sessionCookie.set("sessionId", sessionData.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    returnValue.type = "success";
    returnValue.message = `Welcome ${userName}!`;
    return returnValue;
  } catch (error: any) {
    return {
      type: "error",
      message: "An unexpected error occurred. Please try again later.",
    };
  }
};

export interface SignUpUserReturnType {
  type?: "success" | "error";
  message?: string;
  fields?: Record<
    PropertyKey,
    {
      value?: string;
      error?: string;
    }
  >;
}

export default signUpUser;
