import CanvasEditor from "./CanvasEditor";

export default function Page({ params }: { params: { id: string } }) {
  return <CanvasEditor id={params.id} />;
}

export async function generateStaticParams() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/databases/${process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID}/collections/${process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID}/documents`,
    {
      headers: {
        "X-Appwrite-Project": process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
        "X-Appwrite-Key": process.env.APPWRITE_API_KEY!, // careful, only if running server-side
      },
    }
  );

  const data = await res.json();

  return data.documents.map((doc: any) => ({
    id: doc.$id,
  }));
}
