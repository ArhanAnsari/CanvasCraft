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

  // All blocks should be full width and responsive
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div style={appliedStyle} className="w-full max-w-full overflow-hidden">
      {children}
    </div>
  );

  if (block.type === "hero") {
    return (
      <Wrapper>
        <StyleControls />
        <div className="text-center">
          <RichEditable
            html={block.props.heading || ""}
            onChange={(html) => updateProps({ heading: html })}
            placeholder="Hero heading..."
            className="text-2xl md:text-4xl font-bold text-white"
          />
          <div className="mt-3">
            <RichEditable
              html={block.props.subheading || ""}
              onChange={(html) => updateProps({ subheading: html })}
              placeholder="Subheading..."
              className="text-slate-300"
            />
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center items-center">
            <input
              className="bg-slate-800 px-3 py-2 rounded w-full sm:w-auto"
              value={block.props.buttonLabel || ""}
              onChange={(e) => updateProps({ buttonLabel: e.target.value })}
              placeholder="Button label"
            />
            <input
              className="bg-slate-800 px-3 py-2 rounded w-full sm:w-64"
              value={block.props.buttonHref || ""}
              onChange={(e) => updateProps({ buttonHref: e.target.value })}
              placeholder="Button href"
            />
          </div>
        </div>
      </Wrapper>
    );
  }

  if (block.type === "text") {
    return (
      <Wrapper>
        <StyleControls />
        <textarea
          className="w-full bg-transparent border border-slate-700 rounded p-2 text-slate-100"
          value={block.props.text || ""}
          onChange={(e) => updateProps({ text: e.target.value })}
        />
      </Wrapper>
    );
  }

  if (block.type === "image") {
    return (
      <Wrapper>
        <StyleControls />
        <div className="w-full">
          <img
            src={block.props.url}
            alt={block.props.alt || "image block"}
            className="w-full h-auto max-h-[60vh] object-cover rounded"
          />
          <input
            className="mt-2 w-full bg-slate-800 px-2 py-1 rounded"
            value={block.props.caption || ""}
            onChange={(e) => updateProps({ caption: e.target.value })}
            placeholder="Caption (optional)"
          />
        </div>
      </Wrapper>
    );
  }

  if (block.type === "video") {
    return (
      <Wrapper>
        <StyleControls />
        {/* responsive embed using padding-bottom */}
        <div className="w-full">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={block.props.url}
              title="video"
              className="absolute inset-0 w-full h-full border-0 rounded"
              allowFullScreen
            />
          </div>

          <div className="mt-3 flex flex-col sm:flex-row gap-3">
            <input
              className="w-full sm:w-auto bg-slate-800 px-2 py-1 rounded text-slate-100"
              value={block.props.url || ""}
              onChange={(e) => updateProps({ url: e.target.value })}
              placeholder="Video embed URL (youtube / vimeo embed)"
            />
            <label className="flex items-center gap-2 text-slate-300">
              <input
                type="checkbox"
                checked={!!block.props.autoplay}
                onChange={(e) => updateProps({ autoplay: e.target.checked })}
              />
              Autoplay
            </label>
            <label className="flex items-center gap-2 text-slate-300">
              <input
                type="checkbox"
                checked={!!block.props.controls}
                onChange={(e) => updateProps({ controls: e.target.checked })}
              />
              Show Controls
            </label>
          </div>
        </div>
      </Wrapper>
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
      <Wrapper>
        <StyleControls />
        <div>
          <input
            className="w-full bg-transparent border-b border-slate-700 pb-2 text-lg font-semibold text-white mb-3"
            value={block.props.title || ""}
            onChange={(e) => updateProps({ title: e.target.value })}
            placeholder="Form title"
          />
          <div className="space-y-3">
            {fields.map((f: any, idx: number) => (
              <div key={idx} className="flex flex-col md:flex-row gap-2 items-start">
                <input
                  className="bg-slate-800 px-2 py-2 rounded flex-1"
                  value={f.label}
                  onChange={(e) => updateField(idx, { label: e.target.value })}
                  placeholder="Field label"
                />
                <select
                  className="bg-slate-800 px-2 py-2 rounded"
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
            <div className="flex gap-2">
              <button
                onClick={addField}
                className="px-3 py-1 bg-indigo-600 rounded text-white text-sm"
              >
                Add field
              </button>
              <input
                className="ml-auto bg-slate-800 px-2 py-1 rounded"
                value={block.props.buttonLabel || ""}
                onChange={(e) => updateProps({ buttonLabel: e.target.value })}
                placeholder="Submit button label"
              />
            </div>
          </div>
        </div>
      </Wrapper>
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
      <Wrapper>
        <StyleControls />
        <input
          className="w-full bg-transparent border-b border-slate-700 pb-2 text-lg font-semibold text-white mb-3"
          value={block.props.title || ""}
          onChange={(e) => updateProps({ title: e.target.value })}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((it: any, idx: number) => (
            <div key={idx} className="p-3 bg-slate-900 rounded break-words">
              <input className="w-full bg-transparent text-white font-semibold mb-2" value={it.title} onChange={(e) => updateItem(idx, { title: e.target.value })} />
              <textarea className="w-full bg-transparent text-slate-300" value={it.desc} onChange={(e) => updateItem(idx, { desc: e.target.value })} />
              <div className="mt-2 flex justify-end">
                <button onClick={() => removeItem(idx)} className="px-2 py-1 bg-red-600 rounded text-white">Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <button onClick={addItem} className="px-3 py-1 bg-indigo-600 rounded text-white text-sm">Add feature</button>
        </div>
      </Wrapper>
    );
  }

  if (block.type === "cta") {
    return (
      <Wrapper>
        <StyleControls />
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <input className="flex-1 bg-transparent border-b border-slate-700 pb-2 text-white" value={block.props.text || ""} onChange={(e) => updateProps({ text: e.target.value })} />
          <input className="bg-slate-800 px-2 py-1 rounded" value={block.props.buttonLabel || ""} onChange={(e) => updateProps({ buttonLabel: e.target.value })} />
        </div>
      </Wrapper>
    );
  }

  if (block.type === "footer") {
    return (
      <Wrapper>
        <StyleControls />
        <input className="w-full bg-transparent border-b border-slate-700 pb-2 text-slate-300" value={block.props.text || ""} onChange={(e) => updateProps({ text: e.target.value })} />
      </Wrapper>
    );
  }

  // default dump
  return (
    <pre className="text-xs text-slate-400 break-words">{JSON.stringify(block, null, 2)}</pre>
  );
}
