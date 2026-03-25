import { cookies } from "next/headers";

export default async function getCookieValue(
  cookieName: string,
): Promise<string | undefined> {
  const sessionCookie = await cookies();

  return sessionCookie.get(cookieName)?.value;
}
