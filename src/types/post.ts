import type { Post, User } from "@/generated/prisma/client";

export type PostWithAuthor = Post & {
  author: Pick<User, "id" | "name" | "email" | "image">;
};

export type PostListItem = Pick<
  Post,
  "id" | "title" | "slug" | "excerpt" | "coverImage" | "published" | "publishedAt" | "createdAt" | "updatedAt"
> & {
  author: Pick<User, "id" | "name" | "email" | "image">;
};
