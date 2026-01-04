import Link from "next/link";
import { PostCard } from "@/components/blog/post-card";
import type { PostListItem } from "@/types/post";

interface RecentPostsProps {
  posts: PostListItem[];
}

export function RecentPosts({ posts }: RecentPostsProps) {
  if (posts.length === 0) {
    return (
      <section className="py-16 sm:py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              Recent Posts
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              No posts yet. Check back soon!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between sm:mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Recent Posts
          </h2>
          <Link
            href="/blog"
            className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            View all →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Explore All Posts
          </Link>
        </div>
      </div>
    </section>
  );
}
