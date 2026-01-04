import { TiptapViewer } from "@/components/editor/tiptap-viewer";

interface ContentProps {
  content: string;
}

export function Content({ content }: ContentProps) {
  return (
    <article className="mx-auto max-w-none">
      <TiptapViewer content={content} />
    </article>
  );
}
