import { databases } from "./appwrite";

export async function upsertPresence(collectionId:string, canvasId:string, user:any, cursor:any){
  try{
    const list = await databases.listDocuments(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID||"", collectionId, [
      `equal("canvasId","${canvasId}")`,
      `equal("userId","${user.$id}")`
    ]);
    if(list.documents && list.documents.length>0){
      const doc = list.documents[0];
      return await databases.updateDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID||"", collectionId, doc.$id, { cursor, lastSeen: Date.now(), name: user.email || user.$id, color: cursor.color });
    }else{
      return await databases.createDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID||"", collectionId, 'unique()', { canvasId, userId: user.$id, cursor, name: user.email || user.$id, color: cursor.color, lastSeen: Date.now() });
    }
  }catch(e){ console.error("presence", e); }
}

export async function removePresence(collectionId:string, canvasId:string, userId:string){
  try{
    const list = await databases.listDocuments(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID||"", collectionId, [
      `equal("canvasId","${canvasId}")`,
      `equal("userId","${userId}")`
    ]);
    if(list.documents?.length) await databases.deleteDocument(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID||"", collectionId, list.documents[0].$id);
  }catch(e){ console.error("removePresence", e); }
}
