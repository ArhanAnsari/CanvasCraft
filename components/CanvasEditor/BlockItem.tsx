// components/CanvasEditor/BlockItem.tsx
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import BlockRenderer from "./BlockRenderer";
import type { Block } from "./templates";
import { GripVertical, Trash2, Copy, FilePlus, ArrowUp, ArrowDown } from "lucide-react";
import { useEffect, useRef } from "react";

export default function BlockItem({
  block,
  onUpdate,
  onDelete,
  onSelect,
  isSelected,
  onDuplicate,
  onCopy,
  onPaste,
  onMoveUp,
  onMoveDown,
}: {
  block: Block;
  onUpdate: (b: Block) => void;
  onDelete: (id: string) => void;
  onSelect: () => void;
  isSelected?: boolean;
  onDuplicate?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
  };

  // Auto-scroll into view when selected
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (isSelected && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isSelected]);

  // clicking the container selects (but we avoid selecting when clicking inputs / buttons)
  const handleContainerClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const tag = target.tagName.toLowerCase();
    const interactive = ["input", "textarea", "button", "a", "svg"];
    if (interactive.includes(tag)) return;
    onSelect();
  };

  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        ref.current = el;
      }}
      style={style}
      onClick={handleContainerClick}
      className={`mb-4 relative group rounded-lg ${isSelected ? "ring-2 ring-indigo-500" : "border border-slate-700"} bg-slate-800/40`}
    >
      {/* Selected header (visible when selected) */}
      {isSelected && (
        <div className="absolute -top-6 left-3 right-3 flex items-center justify-between bg-slate-900/90 border border-slate-700 px-3 py-1 rounded text-xs z-20">
          <div className="flex items-center gap-3">
            <div className="text-slate-300 capitalize">{block.type}</div>
            <div className="text-slate-400">•</div>
            <div className="text-slate-400">Del: Delete</div>
            <div className="text-slate-400">⭡ ⭣: Move</div>
            <div className="text-slate-400">Ctrl/Cmd+C/V: Copy/Paste</div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={(e) => { e.stopPropagation(); onMoveUp?.(); }} title="Move up" className="p-1 rounded bg-slate-700 hover:bg-slate-600"><ArrowUp className="w-4 h-4 text-slate-300" /></button>
            <button onClick={(e) => { e.stopPropagation(); onMoveDown?.(); }} title="Move down" className="p-1 rounded bg-slate-700 hover:bg-slate-600"><ArrowDown className="w-4 h-4 text-slate-300" /></button>
            <button onClick={(e) => { e.stopPropagation(); onDuplicate?.(); }} title="Duplicate" className="p-1 rounded bg-slate-700 hover:bg-slate-600"><FilePlus className="w-4 h-4 text-slate-300" /></button>
            <button onClick={(e) => { e.stopPropagation(); onCopy?.(); }} title="Copy" className="p-1 rounded bg-slate-700 hover:bg-slate-600"><Copy className="w-4 h-4 text-slate-300" /></button>
            <button onClick={(e) => { e.stopPropagation(); onPaste?.(); }} title="Paste" className="p-1 rounded bg-slate-700 hover:bg-slate-600"><FilePlus className="w-4 h-4 text-slate-300" /></button>
          </div>
        </div>
      )}

      {/* Top-right toolbar: drag handle and delete */}
      <div className="absolute -top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
        <button
          {...attributes}
          {...listeners}
          aria-label="Drag"
          title="Drag to reorder"
          className="p-1 rounded bg-slate-700 hover:bg-slate-600 cursor-grab"
        >
          <GripVertical className="w-4 h-4 text-slate-300" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(block.id);
          }}
          aria-label="Delete"
          title="Delete block"
          className="p-1 rounded bg-red-600 hover:bg-red-500"
        >
          <Trash2 className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="p-4">
        <BlockRenderer block={block} onUpdate={onUpdate} />
      </div>
    </div>
  );
}
