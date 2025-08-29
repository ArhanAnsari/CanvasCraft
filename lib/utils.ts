import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fileView(bucketId: string, fileId: string){
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "";
  return `${endpoint.replace("/v1","")}/storage/buckets/${bucketId}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
}
export function randColor(){
  const colors=['#7c3aed','#06b6d4','#fb7185','#f59e0b','#10b981'];
  return colors[Math.floor(Math.random()*colors.length)];
}
