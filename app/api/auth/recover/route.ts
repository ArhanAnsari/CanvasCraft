import { NextResponse } from "next/server";
import { account } from "@/lib/appwrite"; // your Appwrite client instance
import getBaseUrl from "@/lib/getBaseUrl";

// POST /api/auth/recover
export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Appwrite requires a redirect URL (where the user lands after clicking the reset link)
    const resetUrl = `${getBaseUrl()}/reset-password`;

    await account.createRecovery(email, resetUrl);

    return NextResponse.json({ success: true, message: "Password recovery email sent!" });
  } catch (error: any) {
    console.error("Password recovery error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
