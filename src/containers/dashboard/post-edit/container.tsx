"use client";

import { useRouter } from "next/navigation";
import { PostForm } from "@/components/dashboard/post-form";
import type { PostFormData } from "@/lib/schemas/post";
import type { PostWithAuthor } from "@/types/post";
import { updatePost } from "@/app/actions/posts";

interface PostEditContainerProps {
  post: PostWithAuthor;
}

export function PostEditContainer({ post }: PostEditContainerProps) {
  const router = useRouter();

  const handleSubmit = async (data: PostFormData) => {
    try {
      const result = await updatePost(post.id, data);
      if (result.success) {
        router.push("/dashboard/posts");
        router.refresh();
      } else {
        console.error("Failed to update post:", result.error);
        alert(result.error || "Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("An unexpected error occurred");
    }
  };

  const defaultValues: Partial<PostFormData> = {
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt || "",
    coverImage: post.coverImage || "",
    metaTitle: post.metaTitle || "",
    metaDescription: post.metaDescription || "",
    published: post.published,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Post</h1>
        <p className="text-muted-foreground mt-2">
          Update your blog post content
        </p>
      </div>

      <div className="max-w-4xl">
        <PostForm
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          submitLabel="Update Post"
        />
      </div>
    </div>
  );
}
