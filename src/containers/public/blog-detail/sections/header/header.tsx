"use client";
import { CldImage } from "next-cloudinary";
import { formatDate } from "@/lib/utils";
import { formatISO } from "date-fns";
import type { PostWithAuthor } from "@/types/post";
import { TagBadge } from "@/components/blog/tag-badge";

interface HeaderProps {
  post: PostWithAuthor & { tags?: Array<{ tag: { id: string; name: string; slug: string } }> };
}

export function Header({ post }: HeaderProps) {
  return (
    <header className="mb-8 sm:mb-12">
      <div className="mb-6">
        <h1 className="mb-4 text-4xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-5xl lg:text-6xl">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="font-medium text-neutral-900 dark:text-neutral-100">
              {post.author.name}
            </span>
          </div>
          <span>•</span>
          <time dateTime={post.publishedAt ? formatISO(post.publishedAt) : formatISO(post.createdAt)}>
            {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
          </time>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map(({ tag }) => (
              <TagBadge
                key={tag.id}
                name={tag.name}
                slug={tag.slug}
                href={`/blog/tags/${tag.slug}`}
              />
            ))}
          </div>
        )}
      </div>

      {post.coverImage && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
          <CldImage
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            priority
          />
        </div>
      )}
    </header>
  );
}
