import CanvasEditor from "./CanvasEditor";

export default function Page({ params }: { params: { id: string } }) {
  return <CanvasEditor id={params.id} />;
}

export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/databases/${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}/collections/${process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID}/documents`,
      {
        headers: {
          "X-Appwrite-Project": process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
          "X-Appwrite-Key": process.env.APPWRITE_API_KEY!, // only safe server-side
        },
        cache: "no-store", // avoid stale data at build
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch documents", await res.text());
      return [];
    }

    const data = await res.json();

    if (!data.documents) {
      console.error("No documents found", data);
      return [];
    }

    return data.documents.map((doc: any) => ({
      id: doc.$id,
    }));
  } catch (err) {
    console.error("Error in generateStaticParams:", err);
    return [];
  }
}

