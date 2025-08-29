import { Client, Account, Databases, Storage } from 'appwrite';
import * as Appwrite from 'appwrite';
const Realtime = (Appwrite as any).Realtime;

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "");

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const realtime = new Realtime(client);
export default client;
