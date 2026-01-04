"use client";

import Link from "next/link";
import { useState, useMemo, useCallback } from "react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { PostDeleteConfirmation } from "@/components/dashboard/post-delete-confirmation";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable, type FilterConfig } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

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

  const handleTogglePublish = useCallback(async (postId: string) => {
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
  }, [posts, router]);

  const handleToggleFeatured = useCallback(async (postId: string) => {
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
  }, [posts, router]);

  const columns = useMemo<ColumnDef<PostWithAuthor>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Title" />
        ),
        cell: ({ row }) => (
          <Link
            href={`/dashboard/posts/${row.original.id}/edit`}
            className="hover:underline font-medium"
          >
            {row.getValue("title")}
          </Link>
        ),
      },
      {
        accessorKey: "published",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => (
          <Badge variant={row.getValue("published") ? "default" : "secondary"}>
            {row.getValue("published") ? "Published" : "Draft"}
          </Badge>
        ),
        filterFn: (row, id, value) => {
          if (value === "all") return true;
          if (value === "published") return row.getValue(id) === true;
          if (value === "draft") return row.getValue(id) === false;
          return true;
        },
      },
      {
        accessorKey: "featured",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Featured" />
        ),
        cell: ({ row }) => (
          <Button
            size="sm"
            variant={row.original.featured ? "default" : "outline"}
            onClick={() => handleToggleFeatured(row.original.id)}
            disabled={featuredLoadingId === row.original.id}
            className="gap-1"
          >
            <Star
              className={`h-4 w-4 ${row.original.featured ? "fill-current" : ""}`}
            />
            {row.original.featured ? "Featured" : "Feature"}
          </Button>
        ),
        filterFn: (row, id, value) => {
          if (value === "all") return true;
          if (value === "featured") return row.getValue(id) === true;
          if (value === "not-featured") return row.getValue(id) === false;
          return true;
        },
      },
      {
        accessorKey: "viewCount",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Views" />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {(row.getValue("viewCount") ?? 0).toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Created" />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {formatDate(row.getValue("createdAt"), "d MMM yyyy")}
          </span>
        ),
      },
      {
        accessorKey: "updatedAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Updated" />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {formatDate(row.getValue("updatedAt"), "d MMM yyyy")}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <ButtonGroup>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      nativeButton={false}
                      size="sm"
                      variant="secondary"
                      disabled={!row.original.published}
                      render={
                        <Link
                          href={`/blog/${row.original.slug}`}
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
                      onClick={() => handleTogglePublish(row.original.id)}
                      variant="secondary"
                      disabled={loadingId === row.original.id}
                    >
                      {row.original.published ? (
                        <Archive className="h-4 w-4" />
                      ) : (
                        <ArchiveRestore className="h-4 w-4" />
                      )}
                    </Button>
                  }
                />
                <TooltipContent>
                  {row.original.published ? "Unpublish" : "Publish"}
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
                        <Link href={`/dashboard/posts/${row.original.id}/edit`}>
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
                          postId: row.original.id,
                          postTitle: row.original.title,
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
          </div>
        ),
      },
    ],
    [featuredLoadingId, loadingId, handleToggleFeatured, handleTogglePublish]
  );

  const filters: FilterConfig[] = [
    {
      columnId: "published",
      label: "Status",
      options: [
        { label: "All Status", value: "all" },
        { label: "Published", value: "published" },
        { label: "Draft", value: "draft" },
      ],
    },
    {
      columnId: "featured",
      label: "Featured",
      options: [
        { label: "All Posts", value: "all" },
        { label: "Featured", value: "featured" },
        { label: "Not Featured", value: "not-featured" },
      ],
    },
  ];

  const emptyState = (
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

  return (
    <>
      <DataTable
        columns={columns}
        data={posts}
        searchPlaceholder="Search posts..."
        filters={filters}
        pageSize={10}
        emptyState={emptyState}
      />

      <PostDeleteConfirmation
        postId={deleteDialog.postId}
        postTitle={deleteDialog.postTitle}
        isOpen={deleteDialog.isOpen}
        onClose={() =>
          setDeleteDialog({ isOpen: false, postId: "", postTitle: "" })
        }
      />
    </>
  );
}
