'use client';
export default function Cursors({ presence }:{ presence?: any[] }){
  return (
    <div className="absolute right-4 top-4 flex flex-col gap-2 z-50">
      {presence?.map(p=>(
        <div key={p.$id} className="flex items-center gap-2 p-2 glass rounded">
          <div className="w-3 h-3 rounded-full" style={{background:p.color}}/>
          <div className="text-xs">{p.name?.split('@')?.[0] || 'Anon'}</div>
        </div>
      ))}
    </div>
  );
}
