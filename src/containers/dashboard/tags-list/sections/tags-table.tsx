"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { TagWithCount } from "@/types/tag";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import type { ColumnDef } from "@tanstack/react-table";
import { TagDeleteConfirmation } from "@/components/dashboard/tag-delete-confirmation";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pencil, Trash2 } from "lucide-react";

interface TagsTableProps {
  tags: TagWithCount[];
}

export function TagsTable({ tags }: TagsTableProps) {
  const router = useRouter();
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    tagId: string;
    tagName: string;
    postCount: number;
  }>({
    isOpen: false,
    tagId: "",
    tagName: "",
    postCount: 0,
  });

  const columns: ColumnDef<TagWithCount>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
      },
      {
        accessorKey: "slug",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Slug" />
        ),
        cell: ({ row }) => (
          <span className="font-mono text-sm text-muted-foreground">
            {row.original.slug}
          </span>
        ),
      },
      {
        accessorKey: "_count.posts",
        header: ({ column }) => (
          <div className="text-center">
            <DataTableColumnHeader column={column} title="Posts" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.original._count.posts}</div>
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
                      size="sm"
                      variant="secondary"
                      nativeButton={false}
                      render={
                        <Link href={`/dashboard/tags/${row.original.id}/edit`}>
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
                          tagId: row.original.id,
                          tagName: row.original.name,
                          postCount: row.original._count.posts,
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
    [router]
  );

  const emptyState = (
    <div className="text-center py-12 border rounded-lg">
      <p className="text-muted-foreground">
        No tags yet. Create your first tag to get started.
      </p>
    </div>
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={tags}
        searchPlaceholder="Search tags..."
        showPagination={false}
        emptyState={emptyState}
      />

      <TagDeleteConfirmation
        tagId={deleteDialog.tagId}
        tagName={deleteDialog.tagName}
        postCount={deleteDialog.postCount}
        isOpen={deleteDialog.isOpen}
        onClose={() =>
          setDeleteDialog({
            isOpen: false,
            tagId: "",
            tagName: "",
            postCount: 0,
          })
        }
      />
    </>
  );
}
