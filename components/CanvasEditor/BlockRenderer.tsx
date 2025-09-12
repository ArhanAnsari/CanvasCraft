// components/CanvasEditor/BlockRenderer.tsx
"use client";

import React, { useRef, useEffect, useState } from "react";
import type { Block } from "./templates";

/**
 * Lightweight contentEditable wrapper:
 * - supports basic formatting via execCommand for bold/italic/underline
 * - on blur it saves the HTML/text to block props
 */
function RichEditable({
  html,
  onChange,
  placeholder,
  className = "",
}: {
  html?: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current && html !== ref.current.innerHTML) {
      ref.current.innerHTML = html || "";
    }
  }, [html]);

  const save = () => {
    if (!ref.current) return;
    onChange(ref.current.innerHTML || "");
  };

  return (
    <div>
      <div className={`prose prose-invert max-w-full ${className}`}>
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onBlur={save}
          className="min-h-[36px] outline-none"
          data-placeholder={placeholder}
        />
      </div>
      <div className="mt-2 flex gap-2">
        <button type="button" onMouseDown={(e) => { e.preventDefault(); document.execCommand("bold"); }} className="px-2 py-1 bg-slate-800 rounded">B</button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); document.execCommand("italic"); }} className="px-2 py-1 bg-slate-800 rounded">I</button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); document.execCommand("underline"); }} className="px-2 py-1 bg-slate-800 rounded">U</button>
      </div>
    </div>
  );
}

