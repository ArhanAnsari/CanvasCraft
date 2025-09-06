"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Users, Info, Share2, Save, Rocket } from "lucide-react";
import ShareModal from "./ShareModal";

type CanvasSettingsProps = {
  canvasId: string;
  initialTitle: string;
  presenceCount: number;
};

export default function CanvasSettings({
  canvasId,
  initialTitle,
  presenceCount,
}: CanvasSettingsProps) {
  const [title, setTitle] = useState(initialTitle);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  async function handleSave() {
    setIsSaving(true);
    try {
      await fetch(`/api/canvas/${canvasId}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePublish() {
    setIsPublishing(true);
    try {
      await fetch(`/api/canvas/${canvasId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto border border-slate-700 shadow-lg rounded-2xl bg-slate-900/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-slate-200">
            Canvas Settings
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 text-slate-400 text-sm cursor-help">
                    <Users className="w-4 h-4" />
                    <span>{presenceCount}</span>
                  <Info className="w-3 h-3" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Presence shows how many collaborators are editing right now</p>
              </TooltipContent>
            </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Title input */}
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter canvas title..."
            className="bg-slate-800 border-slate-700 text-slate-100"
          />

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-slate-700 hover:bg-slate-600"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Draft"}
            </Button>

            <Button
              onClick={handlePublish}
              disabled={isPublishing}
              className="bg-green-600 hover:bg-green-500"
            >
              <Rocket className="w-4 h-4 mr-2" />
              {isPublishing ? "Publishing..." : "Publish"}
            </Button>

            <Button
              variant="outline"
              onClick={() => setShareOpen(true)}
              className="ml-auto border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Share Modal */}
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} canvasId={canvasId} />
    </>
  );
}
