import { NextResponse } from "next/server";
import { account } from "@/lib/appwrite";

export async function POST(req: Request) {
  try {
    const { userId, secret, password, confirm } = await req.json();

    if (!userId || !secret || !password || !confirm) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (password !== confirm) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    await account.updateRecovery(userId, secret, password, confirm);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Password reset error:", err.message || err);
    return NextResponse.json(
      { error: "Failed to reset password. The link may have expired." },
      { status: 500 }
    );
  }
}
