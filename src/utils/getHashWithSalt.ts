import bcrypt from "bcrypt";

export default async function getHashedPasswordWithSalt(password: string) {
  const hashedPassword = await bcrypt.hash(password, 12);

  return { hashedPassword };
}
