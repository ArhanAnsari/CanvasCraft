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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ShareModalProps = {
  open: boolean;
  onClose: () => void;
  canvasId: string;
  ownerId: string;
};

type Collaborator = {
  $id: string;
  email: string;
  role: string;
  userId: string;
};

export default function ShareModal({
  open,
  onClose,
  canvasId,
  ownerId,
}: ShareModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<Collaborator[]>([]);

  async function fetchUsers() {
    const res = await fetch(`/api/canvas/${canvasId}/shared-users`);
    const data = await res.json();

    // Deduplicate users by email
    const uniqueUsers = new Map<string, Collaborator>();
    (data.users || []).forEach((u: Collaborator) => {
      if (!uniqueUsers.has(u.email)) {
        uniqueUsers.set(u.email, u);
      }
    });

    setUsers(Array.from(uniqueUsers.values()));
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
        body: JSON.stringify({ id: canvasId, email, role }),
      });
      setEmail("");
      setRole("viewer");
      fetchUsers();
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRemove(userEmail: string) {
    await fetch(`/api/canvas/${canvasId}/remove-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail }),
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
            placeholder="Enter email ID..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-slate-800 border-slate-700 text-slate-100"
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100 w-full sm:w-40">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={handleInvite}
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-500 w-full sm:w-auto"
            >
              {isLoading ? "Inviting..." : "Invite"}
            </Button>
          </div>
        </div>

        {/* List collaborators */}
        <div className="mt-6 space-y-3">
          {users.map((u) => (
            <div
              key={u.$id}
              className="flex items-center justify-between p-2 bg-slate-800 rounded-lg"
            >
              <span className="text-slate-100">
                {u.email} ({u.role})
              </span>
              {ownerId && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemove(u.email)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-600 w-full"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
