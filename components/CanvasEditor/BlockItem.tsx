'use client';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import BlockRenderer from "./BlockRenderer";
import type { Block } from "./templates";

export default function BlockItem({ block, onUpdate }:{ block:Block; onUpdate:(b:Block)=>void }){
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const style: React.CSSProperties = { transform: CSS.Translate.toString(transform), transition, opacity: isDragging?0.9:1 };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-4">
      <BlockRenderer block={block} onUpdate={onUpdate} />
    </div>
  );
}
