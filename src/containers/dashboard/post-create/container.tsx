"use client";

import { useRouter } from "next/navigation";
import { PostForm } from "@/components/dashboard/post-form";
import type { PostFormData } from "@/lib/schemas/post";
import { createPost } from "@/app/actions/posts";

export function PostCreateContainer() {
  const router = useRouter();

  const handleSubmit = async (data: PostFormData) => {
    try {
      const result = await createPost(data);
      if (result.success) {
        router.push("/dashboard/posts");
        router.refresh();
      } else {
        console.error("Failed to create post:", result.error);
        alert(result.error || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An unexpected error occurred");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <p className="text-muted-foreground mt-2">
          Write and publish a new blog post
        </p>
      </div>

      <div className="max-w-4xl">
        <PostForm onSubmit={handleSubmit} submitLabel="Create Post" />
      </div>
    </div>
  );
}
