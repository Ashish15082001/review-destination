import {
  SignInUserDataFromBrowser,
  SignInUserDataFromBrowserSchema,
  SignUpUserDataFromBrowser,
  SignUpUserDataFromBrowserSchema,
  UserData,
  UserDataDocument,
  UserDataDocumentSchema,
  UserDataSchema,
} from "@/schema/user";

/**
 * Validates user data used in the application layer.
 * @param userData - The user payload to validate.
 * @returns The parsed and validated user data.
 * @throws {Error} If validation fails.
 */
export default function validateUserData(userData: UserData): UserData {
  const parseResult = UserDataSchema.safeParse(userData);

  if (!parseResult.success)
    throw new Error(`Invalid user data: ${parseResult.error.message}`);

  return parseResult.data;
}

/**
 * Validates a MongoDB user document.
 * @param userDataDocument - The user document to validate.
 * @returns The parsed and validated user document.
 * @throws {Error} If validation fails.
 */
export function validateUserDataDocument(
  userDataDocument: UserDataDocument,
): UserDataDocument {
  const parseResult = UserDataDocumentSchema.safeParse(userDataDocument);

  if (!parseResult.success)
    throw new Error(`Invalid user data document: ${parseResult.error.message}`);

  return parseResult.data;
}

/**
 * Validates sign-in payload submitted from the browser.
 * @param signInUserDataFromBrowser - Raw sign-in form payload.
 * @returns The parsed and validated sign-in payload.
 * @throws {Error} If validation fails.
 */
export function validateSignInUserDataFromBrowser(
  signInUserDataFromBrowser: SignInUserDataFromBrowser,
): SignInUserDataFromBrowser {
  const parseResult = SignInUserDataFromBrowserSchema.safeParse(
    signInUserDataFromBrowser,
  );

  if (!parseResult.success)
    throw new Error(
      `Invalid sign in user data from browser: ${parseResult.error.message}`,
    );

  return parseResult.data;
}

/**
 * Validates sign-up payload submitted from the browser.
 * @param signUpUserDataFromBrowser - Raw sign-up form payload.
 * @returns The parsed and validated sign-up payload.
 * @throws {Error} If validation fails.
 */
export function validateSignUpUserDataFromBrowser(
  signUpUserDataFromBrowser: SignUpUserDataFromBrowser,
): SignUpUserDataFromBrowser {
  const parseResult = SignUpUserDataFromBrowserSchema.safeParse(
    signUpUserDataFromBrowser,
  );

  if (!parseResult.success)
    throw new Error(
      `Invalid sign up user data from browser: ${parseResult.error.message}`,
    );

  return parseResult.data;
}
