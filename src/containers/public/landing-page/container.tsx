import prisma from "@/lib/prisma";
import { Hero } from "./sections/hero";
import { RecentPosts } from "./sections/recent-posts";

export async function LandingPageContainer() {
  // Fetch recent published posts
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 6,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen">
      <Hero />
      <RecentPosts posts={posts} />
    </main>
  );
}
