"use client";

import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { formatDate } from "@/lib/utils";
import { formatISO } from "date-fns";
import type { PostListItem } from "@/types/post";
import { TagBadge } from "@/components/blog/tag-badge";
import { ArrowRight } from "lucide-react";

interface FeaturedPostProps {
  post: PostListItem;
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg transition-all hover:shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {post.coverImage && (
          <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 lg:aspect-auto lg:h-full">
            <CldImage
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        )}
        
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
          <div className="mb-3 inline-flex items-center gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              Featured
            </span>
            {post.tags && post.tags.length > 0 && (
              <TagBadge
                name={post.tags[0].tag.name}
                slug={post.tags[0].tag.slug}
                href={`/blog/tags/${post.tags[0].tag.slug}`}
              />
            )}
          </div>
          
          <h2 className="mb-4 text-3xl font-bold text-neutral-900 transition-colors group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400 sm:text-4xl">
            {post.title}
          </h2>
          
          {post.excerpt && (
            <p className="mb-6 line-clamp-3 text-neutral-600 dark:text-neutral-400">
              {post.excerpt}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-500">
              <span className="font-medium">{post.author.name}</span>
              <span>•</span>
              <time dateTime={post.publishedAt ? formatISO(post.publishedAt) : formatISO(post.createdAt)}>
                {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
              </time>
            </div>
            
            <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
              Read more
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
