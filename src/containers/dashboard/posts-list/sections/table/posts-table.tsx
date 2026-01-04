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
import {
  Pencil,
  Trash2,
  Archive,
  ArchiveRestore,
  Eye,
  Star,
} from "lucide-react";
import type { PostWithAuthor } from "@/types/post";
import { togglePublish, toggleFeatured } from "@/app/actions/posts";
import { useRouter } from "next/navigation";
import { DeleteConfirmation } from "@/components/dashboard/delete-confirmation";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PostsTableProps {
  posts: PostWithAuthor[];
}

export function PostsTable({ posts: initialPosts }: PostsTableProps) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [featuredLoadingId, setFeaturedLoadingId] = useState<string | null>(
    null
  );
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
        setPosts(
          posts.map((post) =>
            post.id === postId ? { ...post, published: !post.published } : post
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle publish:", error);
    } finally {
      setLoadingId(null);
      router.refresh();
    }
  };

  const handleToggleFeatured = async (postId: string) => {
    setFeaturedLoadingId(postId);
    try {
      const result = await toggleFeatured(postId);
      if (result.success) {
        // Update local state
        setPosts(
          posts.map((post) =>
            post.id === postId ? { ...post, featured: !post.featured } : post
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle featured:", error);
    } finally {
      setFeaturedLoadingId(null);
      router.refresh();
    }
  };

  if (posts.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          No posts found. Create your first post to get started!
        </p>
        <Button
          nativeButton={false}
          className="mt-4"
          render={<Link href="/dashboard/posts/new">Create Post</Link>}
        />
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Views</TableHead>
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
              <TableCell>
                <Button
                  size="sm"
                  variant={post.featured ? "default" : "outline"}
                  onClick={() => handleToggleFeatured(post.id)}
                  disabled={featuredLoadingId === post.id}
                  className="gap-1"
                >
                  <Star
                    className={`h-4 w-4 ${post.featured ? "fill-current" : ""}`}
                  />
                  {post.featured ? "Featured" : "Feature"}
                </Button>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {(post.viewCount ?? 0).toLocaleString()}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(post.createdAt, "d MMMM yyyy, HH:mm")}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(post.updatedAt, "d MMMM yyyy, HH:mm")}
              </TableCell>
              <TableCell className="flex justify-end">
                <ButtonGroup>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          nativeButton={false}
                          size="sm"
                          variant="secondary"
                          disabled={!post.published}
                          render={
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          }
                        />
                      }
                    />
                    <TooltipContent>View</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          size="sm"
                          onClick={() => handleTogglePublish(post.id)}
                          variant="secondary"
                          disabled={loadingId === post.id}
                          title={post.published ? "Unpublish" : "Publish"}
                        >
                          {post.published ? (
                            <Archive className="h-4 w-4" />
                          ) : (
                            <ArchiveRestore className="h-4 w-4" />
                          )}
                        </Button>
                      }
                    />
                    <TooltipContent>
                      {post.published ? "Unpublish" : "Publish"}
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          size="sm"
                          variant="secondary"
                          nativeButton={false}
                          render={
                            <Link href={`/dashboard/posts/${post.id}/edit`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          }
                        />
                      }
                    />
                    <TooltipContent>Edit</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          size="sm"
                          variant="destructive"
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
                      }
                    />
                    <TooltipContent>Delete</TooltipContent>
                  </Tooltip>
                </ButtonGroup>
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
