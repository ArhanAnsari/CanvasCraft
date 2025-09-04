"use client";

import { useAuth } from "@/lib/useAuth";
import { useState } from "react";
import { account, storage } from "@/lib/appwrite"; // ensure storage is initialized

export default function SettingsPage() {
  const { user } = useAuth();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user) return <div className="container py-10 text-center">Please log in</div>;

  const updateAvatar = async () => {
    if (!avatarFile) return;
    setLoading(true);
    try {
      // Upload to Appwrite Storage
      const uploaded = await storage.createFile("avatars", "unique()", avatarFile);
      const url = storage.getFileView("avatars", uploaded.$id);

      // Save in prefs
      await account.updatePrefs({ avatar: url });

      alert("Avatar updated! Refresh to see changes.");
    } catch (err) {
      console.error(err);
      alert("Failed to update avatar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10 space-y-6">
      <h1 className="text-3xl font-bold text-slate-100">⚙️ Account Settings</h1>

      <div className="space-y-4">
        <p className="text-slate-300">Name: {user.name}</p>
        <p className="text-slate-300">Email: {user.email}</p>
      </div>

      {/* Avatar Upload */}
      <div className="space-y-3">
        <label className="text-slate-300">Update Avatar</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
          className="block text-slate-200"
        />
        <button
          onClick={updateAvatar}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          {loading ? "Uploading..." : "Update Avatar"}
        </button>
      </div>

      {/* Password Reset */}
      <div className="space-y-3">
        <button
          onClick={() => account.createRecovery(user.email, window.location.origin + "/reset-password")}
          className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}
