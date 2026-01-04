"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import type { PostWithAuthor } from "@/types/post";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RecentPostsProps {
  posts: PostWithAuthor[];
}

export function RecentPosts({ posts }: RecentPostsProps) {
  const columns: ColumnDef<PostWithAuthor>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <Link
          href={`/dashboard/posts/${row.original.id}/edit`}
          className="font-medium hover:underline"
        >
          {row.original.title}
        </Link>
      ),
    },
    {
      accessorKey: "published",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.published ? "default" : "secondary"}>
          {row.original.published ? "Published" : "Draft"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {formatDate(row.original.createdAt, "d MMMM yyyy, HH:mm")}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end">
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
        </div>
      ),
    },
  ];

  const emptyState = (
    <div className="rounded-lg border bg-card p-8 text-center">
      <p className="text-muted-foreground">
        No posts yet. Create your first post to get started!
      </p>
      <Button
        nativeButton={false}
        className="mt-4"
        render={<Link href="/dashboard/posts/new">Create Post</Link>}
      />
    </div>
  );

  return (
    <DataTable
      columns={columns}
      data={posts}
      searchable={false}
      showPagination={false}
      emptyState={emptyState}
    />
  );
}
