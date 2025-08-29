import { NextResponse } from "next/server";
import { Databases, Storage, Client } from "appwrite";

const client = new Client().setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT||"").setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT||"");
const databases = new Databases(client);
const storage = new Storage(client);

function renderHTML(doc:any){
  const blocks = doc.blocks || [];
  const htmlBlocks = blocks.map((b:any)=>{
    if(b.type==='hero') return `<section style="padding:48px;background:linear-gradient(135deg,#0f1724,#0e7490);color:#fff;border-radius:16px"><h1>${b.props.heading||''}</h1><p>${b.props.subheading||''}</p></section>`;
    if(b.type==='features') return `<section style="padding:24px"><h2>${b.props.title||'Features'}</h2><div>${(b.props.items||[]).map((it:any)=>`<div><strong>${it.title}</strong><p>${it.desc}</p></div>`).join('')}</div></section>`;
    if(b.type==='gallery') return `<section style="padding:24px"><h2>${b.props.title||'Gallery'}</h2><div>${(b.props.images||[]).map((i:string)=>`<img src="${i}" style="width:100%;max-width:200px;margin:6px;border-radius:8px"/>`).join('')}</div></section>`;
    if(b.type==='cta') return `<section style="padding:24px;text-align:center;background:linear-gradient(90deg,#7c3aed,#06b6d4);color:#fff;border-radius:12px"><h2>${b.props.text||'Ready?'}</h2></section>`;
    if(b.type==='footer') return `<footer style="padding:24px;text-align:center">${b.props.text||''}</footer>`;
    if(b.type==='text') return `<p style="padding:12px">${b.props.text||''}</p>`;
    if(b.type==='image') return `<img src="${b.props.url}" style="width:100%;border-radius:8px"/>`;
    return '';
  }).join('\n');
  return `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>${doc.title||'CanvasCraft'}</title><style>body{font-family:Inter,system-ui,Arial;margin:0;padding:24px;background:#071023;color:#e6eef8}section{margin-bottom:16px}</style></head><body>${htmlBlocks}</body></html>`;
}

export async function POST(req: Request){
  try{
    const { id } = await req.json();
    const doc = await databases.getDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID||"", process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID||"", id);
    const html = renderHTML(doc);
    const file = new File([html], 'index.html', { type: 'text/html' } as any);
    const up = await storage.createFile(process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID||"", 'unique()', file);
    const url = `${(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT||'').replace('/v1','')}/storage/buckets/${up.bucketId}/files/${up.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
    await databases.updateDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID||"", process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID||"", id, { publishedUrl: url, published: true });
    return NextResponse.json({ url });
  }catch(e){
    return NextResponse.json({ error: 'publish failed' }, { status: 500 });
  }
}
