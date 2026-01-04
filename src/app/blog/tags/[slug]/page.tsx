import prisma from "@/lib/prisma";
import { PostCard } from "@/components/blog/post-card";
import { notFound } from "next/navigation";
import type { PostListItem } from "@/types/post";

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;

  const tag = await prisma.tag.findUnique({
    where: { slug },
    include: {
      posts: {
        where: {
          post: {
            published: true,
          },
        },
        include: {
          post: {
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
          },
        },
      },
    },
  });

  if (!tag) {
    notFound();
  }

  const posts: PostListItem[] = tag.posts.map((pt) => pt.post);

  return (
    <main className="min-h-screen py-16 sm:py-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-5xl">
            {tag.name}
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            {posts.length} {posts.length === 1 ? "article" : "articles"} tagged
            with &quot;{tag.name}&quot;
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-neutral-600 dark:text-neutral-400">
              No posts found with this tag.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  const tags = await prisma.tag.findMany({
    select: { slug: true },
  });

  return tags.map((tag) => ({
    slug: tag.slug,
  }));
}
