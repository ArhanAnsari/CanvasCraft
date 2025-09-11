"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ShareModalProps = {
  open: boolean;
  onClose: () => void;
  canvasId: string;
  ownerId: string;
};

export default function ShareModal({ open, onClose, canvasId, ownerId }: ShareModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  async function fetchUsers() {
    const res = await fetch(`/api/canvas/${canvasId}/shared-users`);
    const data = await res.json();
    setUsers(data.users || []);
  }

  useEffect(() => {
    if (open) fetchUsers();
  }, [open]);

  async function handleInvite() {
    setIsLoading(true);
    try {
      await fetch(`/api/canvas/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: canvasId, userId: email, role }),
      });
      setEmail("");
      setRole("viewer");
      fetchUsers();
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRemove(uid: string) {
    await fetch(`/api/canvas/${canvasId}/remove-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid }),
    });
    fetchUsers();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border border-slate-700 max-w-md w-full sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-slate-100">Collaborators</DialogTitle>
        </DialogHeader>

        {/* Invite */}
        <div className="space-y-4">
          <Input
            placeholder="Enter user ID..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-slate-800 border-slate-700 text-slate-100"
          />

          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viewer">Viewer</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleInvite} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-500 w-full">
            {isLoading ? "Inviting..." : "Invite"}
          </Button>
        </div>

        {/* List collaborators */}
        <div className="mt-6 space-y-3">
          {users.map((u) => (
            <div key={u.$id} className="flex items-center justify-between p-2 bg-slate-800 rounded-lg">
              <span className="text-slate-100">{u.userId} ({u.role})</span>
              {ownerId && (
                <Button size="sm" variant="destructive" onClick={() => handleRemove(u.userId)}>
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-slate-600 w-full">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
