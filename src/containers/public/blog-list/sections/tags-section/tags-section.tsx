"use client";

import Link from "next/link";
import { Tag as TagIcon } from "lucide-react";
import type { TagWithCount } from "@/types/tag";

interface TagsSectionProps {
  tags: TagWithCount[];
}

export function TagsSection({ tags }: TagsSectionProps) {
  if (tags.length === 0) return null;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-6 flex items-center gap-2">
        <TagIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
          Popular Tags
        </h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag.id}
            href={`/blog/tags/${tag.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-blue-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
          >
            {tag.name}
            <span className="text-xs text-neutral-500 dark:text-neutral-500">
              {tag._count.posts}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
