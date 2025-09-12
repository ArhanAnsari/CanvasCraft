"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import BlockRenderer from "./BlockRenderer";
import type { Block } from "./templates";
import { v4 as uuidv4 } from "uuid";

export default function AIPromptDialog({
  open,
  onClose,
  onInsert,
}: {
  open: boolean;
  onClose: () => void;
  onInsert: (blocks: Block[]) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [previewBlocks, setPreviewBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });
      const json = await res.json();
      if (Array.isArray(json.blocks)) {
        const gen = json.blocks.map((blk: any) => ({ ...blk, id: uuidv4() }));
        setPreviewBlocks(gen);
      }
    } catch (e) {
      console.error("AI generate failed", e);
    } finally {
      setLoading(false);
    }
  };

  const approve = () => {
    onInsert(previewBlocks);
    setPreviewBlocks([]);
    setPrompt("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>✨ Generate with AI</DialogTitle>
        </DialogHeader>

        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want (e.g., Hero with tagline, CTA, and gallery)"
          className="mt-2"
          rows={3}
        />

        <div className="mt-4">
          {loading && <p className="text-slate-400">Generating...</p>}
          {previewBlocks.length > 0 && (
            <div className="space-y-4 max-h-64 overflow-y-auto border p-3 rounded bg-slate-900/40">
              {previewBlocks.map((b) => (
                <div key={b.id} className="border border-slate-700 rounded p-2">
                  <BlockRenderer block={b} onUpdate={() => {}} />
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="mt-4 flex justify-between">
          <Button
            variant="secondary"
            onClick={generate}
            disabled={!prompt.trim() || loading}
          >
            {loading ? "Generating..." : "Preview"}
          </Button>
          <Button onClick={approve} disabled={previewBlocks.length === 0}>
            Approve & Insert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
