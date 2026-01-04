interface ContentProps {
  content: string;
}

export function Content({ content }: ContentProps) {
  return (
    <article className="prose prose-lg prose-neutral mx-auto max-w-none dark:prose-invert">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
}
