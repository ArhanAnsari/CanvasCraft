import { Client, Account, Databases, Storage, ID } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string) // Your Appwrite endpoint
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { client };
export { ID }; // ✅ make ID available