"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// Helper to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// List all tags with post counts
export async function getAllTags() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });

  return { data: tags };
}

// Get single tag
export async function getTag(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  const tag = await prisma.tag.findUnique({
    where: { id },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });

  if (!tag) {
    return { error: "Tag not found" };
  }

  return { data: tag };
}

// Create tag
export async function createTag(data: { name: string; slug?: string }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  const slug = data.slug || generateSlug(data.name);

  // Check for duplicate name
  const existingByName = await prisma.tag.findUnique({
    where: { name: data.name },
  });

  if (existingByName) {
    return { error: "Tag with this name already exists" };
  }

  // Check for duplicate slug
  const existingBySlug = await prisma.tag.findUnique({
    where: { slug },
  });

  if (existingBySlug) {
    return { error: "Tag with this slug already exists" };
  }

  const tag = await prisma.tag.create({
    data: {
      name: data.name,
      slug,
    },
  });

  revalidatePath("/dashboard/tags");
  return { data: tag };
}

// Update tag
export async function updateTag(
  id: string,
  data: { name: string; slug?: string }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  const slug = data.slug || generateSlug(data.name);

  // Check for duplicate name (excluding current tag)
  const existingByName = await prisma.tag.findFirst({
    where: {
      name: data.name,
      NOT: { id },
    },
  });

  if (existingByName) {
    return { error: "Tag with this name already exists" };
  }

  // Check for duplicate slug (excluding current tag)
  const existingBySlug = await prisma.tag.findFirst({
    where: {
      slug,
      NOT: { id },
    },
  });

  if (existingBySlug) {
    return { error: "Tag with this slug already exists" };
  }

  const tag = await prisma.tag.update({
    where: { id },
    data: {
      name: data.name,
      slug,
    },
  });

  revalidatePath("/dashboard/tags");
  revalidatePath("/blog");
  return { data: tag };
}

// Delete tag
export async function deleteTag(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  // PostTag relations will be cascade deleted automatically
  await prisma.tag.delete({
    where: { id },
  });

  revalidatePath("/dashboard/tags");
  revalidatePath("/blog");
  return { success: true };
}
