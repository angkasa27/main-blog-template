"use client";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import type { PostListItem } from "@/types/post";
import { formatDate } from "@/lib/utils";

interface PostCardProps {
  post: PostListItem;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-lg border border-neutral-200 bg-white transition-all hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
    >
      {post.coverImage && (
        <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          <CldImage
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      
      <div className="p-4 sm:p-6">
        <h3 className="mb-2 text-xl font-semibold text-neutral-900 transition-colors group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400">
          {post.title}
        </h3>
        
        {post.excerpt && (
          <p className="mb-4 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
            {post.excerpt}
          </p>
        )}
        
        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-500">
          <span>{post.author.name}</span>
          <span>•</span>
          <time dateTime={post.publishedAt?.toISOString()}>
            {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
          </time>
        </div>
      </div>
    </Link>
  );
}
