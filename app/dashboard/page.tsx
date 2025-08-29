'use client';
import { useEffect, useState } from "react";
import { databases } from "@/lib/appwrite";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard(){
  const [canvases, setCanvases] = useState<any[]>([]);
  const router = useRouter();

  useEffect(()=>{ (async ()=>{
    try{
      const res = await databases.listDocuments(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID||"", process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID||"");
      setCanvases(res.documents || []);
    }catch(e){ console.error(e); }
  })() },[]);

  const createCanvas = async ()=>{
    try{
      const doc = await databases.createDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID||"", process.env.NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID||"", 'unique()', { title:`Untitled ${Date.now()}`, blocks:[], published:false });
      router.push(`/canvas/${doc.$id}`);
    }catch(e){ console.error(e); }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button className="btn btn-primary" onClick={createCanvas}>New Canvas</button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {canvases.map(c=>(
          <div key={c.$id} className="glass p-4 rounded">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{c.title}</div>
                <div className="text-xs text-slate-400">{c.published ? 'Published' : 'Draft'}</div>
              </div>
              <div className="text-right">
                <Link href={`/canvas/${c.$id}`} className="text-cyan-300 text-sm">Open</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
