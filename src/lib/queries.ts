import { db } from "@/lib/db";

export type UserRecord = {
  id: string;
  userName: string;
  password: string;
  limit: string | null;
  balance?: string | null;
  currentPackage?: string | null;
  daysLeft?: string | null;
  sessions?: string | null;
  keyExtension?: string | null;
  recentTransactions?: string | null;
};

function toText(value: unknown, fallback = "") {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function mapUserRow(row: Record<string, unknown>) {
  return {
    id: toText(row.id),
    userName: toText(row.userName),
    limit: row.limit === null || row.limit === undefined ? (row["limit"] === null || row["limit"] === undefined ? null : String(row["limit"])) : String(row.limit),
    balance: row.balance === null || row.balance === undefined ? null : String(row.balance),
    currentPackage: row.currentPackage === null || row.currentPackage === undefined ? null : String(row.currentPackage),
    daysLeft: row.daysLeft === null || row.daysLeft === undefined ? null : String(row.daysLeft),
    sessions: row.sessions === null || row.sessions === undefined ? null : String(row.sessions),
    keyExtension: row.keyExtension === null || row.keyExtension === undefined ? null : String(row.keyExtension),
    recentTransactions: row.recentTransactions === null || row.recentTransactions === undefined ? null : String(row.recentTransactions)
  };
}

export async function findUserByUserName(userName: string): Promise<UserRecord | null> {
  const result = await db.execute({
    sql: "SELECT * FROM user WHERE userName = ? LIMIT 1",
    args: [userName]
  });

  if (result.rows.length === 0) return null;

  const row = result.rows[0] as unknown as Record<string, unknown>;
  return {
    ...mapUserRow(row),
    password: toText(row.password)
  };
}

export async function listUsers() {
  const result = await db.execute("SELECT * FROM user ORDER BY id DESC");
  return result.rows.map((row) => mapUserRow(row as unknown as Record<string, unknown>));
}

export async function decrementUserLimitIfAvailable(userId: string) {
  const result = await db.execute({
    sql: 'UPDATE user SET "limit" = CAST("limit" AS INTEGER) - 1 WHERE id = ? AND CAST("limit" AS INTEGER) > 0',
    args: [userId]
  });

  return result.rowsAffected > 0;
}
