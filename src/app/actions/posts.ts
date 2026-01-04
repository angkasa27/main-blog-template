"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { postSchema, postUpdateSchema } from "@/lib/schemas/post";
import type { PostFormData, PostUpdateData } from "@/lib/schemas/post";
import type { Post } from "@/generated/prisma/client";
import type { PostWithAuthor } from "@/types/post";

export async function createPost(data: PostFormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const validated = postSchema.parse(data);

  const post = await prisma.post.create({
    data: {
      ...validated,
      authorId: session.user.id,
      publishedAt: validated.published ? new Date() : null,
    },
  });

  revalidatePath("/dashboard/posts");
  if (validated.published) {
    revalidatePath("/");
    revalidatePath("/blog");
  }
  
  redirect(`/dashboard/posts/${post.id}/edit`);
}

export async function updatePost(id: string, data: PostUpdateData): Promise<Post> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  // Check ownership
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing || existing.authorId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const validated = postUpdateSchema.parse(data);

  const post = await prisma.post.update({
    where: { id },
    data: validated,
  });

  revalidatePath("/dashboard/posts");
  revalidatePath(`/blog/${post.slug}`);
  if (post.published) {
    revalidatePath("/");
    revalidatePath("/blog");
  }

  return post;
}

export async function deletePost(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing || existing.authorId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.post.delete({ where: { id } });

  revalidatePath("/dashboard/posts");
  if (existing.published) {
    revalidatePath("/");
    revalidatePath("/blog");
  }

  redirect("/dashboard/posts");
}

export async function togglePublish(id: string): Promise<Post> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing || existing.authorId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.update({
    where: { id },
    data: {
      published: !existing.published,
      publishedAt: !existing.published ? new Date() : existing.publishedAt,
    },
  });

  revalidatePath("/dashboard/posts");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/");
  revalidatePath("/blog");

  return post;
}

export async function getUserPosts(): Promise<PostWithAuthor[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const posts = await prisma.post.findMany({
    where: { authorId: session.user.id },
    orderBy: { updatedAt: "desc" },
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

  return posts;
}

export async function getPostById(id: string): Promise<PostWithAuthor> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.findUnique({
    where: { id },
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

  if (!post || post.authorId !== session.user.id) {
    throw new Error("Post not found");
  }

  return post;
}
