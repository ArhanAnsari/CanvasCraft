import CanvasEditorClient from "./CanvasEditorClient";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface CanvasPageProps {
  params: Promise<{ id: string }>; // mark as Promise
}

export default async function CanvasPage({
  params,
}: {
  params: { id: string };
}) {
  
  // ✅ Extract params on server to avoid "await params" error
  const { id } = await params;

  return <CanvasEditorClient id={id} />;
}
