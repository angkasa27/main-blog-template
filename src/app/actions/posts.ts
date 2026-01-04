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

export async function createPost(data: PostFormData): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = postSchema.parse(data);

    const post = await prisma.post.create({
      data: {
        ...validated,
        authorId: session.user.id,
        publishedAt: validated.published ? new Date() : null,
        featuredAt: validated.featured ? new Date() : null,
        tags: validated.tagIds
          ? {
              create: validated.tagIds.map((tagId) => ({
                tagId,
              })),
            }
          : undefined,
      },
    });

    revalidatePath("/dashboard/posts");
    if (validated.published) {
      revalidatePath("/");
      revalidatePath("/blog");
    }

    return { success: true, postId: post.id };
  } catch (error) {
    console.error("Create post error:", error);
    return { success: false, error: "Failed to create post" };
  }
}

export async function updatePost(id: string, data: PostUpdateData): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    // Check ownership
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing || existing.authorId !== session.user.id) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = postUpdateSchema.parse(data);

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...validated,
        tags: validated.tagIds
          ? {
              deleteMany: {}, // Remove all existing tags
              create: validated.tagIds.map((tagId) => ({
                tagId,
              })),
            }
          : undefined,
      },
    });

    revalidatePath("/dashboard/posts");
    revalidatePath(`/blog/${post.slug}`);
    if (post.published) {
      revalidatePath("/");
      revalidatePath("/blog");
    }

    return { success: true };
  } catch (error) {
    console.error("Update post error:", error);
    return { success: false, error: "Failed to update post" };
  }
}

export async function deletePost(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing || existing.authorId !== session.user.id) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.post.delete({ where: { id } });

    revalidatePath("/dashboard/posts");
    if (existing.published) {
      revalidatePath("/");
      revalidatePath("/blog");
    }

    return { success: true };
  } catch (error) {
    console.error("Delete post error:", error);
    return { success: false, error: "Failed to delete post" };
  }
}

export async function togglePublish(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing || existing.authorId !== session.user.id) {
      return { success: false, error: "Unauthorized" };
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

    return { success: true };
  } catch (error) {
    console.error("Toggle publish error:", error);
    return { success: false, error: "Failed to toggle publish status" };
  }
}

export async function toggleFeatured(id: string): Promise<{ success: boolean; featured?: boolean; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing || existing.authorId !== session.user.id) {
      return { success: false, error: "Unauthorized" };
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        featured: !existing.featured,
        featuredAt: !existing.featured ? new Date() : null,
      },
    });

    revalidatePath("/dashboard/posts");
    revalidatePath("/");
    revalidatePath("/blog");

    return { success: true, featured: post.featured };
  } catch (error) {
    console.error("Toggle featured error:", error);
    return { success: false, error: "Failed to toggle featured status" };
  }
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
