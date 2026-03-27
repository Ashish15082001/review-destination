import { cookies } from "next/headers";
import verifySignature from "./verifySignature";

export default async function getCookie(
  cookieName: string,
): Promise<string | undefined> {
  const signedCookie = (await cookies()).get(cookieName)?.value;

  // when cookie is deleted, it is set to an empty string, so we check for both undefined and empty string
  // after next request, the cookie will be removed from the browser, so it will be undefined in subsequent requests
  if (!signedCookie || signedCookie === "") return undefined;

  const [cookieValue, cookieSignature] = signedCookie.split(".");

  // signature does not match, possible tampering
  if (!verifySignature({ value: cookieValue, signature: cookieSignature }))
    return undefined;

  return cookieValue;
}
