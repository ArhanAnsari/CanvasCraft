"use client";

import React, { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { yCollab } from "y-codemirror.next";
import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";

export default function Editor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [ydoc] = useState(new Y.Doc());

  useEffect(() => {
    if (!editorRef.current) return;

    const provider = new WebrtcProvider("canvascraft-room", ydoc);
    const yText = ydoc.getText("codemirror");

    const state = EditorState.create({
      doc: "console.log('Hello CanvasCraft!')",
      extensions: [
        basicSetup,
        javascript(),
        yCollab(yText, provider.awareness),
        EditorView.lineWrapping,
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    return () => {
      view.destroy();
      provider.destroy();
    };
  }, [ydoc]);

  return (
    <div className="border rounded-lg p-2 bg-gray-900 text-white">
      <div ref={editorRef} className="h-96" />
    </div>
  );
}