import bcrypt from "bcryptjs";

export async function verifyPassword(input: string, stored: string) {
  const isBcrypt = stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$");

  if (isBcrypt) {
    return bcrypt.compare(input, stored);
  }

  return input === stored;
}
