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
  const [rawJSON, setRawJSON] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showJSON, setShowJSON] = useState(false);

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
        setRawJSON(JSON.stringify(json.blocks, null, 2));
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
    setRawJSON("");
    onClose();
  };

  const copyJSON = async () => {
    try {
      await navigator.clipboard.writeText(rawJSON);
      alert("✅ JSON copied to clipboard!");
    } catch {
      alert("❌ Failed to copy JSON");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>✨ Generate with AI</DialogTitle>
        </DialogHeader>

        {/* Input */}
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want (e.g., Hero with tagline, CTA, and gallery)"
          className="mt-2"
          rows={3}
        />

        {/* Preview Section */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-4">
          {loading && <p className="text-slate-400">Generating...</p>}
          {previewBlocks.length > 0 && (
            <>
              {/* Toggle raw JSON */}
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowJSON((p) => !p)}
                >
                  {showJSON ? "Hide Raw JSON" : "Show Raw JSON"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyJSON}
                  disabled={!rawJSON}
                >
                  📋 Copy JSON
                </Button>
              </div>

              {/* Raw JSON viewer */}
              {showJSON && (
                <pre className="p-3 bg-slate-950/70 border rounded text-xs text-slate-200 max-h-40 overflow-y-auto">
                  {rawJSON}
                </pre>
              )}

              {/* Block preview */}
              <div className="space-y-4 border p-3 rounded bg-slate-900/40">
                {previewBlocks.map((b) => (
                  <div
                    key={b.id}
                    className="border border-slate-700 rounded p-2 bg-slate-800/50"
                  >
                    <BlockRenderer block={b} onUpdate={() => {}} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer pinned at bottom */}
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
