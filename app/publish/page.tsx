import { NextResponse } from "next/server";
import { Databases, Client } from "appwrite";
import slugify from "slugify";

const client = (new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "") as any)

const databases = new Databases(client);

export async function POST(req: Request) {
  try {
    const { id, userId } = await req.json();

    const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
    const coll = process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID!;

    const doc = await databases.getDocument(db, coll, id);

    // ✅ Validate owner
    if (doc.userId !== userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // ✅ Generate slugs if missing
    let siteSlug = doc.siteSlug;
    if (!siteSlug) {
      siteSlug = slugify(doc.title || "site", { lower: true, strict: true });
    }
    const pageSlug = doc.pageSlug || "index";

    const url = `https://canvascraft.appwrite.network/s/${siteSlug}/${pageSlug}`;

    // ✅ Update doc
    const updated = await databases.updateDocument(db, coll, id, {
      siteSlug,
      pageSlug,
      published: true,
      publishedUrl: url,
    });

    return NextResponse.json({ url, site: updated });
  } catch (e) {
    console.error("Publish error", e);
    return NextResponse.json({ error: "Publish failed" }, { status: 500 });
  }
}
