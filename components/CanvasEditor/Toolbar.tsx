'use client';
import { motion } from "framer-motion";

type ToolbarProps = {
  onAdd: (t: "text" | "hero" | "features" | "gallery" | "cta" | "footer") => Promise<void>;
  onAddImage: (file: File) => Promise<void>;
  onAI: () => Promise<void>;
};

export function Toolbar({ onAdd, onAddImage, onAI }: ToolbarProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onAddImage(file);
  };

  const btn =
    "px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white shadow transition";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-4 rounded space-y-2"
    >
      <h4 className="font-semibold mb-3">Add Blocks</h4>
      <div className="flex flex-col gap-2">
        <button className={btn} onClick={() => onAdd("hero")}>Hero</button>
        <button className={btn} onClick={() => onAdd("features")}>Features</button>
        <button className={btn} onClick={() => onAdd("gallery")}>Gallery</button>
        <button className={btn} onClick={() => onAdd("cta")}>CTA</button>
        <button className={btn} onClick={() => onAdd("footer")}>Footer</button>
        <button className={btn} onClick={() => onAdd("text")}>Text</button>

        <label className={`${btn} cursor-pointer`}>
          Upload Image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>

        <button className={`${btn} bg-gradient-to-r from-indigo-600 to-purple-600`}>
          Generate with AI
          <span className="ml-2 text-xs bg-yellow-500 text-black px-2 py-0.5 rounded">
            Coming Soon
          </span>
        </button>
      </div>
    </motion.div>
  );
}
export default Toolbar;