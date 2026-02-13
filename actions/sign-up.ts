"use server";

import { SignUpUserDataFromBrowserSchema } from "@/schema/schema";

const signUpUser = async (
  prevData: SignUpUserReturnType,
  formData: FormData,
): Promise<SignUpUserReturnType> => {
  // sign in user and return user data

  const userName = formData.get("userName") as string;
  const password = formData.get("password") as string;
  console.log({
    userName,
    password,
  });

  console.log("signUpUser validationResult");

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

  return { type: "success" };
};

export interface SignUpUserReturnType {
  type?: "success" | "error";
  fields?: Record<
    PropertyKey,
    {
      value?: string;
      error?: string;
    }
  >;
}

export default signUpUser;
