"use client";

import { useState } from "react";
import { PostCard } from "@/components/blog/post-card";
import type { PostListItem } from "@/types/post";

interface PostsGridProps {
  initialPosts: PostListItem[];
  totalPages: number;
}

export function PostsGrid({ initialPosts, totalPages }: PostsGridProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (page >= totalPages || loading) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/posts?page=${page + 1}&limit=12`);
      const result = await response.json();

      if (result.success) {
        setPosts([...posts, ...result.data]);
        setPage(page + 1);
      }
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {page < totalPages && (
        <div className="mt-12 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
