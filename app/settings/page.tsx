"use client";

import { useAuth } from "@/lib/useAuth";
import { useState, useEffect } from "react";
import { account, storage } from "@/lib/appwrite";

export default function SettingsPage() {
  const { user } = useAuth();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setName(user.name || "");
  }, [user]);

  if (!user) return <div className="container py-10 text-center">Please log in</div>;

  // Update Avatar
  const updateAvatar = async () => {
    if (!avatarFile) return;
    setLoading(true);
    try {
      const uploaded = await storage.createFile("avatars", "unique()", avatarFile);
      const url = storage.getFileView("avatars", uploaded.$id);
      await account.updatePrefs({ avatar: url });
      alert("✅ Avatar updated! Refresh to see changes.");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update avatar");
    } finally {
      setLoading(false);
    }
  };

  // Update Name
  const updateName = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await account.updateName(name.trim());
      alert("✅ Name updated! Refresh to see changes.");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update name");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10 space-y-8">
      <h1 className="text-3xl font-bold text-slate-100">⚙️ Account Settings</h1>

      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <label className="block text-slate-300 mb-1">Email</label>
          <input
            value={user.email}
            readOnly
            className="w-full px-3 py-2 rounded-lg bg-slate-800 text-slate-400 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white"
          />
          <button
            onClick={updateName}
            disabled={loading}
            className="mt-3 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            {loading ? "Saving..." : "Update Name"}
          </button>
        </div>
      </div>

      {/* Avatar Upload */}
      <div className="space-y-4">
        <label className="block text-slate-300">Avatar</label>
        
        {user.prefs?.avatar ? (
          <img
            src={user.prefs.avatar}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border border-slate-700 object-cover mb-3"
          />
        ) : (
          <p className="text-slate-400 mb-3">No avatar set yet</p>
        )}

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
          onClick={() =>
            account.createRecovery(user.email, window.location.origin + "/reset-password")
          }
          className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white"
        >
          Reset Password
        </button>
        <p className="text-sm text-slate-400">
          You’ll get an email with a reset link.
        </p>
      </div>
    </div>
  );
}
