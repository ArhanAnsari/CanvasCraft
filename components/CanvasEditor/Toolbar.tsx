'use client';
import { useRef, useState } from "react";
import { Templates } from "./templates";

export function Toolbar({
  onAdd,
  onAddImage,
  onAI,
}: {
  onAdd: (t: keyof typeof Templates) => void;
  onAddImage: (file: File) => void;
  onAI: () => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onAddImage(file);
  };

  return (
    <div className="glass p-4 rounded space-y-3">
      <h4 className="font-semibold mb-2">Add Blocks</h4>
      <div className="grid grid-cols-2 gap-2">
        {Object.keys(Templates).map((t) => (
          <button
            key={t}
            onClick={() => onAdd(t as keyof typeof Templates)}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm"
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <h4 className="font-semibold mb-2">Upload Image</h4>
        <div
          onClick={() => fileInput.current?.click()}
          className="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center cursor-pointer hover:bg-slate-800/50"
        >
          {preview ? (
            <img src={preview} alt="preview" className="mx-auto rounded max-h-32" />
          ) : (
            <span className="text-slate-400">Click or Drop an image</span>
          )}
        </div>
        <input
          type="file"
          ref={fileInput}
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      <button
        onClick={onAI}
        className="w-full mt-4 px-3 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-lg text-white font-medium shadow hover:opacity-90"
      >
        Generate with AI <span className="ml-1 text-xs text-slate-200">(Coming soon)</span>
      </button>
    </div>
  );
}
