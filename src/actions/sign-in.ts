"use server";

import { getUserDataByEmail, insertUserSession } from "@/lib/mongodb";
import { SignInUserDataFromBrowserSchema } from "@/schema/user";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";

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
  prevData: SignInUserReturnType,
  formData: FormData,
): Promise<SignInUserReturnType> => {
  try {
    // sign in user and return user data

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validate form data with Zod
    const validationResult = SignInUserDataFromBrowserSchema.safeParse({
      email,
      password,
    });

    const returnValue: SignInUserReturnType = {
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

    const userData = await getUserDataByEmail({ email });

    if (!userData) {
      returnValue.type = "error";
      returnValue.fields = {
        ...returnValue.fields,
        email: {
          ...returnValue.fields?.email,
          error: "No account found with this email.",
        },
      };
      return returnValue;
    }

    const passwordMatch = await bcrypt.compare(password, userData.password);
    if (!passwordMatch) {
      returnValue.type = "error";
      returnValue.fields = {
        ...returnValue.fields,
        password: {
          ...returnValue.fields?.password,
          error: "Incorrect password.",
        },
      };
      return returnValue;
    }

    const sessionData = await insertUserSession({
      userId: userData._id,
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
    returnValue.message = `Welcome back, ${userData.userName}!`;
    return returnValue;
  } catch (error: any) {
    console.error("Error in signInUser:", error);
    return {
      type: "error",
      message: "An unexpected error occurred. Please try again later.",
    };
  }
};

export interface SignInUserReturnType {
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

export default signInUser;
