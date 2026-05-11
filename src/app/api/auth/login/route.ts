import { NextResponse } from "next/server";
import { findUserByUserName } from "@/lib/queries";
import { verifyPassword } from "@/lib/user";
import { setSessionCookie, signSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { userName, password } = await req.json();

    const user = await findUserByUserName(String(userName ?? ""));

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const ok = await verifyPassword(String(password ?? ""), String(user.password));

    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const token = await signSession({ userId: String(user.id), userName: String(user.userName) });
    await setSessionCookie(token);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
