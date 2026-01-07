import prisma from "@/lib/prisma";
import { PostsGrid } from "./sections/posts-grid";
import { FeaturedPost } from "./sections/featured-post";
import { PopularPosts } from "./sections/popular-posts";
import { TagsSection } from "./sections/tags-section";

export async function BlogListContainer() {
  const limit = 9;
  
  // Fetch all data in parallel
  const [featuredPost, recentPosts, popularPosts, tags, total] = await Promise.all([
    // Get most recent featured post
    prisma.post.findFirst({
      where: { published: true, featured: true },
      orderBy: { publishedAt: "desc" },
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
    // Get recent posts (excluding featured)
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
    // Get popular posts (by view count)
    prisma.post.findMany({
      where: { published: true },
      orderBy: { viewCount: "desc" },
      take: 5,
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
    // Get popular tags
    prisma.tag.findMany({
      take: 10,
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: {
        posts: {
          _count: "desc",
        },
      },
    }),
    prisma.post.count({ where: { published: true } }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <main className="min-h-screen py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-neutral-900 dark:text-neutral-100 sm:text-5xl lg:text-6xl">
            Blog
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
            Insights, tutorials, and stories about web development, design, and technology
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-16">
            <FeaturedPost post={featuredPost} />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Posts */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                Recent Posts
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {total} {total === 1 ? "article" : "articles"} available
              </p>
            </div>
            
            <PostsGrid initialPosts={recentPosts} totalPages={totalPages} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <PopularPosts posts={popularPosts} />
            <TagsSection tags={tags} />
          </div>
        </div>
      </div>
    </main>
  );
}
