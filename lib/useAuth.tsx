'use client';
import { useEffect, useState } from "react";
import { account } from "./appwrite";

export function useAuth(){
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    account.get().then(u=>{ setUser(u); setLoading(false); }).catch(()=>{ setUser(null); setLoading(false); });
  },[]);

  const signOut = async ()=>{ try{ await account.deleteSession("current"); setUser(null); } catch(e){ console.error(e); } };

  return { user, loading, signOut, account };
}
