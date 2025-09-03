import CanvasEditorClient from "./CanvasEditorClient";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function CanvasPage({
  params,
}: {
  params: { id: string };
}) {
  // ✅ Extract params on server to avoid "await params" error
  const id = params.id;
  return <CanvasEditorClient id={id} />;
}
