import getCookieValue from "./getCookieValue";

export default async function validateCsrfToken(
  csrfToken: string | undefined,
): Promise<boolean> {
  const csrfTokenFromCookie = await getCookieValue("csrfToken");

  return csrfToken === csrfTokenFromCookie;
}
