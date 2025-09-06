import { account } from "./appwrite";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function signUp(email: string, password: string, name: string) {
  return await account.create("unique()", email, password, name);
}

export async function login(email: string, password: string) {
  return await account.createEmailPasswordSession(email, password);
}

export async function getCurrentUser() {
  try {
    return await account.get();
  } catch {
    return null;
  }
}

export async function getSession() {
  try {
    const jwt = (await cookies()).get("appwrite-session")?.value;
    if (!jwt) return null;

    account.setJWT(jwt);
    const user = await account.get();
    return { user };
  } catch {
    return null;
  }
}

export async function logout() {
  return await account.deleteSession("current") .then(() => {
    redirect("/login");
  });
}
