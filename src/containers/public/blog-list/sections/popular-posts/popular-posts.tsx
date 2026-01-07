"use client";

import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { formatDate } from "@/lib/utils";
import type { PostListItem } from "@/types/post";
import { TrendingUp } from "lucide-react";

interface PopularPostsProps {
  posts: PostListItem[];
}

export function PopularPosts({ posts }: PopularPostsProps) {
  if (posts.length === 0) return null;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-6 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
          Popular Posts
        </h3>
      </div>
      
      <div className="space-y-4">
        {posts.map((post, index) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex gap-4 transition-all hover:translate-x-1"
          >
            {post.coverImage && (
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <CldImage
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  #{index + 1}
                </span>
                <span className="text-xs text-neutral-500">
                  {post.viewCount} views
                </span>
              </div>
              <h4 className="mb-1 line-clamp-2 text-sm font-medium text-neutral-900 group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400">
                {post.title}
              </h4>
              <p className="text-xs text-neutral-500">
                {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
