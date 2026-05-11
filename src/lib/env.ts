const required = (name: string) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
};

export const env = {
  tursoUrl: required("TURSO_DB_URL"),
  tursoToken: required("TURSO_AUTH_TOKEN"),
  jwtSecret: required("JWT_SECRET")
};
