"use server";

import { createUserSession, getUserData } from "@/lib/mongodb";
import { SignInUserDataFromBrowserSchema } from "@/schema/schema";
import { cookies } from "next/headers";

const signInUser = async (
  prevData: SignInUserReturnType,
  formData: FormData,
): Promise<SignInUserReturnType> => {
  try {
    // sign in user and return user data

    const userName = formData.get("userName") as string;
    const password = formData.get("password") as string;

    // Validate form data with Zod
    const validationResult = SignInUserDataFromBrowserSchema.safeParse({
      userName,
      password,
    });

    const returnValue: SignInUserReturnType = {
      type: validationResult.success ? "success" : "error",
      fields: {
        userName: {
          value: userName,
        },
        password: {
          value: password,
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

    const userData = await getUserData({ userName });

    if (!userData) {
      returnValue.type = "error";
      returnValue.fields = {
        ...returnValue.fields,
        userName: {
          ...returnValue.fields?.userName,
          error: "User does not exist.",
        },
      };
      return returnValue;
    }

    if (userData.password !== password) {
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

    const sessionData = await createUserSession({
      userId: userData._id,
      expiresOn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Session expires in 7 days
    });

    const sessionCookie = await cookies();

    sessionCookie.set("sessionId", sessionData.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    returnValue.type = "success";
    returnValue.message = `Welcome back, ${userName}!`;
    return returnValue;
  } catch (error: any) {
    console.error("Error in signInUser:", error);
    return {
      type: "error",
      message:
        error.message ||
        "An unexpected error occurred. Please try again later.",
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
