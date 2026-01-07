import type { Post, User } from "@/generated/prisma/client";
import type { Tag } from "./tag";

export type PostWithAuthor = Post & {
  author: Pick<User, "id" | "name" | "email" | "image">;
};

export type PostListItem = Pick<
  Post,
  "id" | "title" | "slug" | "excerpt" | "coverImage" | "published" | "publishedAt" | "createdAt" | "updatedAt" | "viewCount"
> & {
  author: Pick<User, "id" | "name" | "email" | "image">;
  tags?: Array<{ tag: Tag }>;
};
