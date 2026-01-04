import prisma from "@/lib/prisma";
import { PostsGrid } from "./sections/posts-grid";

export async function BlogListContainer() {
  const limit = 12;
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    }),
    prisma.post.count({ where: { published: true } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <main className="min-h-screen py-16 sm:py-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-5xl">
            All Posts
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            {total} {total === 1 ? "article" : "articles"} and counting
          </p>
        </div>

        <PostsGrid initialPosts={posts} totalPages={totalPages} />
      </div>
    </main>
  );
}
