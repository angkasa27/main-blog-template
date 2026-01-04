import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { PostsTable } from "./sections/table";
import type { PostWithAuthor } from "@/types/post";

interface PostsListContainerProps {
  posts: PostWithAuthor[];
}

export function PostsListContainer({ posts }: PostsListContainerProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-muted-foreground mt-2">
            Manage all your blog posts
          </p>
        </div>
        <Link href="/dashboard/posts/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      <PostsTable posts={posts} />
    </div>
  );
}
