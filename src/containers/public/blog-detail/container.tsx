import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Header } from "./sections/header";
import { Content } from "./sections/content";
import { Footer } from "./sections/footer";
import { ViewTracker } from "@/components/blog/view-tracker";

interface BlogDetailContainerProps {
  slug: string;
}

export async function BlogDetailContainer({ slug }: BlogDetailContainerProps) {
  const post = await prisma.post.findUnique({
    where: {
      slug,
      published: true,
    },
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
  });

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen py-16 sm:py-20">
      <ViewTracker slug={slug} />
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Header post={post} />
        <Content content={post.content} />
        <Footer />
      </div>
    </main>
  );
}
