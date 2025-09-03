'use client';
import { Block } from "./templates";

export default function ReadOnlyBlockRenderer({ block }: { block: Block }) {
  if (block.type === "hero") {
    const p = block.props;
    return (
      <div className="rounded p-6 bg-gradient-to-br from-indigo-900/30 to-cyan-900/20 text-center">
        <h1 className="text-3xl font-extrabold mb-2">{p.heading}</h1>
        <p className="text-slate-300">{p.subheading}</p>
        {p.buttonLabel && (
          <a
            href={p.buttonHref}
            className="inline-block mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow"
          >
            {p.buttonLabel}
          </a>
        )}
      </div>
    );
  }

  if (block.type === "features") {
    const p = block.props;
    return (
      <div className="glass p-6 rounded">
        <h2 className="text-2xl font-bold mb-3">{p.title}</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {p.items.map((it: any, i: number) => (
            <div key={i} className="p-3 bg-slate-900 rounded">
              <h3 className="font-semibold">{it.title}</h3>
              <p className="text-sm">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (block.type === "gallery") {
    const p = block.props;
    return (
      <div className="glass p-6 rounded">
        <h2 className="text-2xl font-bold mb-3">{p.title}</h2>
        <div className="grid grid-cols-3 gap-2">
          {(p.images || []).map((url: string, i: number) => (
            <img
              key={i}
              src={url}
              alt={`gallery-${i}`}
              className="rounded shadow"
            />
          ))}
        </div>
      </div>
    );
  }

  if (block.type === "cta") {
    return (
      <div className="rounded p-6 text-center bg-gradient-to-r from-indigo-600/30 to-cyan-500/20">
        <p className="text-xl font-bold">{block.props.text}</p>
      </div>
    );
  }

  if (block.type === "footer") {
    return <div className="text-center opacity-80">{block.props.text}</div>;
  }

  if (block.type === "text") {
    return <p className="p-3 bg-slate-900 rounded">{block.props.text}</p>;
  }

  if (block.type === "image") {
    return (
      <img
        src={block.props.url}
        alt="block image"
        className="rounded shadow max-w-full"
      />
    );
  }

  if (block.type === "button") {
    return (
      <a
        href={block.props.href}
        className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow"
      >
        {block.props.label}
      </a>
    );
  }

  return null;
}
