import { NextResponse } from "next/server";
import { account, databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import { getSession } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const allUsers = await databases.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID!,
            [
                Query.equal("presence", session.user.$id), // owned canvases
                // Appwrite automatically includes docs shared with the user via permissions
            ]
        );
        const canvas = await databases.getDocument("your-db-id", "canvases", params.id);
        const sharedWith = canvas.sharedWith || [];
        const sharedUsers = allUsers.users.filter((u) => sharedWith.includes(u.$id));

    return NextResponse.json(docs);
} catch (err: any) {
  

  return NextResponse.json({ users: sharedUsers });
}
}