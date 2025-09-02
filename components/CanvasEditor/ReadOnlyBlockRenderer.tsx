'use client'

import BlockRenderer from "./BlockRenderer";
import { Block } from "./templates";

export default function ReadOnlyBlockRenderer({ block }: { block: Block }) {
  return <BlockRenderer block={block} onUpdate={() => {}} editable={false} />;
}