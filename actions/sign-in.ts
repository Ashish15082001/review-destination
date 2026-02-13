"use server";

import { SignInUserDataFromBrowserSchema } from "@/schema/schema";

const signInUser = async (
  prevData: SignInUserReturnType,
  formData: FormData,
): Promise<SignInUserReturnType> => {
  // sign in user and return user data

  const userName = formData.get("userName") as string;
  const password = formData.get("password") as string;

  // Validate form data with Zod
  const validationResult = SignInUserDataFromBrowserSchema.safeParse({
    userName,
    password,
  });

  console.log("signInUser validationResult");

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

  return { type: "success" };
};

export interface SignInUserReturnType {
  type?: "success" | "error";
  fields?: Record<
    PropertyKey,
    {
      value?: string;
      error?: string;
    }
  >;
}

export default signInUser;
