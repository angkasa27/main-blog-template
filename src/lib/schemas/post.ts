import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must be lowercase letters, numbers, and hyphens only"
    ),
  excerpt: z
    .string()
    .max(200, "Excerpt must be 200 characters or less")
    .optional()
    .or(z.literal("")),
  content: z.string().min(10, "Content must be at least 10 characters"),
  coverImage: z.url("Must be a valid URL").optional().or(z.literal("")),
  published: z.boolean(),
  // SEO fields
  metaTitle: z
    .string()
    .max(60, "Meta title must be 60 characters or less")
    .optional()
    .or(z.literal("")),
  metaDescription: z
    .string()
    .max(160, "Meta description must be 160 characters or less")
    .optional()
    .or(z.literal("")),
  metaKeywords: z.string().optional().or(z.literal("")),
  ogImage: z.url("Must be a valid URL").optional().or(z.literal("")),
});

export const postUpdateSchema = postSchema.partial();

export const createPostSchema = postSchema;

export type PostFormData = z.infer<typeof postSchema>;
export type PostUpdateData = z.infer<typeof postUpdateSchema>;
export type CreatePostData = z.infer<typeof createPostSchema>;
