"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

interface TiptapViewerProps {
  content: string;
}

export function TiptapViewer({ content }: TiptapViewerProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
    ],
    content,
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-lg prose-neutral dark:prose-invert max-w-none focus:outline-none",
      },
    },
  });

  return <EditorContent editor={editor} />;
}
