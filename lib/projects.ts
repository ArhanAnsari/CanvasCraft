import { databases } from "./appwrite";
import { Query } from "appwrite";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const PROJECTS_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_ID!;

export async function saveProject(userId: string, title: string, content: any) {
  return await databases.createDocument(DB_ID, PROJECTS_COLLECTION, "unique()", {
    userId,
    title,
    content: JSON.stringify(content),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function getUserProjects(userId: string) {
  return await databases.listDocuments(DB_ID, PROJECTS_COLLECTION, [
    Query.equal("userId", userId),
  ]);
}

export async function updateProject(projectId: string, content: any) {
  return await databases.updateDocument(DB_ID, PROJECTS_COLLECTION, projectId, {
    content: JSON.stringify(content),
    updatedAt: new Date().toISOString(),
  });
}
