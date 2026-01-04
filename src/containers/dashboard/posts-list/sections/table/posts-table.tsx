"use client";

import Link from "next/link";
import { useState } from "react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import type { PostWithAuthor } from "@/types/post";
import { togglePublish } from "@/app/actions/posts";
import { useRouter } from "next/navigation";
import { DeleteConfirmation } from "@/components/dashboard/delete-confirmation";

interface PostsTableProps {
  posts: PostWithAuthor[];
}

export function PostsTable({ posts: initialPosts }: PostsTableProps) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    postId: string;
    postTitle: string;
  }>({
    isOpen: false,
    postId: "",
    postTitle: "",
  });

  const handleTogglePublish = async (postId: string) => {
    setLoadingId(postId);
    try {
      const result = await togglePublish(postId);
      if (result.success) {
        // Update local state
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, published: !post.published }
            : post
        ));
      }
    } catch (error) {
      console.error("Failed to toggle publish:", error);
    } finally {
      setLoadingId(null);
      router.refresh();
    }
  };

  if (posts.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          No posts found. Create your first post to get started!
        </p>
        <Link href="/dashboard/posts/new">
          <Button className="mt-4">Create Post</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">
                <Link
                  href={`/dashboard/posts/${post.id}/edit`}
                  className="hover:underline"
                >
                  {post.title}
                </Link>
              </TableCell>
              <TableCell>
                <Badge variant={post.published ? "default" : "secondary"}>
                  {post.published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(post.createdAt)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(post.updatedAt)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTogglePublish(post.id)}
                    disabled={loadingId === post.id}
                    title={post.published ? "Unpublish" : "Publish"}
                  >
                    {post.published ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Link href={`/dashboard/posts/${post.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() =>
                      setDeleteDialog({
                        isOpen: true,
                        postId: post.id,
                        postTitle: post.title,
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DeleteConfirmation
        postId={deleteDialog.postId}
        postTitle={deleteDialog.postTitle}
        isOpen={deleteDialog.isOpen}
        onClose={() =>
          setDeleteDialog({ isOpen: false, postId: "", postTitle: "" })
        }
      />
    </div>
  );
}
