import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { StatsCards } from "./sections/stats";
import { RecentPosts } from "./sections/recent-posts";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export async function DashboardHomeContainer() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  // Get post statistics
  const [totalPosts, publishedPosts, draftPosts, recentPosts] =
    await Promise.all([
      prisma.post.count({
        where: { authorId: session.user.id },
      }),
      prisma.post.count({
        where: { authorId: session.user.id, published: true },
      }),
      prisma.post.count({
        where: { authorId: session.user.id, published: false },
      }),
      prisma.post.findMany({
        where: { authorId: session.user.id },
        include: {
          author: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here&apos;s an overview of your blog.
          </p>
        </div>
        <Link href="/dashboard/posts/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      <StatsCards
        totalPosts={totalPosts}
        publishedPosts={publishedPosts}
        draftPosts={draftPosts}
      />

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
        <RecentPosts posts={recentPosts} />
      </div>
    </div>
  );
}
