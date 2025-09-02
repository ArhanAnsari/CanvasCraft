'use client';
import { motion } from "framer-motion";
import type { Block } from "./templates";

export default function BlockRenderer({
  block,
  onUpdate,
  editable = true,
}: {
  block: Block;
  onUpdate?: (b: Block) => void; // now optional
  editable?: boolean;
}) {
  if (block.type === "hero") {
    const p = block.props;
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded p-6 bg-gradient-to-br from-indigo-900/30 to-cyan-900/20"
      >
        {editable ? (
          <>
            <input
              className="w-full text-3xl font-extrabold mb-2 bg-transparent outline-none"
              defaultValue={p.heading}
              onBlur={(e) =>
                onUpdate?.({
                  ...block,
                  props: { ...p, heading: e.currentTarget.value },
                })
              }
            />
            <textarea
              className="w-full text-slate-300 bg-transparent outline-none"
              defaultValue={p.subheading}
              onBlur={(e) =>
                onUpdate?.({
                  ...block,
                  props: { ...p, subheading: e.currentTarget.value },
                })
              }
            />
            <div className="mt-3 flex gap-2">
              <input
                className="px-2 py-1 rounded bg-slate-800"
                defaultValue={p.buttonLabel}
                onBlur={(e) =>
                  onUpdate?.({
                    ...block,
                    props: { ...p, buttonLabel: e.currentTarget.value },
                  })
                }
              />
              <input
                className="px-2 py-1 rounded bg-slate-800"
                defaultValue={p.buttonHref}
                onBlur={(e) =>
                  onUpdate?.({
                    ...block,
                    props: { ...p, buttonHref: e.currentTarget.value },
                  })
                }
              />
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-extrabold mb-2">{p.heading}</h1>
            <p className="text-slate-300">{p.subheading}</p>
            {p.buttonLabel && (
              <a
                href={p.buttonHref}
                className="inline-block mt-3 px-4 py-2 bg-indigo-600 text-white rounded"
              >
                {p.buttonLabel}
              </a>
            )}
          </>
        )}
      </motion.div>
    );
  }

  if (block.type === "features") {
    const p = block.props;
    return (
      <div className="glass p-6 rounded">
        {editable ? (
          <>
            <input
              className="text-2xl font-bold mb-3 w-full bg-transparent outline-none"
              defaultValue={p.title}
              onBlur={(e) =>
                onUpdate?.({
                  ...block,
                  props: { ...p, title: e.currentTarget.value },
                })
              }
            />
            <div className="grid md:grid-cols-3 gap-4">
              {p.items.map((it: any, i: number) => (
                <div key={i} className="p-3 bg-slate-900 rounded">
                  <input
                    className="font-semibold w-full bg-transparent outline-none"
                    defaultValue={it.title}
                    onBlur={(e) => {
                      const items = [...p.items];
                      items[i] = { ...it, title: e.currentTarget.value };
                      onUpdate?.({ ...block, props: { ...p, items } });
                    }}
                  />
                  <textarea
                    className="text-sm w-full bg-transparent outline-none"
                    defaultValue={it.desc}
                    onBlur={(e) => {
                      const items = [...p.items];
                      items[i] = { ...it, desc: e.currentTarget.value };
                      onUpdate?.({ ...block, props: { ...p, items } });
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-3">{p.title}</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {p.items.map((it: any, i: number) => (
                <div key={i} className="p-3 bg-slate-900 rounded">
                  <h3 className="font-semibold">{it.title}</h3>
                  <p className="text-sm">{it.desc}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  if (block.type === "gallery") {
    const p = block.props;
    return (
      <div className="glass p-6 rounded">
        {editable ? (
          <>
            <input
              className="text-2xl font-bold mb-3 w-full bg-transparent outline-none"
              defaultValue={p.title}
              onBlur={(e) =>
                onUpdate?.({
                  ...block,
                  props: { ...p, title: e.currentTarget.value },
                })
              }
            />
            <div className="grid grid-cols-3 gap-2">
              {(p.images || []).map((url: string, i: number) => (
                <img key={i} src={url} className="rounded" />
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-3">{p.title}</h2>
            <div className="grid grid-cols-3 gap-2">
              {(p.images || []).map((url: string, i: number) => (
                <img key={i} src={url} className="rounded" />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  if (block.type === "cta") {
    const p = block.props;
    return (
      <div className="rounded p-6 text-center bg-gradient-to-r from-indigo-600/30 to-cyan-500/20">
        {editable ? (
          <input
            className="text-xl font-bold bg-transparent text-center outline-none"
            defaultValue={p.text}
            onBlur={(e) =>
              onUpdate?.({
                ...block,
                props: { ...p, text: e.currentTarget.value },
              })
            }
          />
        ) : (
          <p className="text-xl font-bold">{p.text}</p>
        )}
      </div>
    );
  }

  if (block.type === "footer") {
    const p = block.props;
    return (
      <div className="text-center opacity-80">
        {editable ? (
          <input
            className="w-full text-center bg-transparent outline-none"
            defaultValue={p.text}
            onBlur={(e) =>
              onUpdate?.({
                ...block,
                props: { ...p, text: e.currentTarget.value },
              })
            }
          />
        ) : (
          <p>{p.text}</p>
        )}
      </div>
    );
  }

  if (block.type === "text") {
    return (
      <div className="p-3 bg-slate-900 rounded">
        {editable ? (
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate?.({
                ...block,
                props: { text: e.currentTarget.textContent },
              })
            }
            className="min-h-[40px]"
          >
            {block.props.text}
          </div>
        ) : (
          <p>{block.props.text}</p>
        )}
      </div>
    );
  }

  if (block.type === "image") {
    return <img src={block.props.url} className="rounded" />;
  }

  if (block.type === "button") {
    return (
      <a href={block.props.href} className="btn btn-primary">
        {block.props.label}
      </a>
    );
  }

  return null;     
}
