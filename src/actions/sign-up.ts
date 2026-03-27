"use server";

import { UserSignUpData, UserSignUpDataSchema } from "@/schema/user";
import { uploadImage } from "@/utils/cloudinary";
import { getUserDataByEmail, registerNewUser } from "@/repository/user";
import { insertUserSession } from "@/repository/userSession";
import Mailchecker from "mailchecker";
import getHashedPasswordWithSalt from "@/utils/getHashWithSalt";
import { ApiResponse } from "@/types/apiResponse";
import getSignature from "@/utils/getSignature";
import { cookies } from "next/headers";

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
export default async function signUpUser(
  prevData: ApiResponse,
  formData: FormData,
): Promise<ApiResponse> {
  try {
    const userName = formData.get("userName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const profilePicture = formData.get("profilePicture") as File;

    const validationResult = UserSignUpDataSchema.safeParse({
      userName,
      email,
      password,
      confirmPassword,
      profilePicture,
    });

    const returnValue: ApiResponse = {
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

    const userSignUpData: UserSignUpData = validationResult.data;

    if (userSignUpData.password !== userSignUpData.confirmPassword) {
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

    if (!Mailchecker.isValid(userSignUpData.email)) {
      returnValue.type = "error";
      returnValue.fields = {
        ...returnValue.fields,
        email: {
          ...returnValue.fields?.email,
          error: "Invalid email address",
        },
      };
      return returnValue;
    }

    // check if email already exists
    const existingUserByEmail = await getUserDataByEmail({
      email: userSignUpData.email,
    });

    if (existingUserByEmail) {
      returnValue.type = "error";
      returnValue.fields = {
        ...returnValue.fields,
        email: {
          ...returnValue.fields?.email,
          error: "Invalid email address",
        },
      };
      return returnValue;
    }

    const { hashedPassword } = await getHashedPasswordWithSalt(
      userSignUpData.password,
    );

    // Upload profile picture to Cloudinary
    const uploadResult = await uploadImage(userSignUpData.profilePicture);

    const registeredUserId = await registerNewUser({
      userName: userSignUpData.userName,
      email: userSignUpData.email,
      password: hashedPassword,
      registeredAt: new Date(),
      savedReviewesIds: [],
      profilePictureUrl: uploadResult.secure_url,
      isEmailVerified: false,
    });

    const sessionId = await insertUserSession({
      userId: registeredUserId,
      expiresOn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Session expires in 7 days
    });

    const getCookieSignature = getSignature(sessionId);
    const signedSessionId = `${sessionId}.${getCookieSignature}`;

    (await cookies()).set("sessionId", signedSessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    returnValue.type = "success";
    returnValue.message = `Welcome ${userSignUpData.userName}!`;

    return returnValue;
  } catch (error) {
    return {
      type: "error",
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}
