"use server";

import {
  getUserDataByUserName,
  insertUserSession,
  registerNewUser,
} from "@/lib/mongodb";
import { SignUpUserDataFromBrowserSchema } from "@/schema/user";
import { cookies } from "next/headers";

const signUpUser = async (
  prevData: SignUpUserReturnType,
  formData: FormData,
): Promise<SignUpUserReturnType> => {
  try {
    // sign in user and return user data

    const userName = formData.get("userName") as string;
    const password = formData.get("password") as string;

    // Validate form data with Zod
    const validationResult = SignUpUserDataFromBrowserSchema.safeParse({
      userName,
      password,
    });

    const returnValue: SignUpUserReturnType = {
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

    // check if user already exists
    const userData = await getUserDataByUserName({ userName });

    if (userData) {
      returnValue.type = "error";
      if (!returnValue.fields)
        returnValue.fields = {
          userName: {
            value: userName,
          },
        };
      returnValue.fields.userName.error =
        "Username already exists. Please choose another.";

      return returnValue;
    }

    const registeredUserId = await registerNewUser({
      userName,
      password,
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
      sameSite: "lax",
    });

    returnValue.type = "success";
    returnValue.message = `Welcome ${userName}!`;
    return returnValue;
  } catch (error: any) {
    return {
      type: "error",
      message:
        error.message ||
        "An unexpected error occurred. Please try again later.",
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
