import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PostsListContainer } from "@/containers/dashboard/posts-list";

export default async function PostsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const posts = await prisma.post.findMany({
    where: { authorId: session.user.id },
    include: {
      author: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return <PostsListContainer posts={posts} />;
}