export default function BlockRenderer({ block, onUpdate }: { block: Block; onUpdate: (b: Block) => void; }) {
  const updateProps = (patch: any) => onUpdate({ ...block, props: { ...block.props, ...patch } });

  // Style controls (bg color + font size)
  const StyleControls = () => {
    const [bg, setBg] = useState(block.props.bg || "");
    const [fs, setFs] = useState(block.props.fontSize || "");
    useEffect(() => { setBg(block.props.bg || ""); setFs(block.props.fontSize || ""); }, [block.props]);
    return (
      <div className="mb-3 flex items-center gap-2">
        <input
          type="color"
          value={bg || "#0b1220"}
          onChange={(e) => { setBg(e.target.value); updateProps({ bg: e.target.value }); }}
          title="Background color"
          className="w-10 h-8 p-0 rounded"
        />
        <select value={fs || "base"} onChange={(e) => { setFs(e.target.value); updateProps({ fontSize: e.target.value }); }} className="bg-slate-800 text-sm rounded px-2 py-1">
          <option value="sm">Small</option>
          <option value="base">Base</option>
          <option value="lg">Large</option>
          <option value="xl">XL</option>
        </select>
      </div>
    );
  };

  const appliedStyle = {
    background: block.props.bg || "transparent",
    fontSize:
      block.props.fontSize === "sm" ? "14px" :
      block.props.fontSize === "lg" ? "18px" :
      block.props.fontSize === "xl" ? "22px" : "16px",
    padding: block.props.bg ? "14px" : undefined,
    borderRadius: block.props.bg ? "8px" : undefined,
  } as React.CSSProperties;

  if (block.type === "hero") {
    return (
      <div style={appliedStyle}>
        <StyleControls />
        <RichEditable
          html={block.props.heading || ""}
          onChange={(html) => updateProps({ heading: html })}
          placeholder="Hero heading..."
          className="text-2xl font-bold text-white"
        />
        <div className="mt-3">
          <RichEditable
            html={block.props.subheading || ""}
            onChange={(html) => updateProps({ subheading: html })}
            placeholder="Subheading..."
            className="text-slate-300"
          />
        </div>
        <div className="mt-3 flex gap-2">
          <input className="bg-slate-800 px-3 py-1 rounded" value={block.props.buttonLabel || ""} onChange={(e) => updateProps({ buttonLabel: e.target.value })} placeholder="Button label" />
          <input className="bg-slate-800 px-3 py-1 rounded flex-1" value={block.props.buttonHref || ""} onChange={(e) => updateProps({ buttonHref: e.target.value })} placeholder="Button href" />
        </div>
      </div>
    );
  }

  if (block.type === "text") {
    return (
      <div style={appliedStyle}>
        <StyleControls />
        <textarea className="w-full bg-transparent border border-slate-700 rounded p-2 text-slate-100" value={block.props.text || ""} onChange={(e) => updateProps({ text: e.target.value })} />
      </div>
    );
  }

  if (block.type === "image") {
    return (
      <div style={appliedStyle}>
        <StyleControls />
        <img src={block.props.url} alt="image block" className="w-full object-contain rounded" />
        <input className="mt-2 w-full bg-slate-800 px-2 py-1 rounded" value={block.props.caption || ""} onChange={(e) => updateProps({ caption: e.target.value })} placeholder="Caption (optional)" />
      </div>
    );
  }
  
  if (block.type === "video") {
  return (
    <div style={appliedStyle}>
      <StyleControls />
      <input
        className="w-full bg-slate-800 px-2 py-1 rounded text-slate-100"
        value={block.props.url}
        onChange={(e) => updateProps({ url: e.target.value })}
        placeholder="Video embed URL"
      />
      <div className="mt-2 flex gap-3">
        <label className="flex items-center gap-2 text-slate-300">
          <input
            type="checkbox"
            checked={block.props.autoplay}
            onChange={(e) => updateProps({ autoplay: e.target.checked })}
          />
          Autoplay
        </label>
        <label className="flex items-center gap-2 text-slate-300">
          <input
            type="checkbox"
            checked={block.props.controls}
            onChange={(e) => updateProps({ controls: e.target.checked })}
          />
          Show Controls
        </label>
      </div>
    </div>
  );
}

if (block.type === "form") {
  const fields: any[] = block.props.fields || [];
  const updateField = (idx: number, patch: any) => {
    const next = fields.map((f, i) => (i === idx ? { ...f, ...patch } : f));
    updateProps({ fields: next });
  };
  const addField = () =>
    updateProps({
      fields: [...fields, { label: "New Field", type: "text", placeholder: "" }],
    });
  const removeField = (idx: number) =>
    updateProps({ fields: fields.filter((_, i) => i !== idx) });

  return (
    <div style={appliedStyle}>
      <StyleControls />
      <input
        className="w-full bg-transparent border-b border-slate-700 pb-2 text-lg font-semibold text-white mb-3"
        value={block.props.title}
        onChange={(e) => updateProps({ title: e.target.value })}
        placeholder="Form title"
      />
      <div className="space-y-3">
        {fields.map((f: any, idx: number) => (
          <div key={idx} className="flex gap-2 items-start">
            <input
              className="bg-slate-800 px-2 py-1 rounded flex-1"
              value={f.label}
              onChange={(e) => updateField(idx, { label: e.target.value })}
              placeholder="Field label"
            />
            <select
              className="bg-slate-800 px-2 py-1 rounded"
              value={f.type}
              onChange={(e) => updateField(idx, { type: e.target.value })}
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="textarea">Textarea</option>
            </select>
            <button
              onClick={() => removeField(idx)}
              className="px-2 py-1 bg-red-600 rounded text-white"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addField}
          className="px-3 py-1 bg-indigo-600 rounded text-white text-sm"
        >
          Add field
        </button>
      </div>
      <input
        className="mt-4 bg-slate-800 px-2 py-1 rounded w-full"
        value={block.props.buttonLabel}
        onChange={(e) => updateProps({ buttonLabel: e.target.value })}
        placeholder="Submit button label"
      />
    </div>
  );
}

  if (block.type === "features") {
    const items: any[] = block.props.items || [];
    const updateItem = (idx: number, patch: any) => {
      const next = items.map((it, i) => (i === idx ? { ...it, ...patch } : it));
      updateProps({ items: next });
    };
    const addItem = () => updateProps({ items: [...items, { title: "New", desc: "" }] });
    const removeItem = (idx: number) => updateProps({ items: items.filter((_, i) => i !== idx) });

    return (
      <div style={appliedStyle}>
        <StyleControls />
        <input className="w-full bg-transparent border-b border-slate-700 pb-2 text-lg font-semibold text-white mb-3" value={block.props.title || ""} onChange={(e) => updateProps({ title: e.target.value })} />
        <div className="space-y-2">
          {items.map((it: any, idx: number) => (
            <div key={idx} className="flex gap-2 items-start">
              <input className="bg-slate-800 px-2 py-1 rounded w-32" value={it.title} onChange={(e) => updateItem(idx, { title: e.target.value })} />
              <input className="bg-slate-800 px-2 py-1 rounded flex-1" value={it.desc} onChange={(e) => updateItem(idx, { desc: e.target.value })} />
              <button onClick={() => removeItem(idx)} className="px-2 py-1 bg-red-600 rounded text-white">Remove</button>
            </div>
          ))}
          <button onClick={addItem} className="px-3 py-1 bg-indigo-600 rounded text-white text-sm">Add feature</button>
        </div>
      </div>
    );
  }

  if (block.type === "cta") {
    return (
      <div style={appliedStyle} className="flex items-center gap-3">
        <StyleControls />
        <input className="flex-1 bg-transparent border-b border-slate-700 pb-2 text-white" value={block.props.text || ""} onChange={(e) => updateProps({ text: e.target.value })} />
        <input className="bg-slate-800 px-2 py-1 rounded" value={block.props.buttonLabel || ""} onChange={(e) => updateProps({ buttonLabel: e.target.value })} />
      </div>
    );
  }

  if (block.type === "footer") {
    return (
      <div style={appliedStyle}>
        <StyleControls />
        <input className="w-full bg-transparent border-b border-slate-700 pb-2 text-slate-300" value={block.props.text || ""} onChange={(e) => updateProps({ text: e.target.value })} />
      </div>
    );
  }

  // default dump
  return (
    <pre className="text-xs text-slate-400">{JSON.stringify(block, null, 2)}</pre>
  );
}
